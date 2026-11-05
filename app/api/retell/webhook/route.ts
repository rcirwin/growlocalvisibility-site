/**
 * POST /api/retell/webhook
 * Handles post-call events from Retell AI (call_ended, call_analyzed).
 * Updates Google Sheets CRM with call results.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, updateLeadRow } from "../sheets";
import { shouldWriteEmail, usableLeadEmail } from "../email";
import { endedOutcome, verifyOutcome } from "../classify";

// Outcome mapping: Retell post-call analysis → CRM columns (by name)
const OUTCOME_MAP: Record<string, Record<string, string>> = {
  interested_got_email: { call_outcome: "spoke-interested", pipeline_status: "contacted", lead_response: "interested" },
  interested_no_email: { call_outcome: "spoke-interested", pipeline_status: "contacted", lead_response: "interested" },
  not_interested: { call_outcome: "spoke-declined", pipeline_status: "contacted", lead_response: "declined" },
  hard_no_dnc: { call_outcome: "hard-no", pipeline_status: "contacted", lead_response: "declined", dnc_flagged: "TRUE" },
  voicemail_left: { call_outcome: "voicemail-left" },
  no_answer: { call_outcome: "no-answer" },
  // Set by verifyOutcome() when a positive Retell label is not backed by the transcript.
  spoke_neutral: { call_outcome: "spoke-neutral" },
  wrong_number: { call_outcome: "wrong-number", pipeline_status: "failed-voice", error_notes: "Wrong number or disconnected" },
  // A callback request is not interest: the lead has not said yes to the site yet.
  callback_requested: { call_outcome: "spoke-neutral", callback_requested: "TRUE" },
  already_has_website_builder: { call_outcome: "spoke-declined", pipeline_status: "contacted", lead_response: "declined" },
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
      // call_attempts is NOT incremented here: the voice-caller run writes a
      // placement marker (call_attempts + 1) when it dials (RYA-275), so
      // incrementing again would double-count and burn the 3-attempt limit.
      // The caller run also owns the failed-voice transition for that reason.
      const updates: Record<string, string> = {
        last_call_date: new Date().toISOString(),
        call_recording_url: call.recording_url || "",
        updated_at: new Date().toISOString(),
      };

      // Map disconnection reason. A hang-up where the prospect said nothing
      // (or only a recording spoke) is not "spoke".
      updates.call_outcome = endedOutcome(call.disconnection_reason || "", call.transcript_object);

      await updateLeadRow(lead._row, updates);
    }

    if (event === "call_analyzed") {
      const analysis = call.call_analysis || {};
      const custom = analysis.custom_analysis_data || {};
      const updates: Record<string, string> = {
        updated_at: new Date().toISOString(),
      };

      // Email captured. Retell often records our own address here (RYA-293),
      // so only a usable, non-GLV email is written, and a real address
      // already in the CRM is only replaced when the lead gave one on the call.
      const capturedEmail = usableLeadEmail(custom.email_captured);

      // Map outcome, after checking Retell's label against the transcript.
      // Retell marks most mid-pitch hang-ups "interested" and reads
      // auto-replies as callback requests (2026-11-05 review: 1 real lead of 11).
      const verdict = verifyOutcome(custom.call_outcome || "", call.transcript_object, !!capturedEmail);
      if (verdict.outcome && OUTCOME_MAP[verdict.outcome]) {
        Object.assign(updates, OUTCOME_MAP[verdict.outcome]);
      }
      const verifiedCallback = verdict.outcome === "callback_requested";
      if (capturedEmail && shouldWriteEmail(lead.email as string, verdict.outcome)) {
        updates.email = capturedEmail;
        updates.preferred_contact = "email";
      } else if (custom.email_captured) {
        console.log(`[webhook] Skipped email_captured "${custom.email_captured}" (row ${lead._row})`);
      }

      // Call summary + notes
      const notes: string[] = [];
      if (custom.call_summary) notes.push(custom.call_summary);
      if (verdict.downgradeReason) notes.push(`Auto-check: ${verdict.downgradeReason}, wrote ${verdict.outcome}`);
      if (custom.callback_time && (verifiedCallback || verdict.outcome.startsWith("interested"))) {
        updates.callback_requested = "TRUE";
        notes.push(`Callback requested: ${custom.callback_time}`);
      }
      // Paid-plan interest (quoted only when the lead asks). Growth interest
      // goes to Ryan personally while its fulfillment is still being built.
      if (custom.plan_interest && custom.plan_interest !== "none") {
        notes.push(`Plan interest: ${custom.plan_interest}`);
        if (custom.plan_interest === "growth_199") updates.callback_requested = "TRUE";
      }
      if (custom.sentiment) notes.push(`Sentiment: ${custom.sentiment}`);
      if (custom.objections_raised) notes.push(`Objections: ${custom.objections_raised}`);
      if (notes.length > 0) updates.call_notes = notes.join(" | ");

      await updateLeadRow(lead._row, updates);
      console.log(`[webhook] Analyzed: outcome=${custom.call_outcome}, email=${custom.email_captured || "none"}`);
    }

    return NextResponse.json({ status: "ok", event, lead: lead.business_name });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
