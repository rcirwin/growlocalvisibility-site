/**
 * POST /api/retell/webhook
 * Handles post-call events from Retell AI (call_ended, call_analyzed).
 * Updates Google Sheets CRM with call results.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, updateLeadRow } from "../sheets";

// Outcome mapping: Retell post-call analysis → CRM columns
const OUTCOME_MAP: Record<string, Record<string, string>> = {
  interested_got_email: { AN: "spoke-interested", Z: "contacted", AD: "interested" },
  interested_no_email: { AN: "spoke-interested", Z: "contacted", AD: "interested" },
  not_interested: { AN: "spoke-declined", Z: "contacted", AD: "declined" },
  hard_no_dnc: { AN: "hard-no", Z: "contacted", AD: "declined", AS: "TRUE" },
  voicemail_left: { AN: "voicemail-left" },
  no_answer: { AN: "no-answer" },
  wrong_number: { AN: "wrong-number", Z: "failed-voice", AI: "Wrong number or disconnected" },
  callback_requested: { AN: "spoke-interested", AQ: "TRUE" },
  already_has_website_builder: { AN: "spoke-declined", Z: "contacted", AD: "declined" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event as string;
    const call = body.call;

    if (!call) {
      return NextResponse.json({ status: "ok", message: "no call data" });
    }

    const toNumber = call.to_number || "";
    const lead = await findLeadByPhone(toNumber);

    if (!lead) {
      console.log(`[webhook] No CRM lead for phone: ${toNumber}`);
      return NextResponse.json({ status: "ok", message: "lead not found" });
    }

    console.log(`[webhook] ${event} | ${lead.business_name} (row ${lead._row})`);

    if (event === "call_ended") {
      const currentAttempts = parseInt(String(lead.call_attempts || "0"), 10);
      const updates: Record<string, string> = {
        AL: String(currentAttempts + 1),
        AM: new Date().toISOString(),
        AR: call.recording_url || "",
        AH: new Date().toISOString(),
      };

      // Map disconnection reason
      const reason = call.disconnection_reason || "";
      if (reason.includes("voicemail")) {
        updates.AN = "voicemail-left";
      } else if (["user_hangup", "agent_hangup"].includes(reason)) {
        updates.AN = "spoke";
      } else if (["no_answer", "busy"].includes(reason)) {
        updates.AN = "no-answer";
      } else {
        updates.AN = reason || "unknown";
      }

      // Max attempts check
      if (currentAttempts + 1 >= 3 && updates.AN !== "spoke") {
        updates.Z = "failed-voice";
        updates.AI = "Max 3 call attempts without live conversation";
      }

      await updateLeadRow(lead._row, updates);
    }

    if (event === "call_analyzed") {
      const analysis = call.call_analysis || {};
      const custom = analysis.custom_analysis_data || {};
      const updates: Record<string, string> = {
        AH: new Date().toISOString(),
      };

      // Map outcome
      if (custom.call_outcome && OUTCOME_MAP[custom.call_outcome]) {
        Object.assign(updates, OUTCOME_MAP[custom.call_outcome]);
      }

      // Email captured
      if (custom.email_captured) {
        updates.E = custom.email_captured;
        updates.AP = "email";
      }

      // Call summary + notes
      const notes: string[] = [];
      if (custom.call_summary) notes.push(custom.call_summary);
      if (custom.callback_time) {
        updates.AQ = "TRUE";
        notes.push(`Callback requested: ${custom.callback_time}`);
      }
      if (custom.sentiment) notes.push(`Sentiment: ${custom.sentiment}`);
      if (custom.objections_raised) notes.push(`Objections: ${custom.objections_raised}`);
      if (notes.length > 0) updates.AO = notes.join(" | ");

      await updateLeadRow(lead._row, updates);
      console.log(`[webhook] Analyzed: outcome=${custom.call_outcome}, email=${custom.email_captured || "none"}`);
    }

    return NextResponse.json({ status: "ok", event, lead: lead.business_name });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
