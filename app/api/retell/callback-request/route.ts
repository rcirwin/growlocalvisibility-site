/**
 * POST /api/retell/callback-request
 * In-call custom function: records that the prospect wants Ryan to call back.
 * Updates CRM and sends Ryan a notification email.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByName, updateLeadRow } from "../sheets";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { preferred_time, business_name } = args;

    console.log(`[callback] ${business_name} wants callback at ${preferred_time}`);

    const lead = await findLeadByName(business_name);
    if (lead) {
      await updateLeadRow(lead._row, {
        AQ: "TRUE",
        AO: `Callback requested: ${preferred_time}`,
        AH: new Date().toISOString(),
      });

      // Notify Ryan via email
      try {
        await getResend().emails.send({
          from: "GLV AI Agent <noreply@growlocalvisibility.com>",
          to: "ryan@growlocalvisibility.com",
          subject: `Callback requested: ${lead.business_name}`,
          text: [
            `The AI voice agent just spoke with ${lead.business_name}.`,
            `They want you to call them back.`,
            "",
            `Business: ${lead.business_name}`,
            `Phone: ${lead.phone}`,
            `Owner: ${lead.owner_name || "Unknown"}`,
            `Preferred time: ${preferred_time}`,
            `Category: ${lead.primary_category || "Unknown"}`,
            "",
            `Website: ${lead.vercel_url || "Not built yet"}`,
            `Demo: ${lead.demo_url || "Not recorded yet"}`,
            "",
            `— GLV AI Agent`,
          ].join("\n"),
        });
      } catch (emailErr) {
        console.error("[callback] Notification email failed:", emailErr);
      }
    }

    return NextResponse.json({
      result: `Ryan will call back ${preferred_time}. Got it.`,
    });
  } catch (err) {
    console.error("[callback] Error:", err);
    return NextResponse.json({
      result: "I'll have Ryan give you a call back.",
    });
  }
}
