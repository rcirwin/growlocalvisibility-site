/**
 * POST /api/retell/collect-email
 * In-call custom function: records email captured during voice call.
 * Updates CRM immediately so the Outreach agent can send the follow-up email.
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
    const { email, business_name } = args;

    console.log(`[collect-email] ${email} for ${business_name}`);

    // Update CRM
    const lead = await findLeadByName(business_name);
    if (lead) {
      await updateLeadRow(lead._row, {
        E: email,
        AP: "email",
        AH: new Date().toISOString(),
      });
      console.log(`[collect-email] Updated row ${lead._row}`);

      // Send the website + demo email immediately
      if (lead.vercel_url) {
        try {
          await getResend().emails.send({
            from: "Ryan Irwin <ryan@growlocalvisibility.com>",
            to: email,
            subject: `Your free website for ${lead.business_name}`,
            text: [
              `Hi${lead.owner_name ? ` ${lead.owner_name}` : ""},`,
              "",
              `As promised on the phone, here's the website we built for ${lead.business_name}:`,
              "",
              `Website: ${lead.vercel_url}`,
              lead.demo_url ? `Video walkthrough: ${lead.demo_url}` : "",
              "",
              `It highlights your ${lead.primary_category || "services"} and showcases your great Google reviews.`,
              "",
              `The preview is completely free for 14 days. If you love it and want to keep it live, it's $99/month — that includes hosting, updates, Google Business Profile optimization, monthly SEO reports, and automated review responses.`,
              "",
              `Or you can own the website outright for a one-time $500.`,
              "",
              `Take a look and let me know what you think! I'm happy to make any changes you'd like.`,
              "",
              `Ryan Irwin`,
              `Grow Local Visibility`,
              `ryan@growlocalvisibility.com`,
              `growlocalvisibility.com`,
            ]
              .filter(Boolean)
              .join("\n"),
          });
          console.log(`[collect-email] Follow-up email sent to ${email}`);
        } catch (emailErr) {
          console.error(`[collect-email] Email send failed:`, emailErr);
        }
      }
    }

    return NextResponse.json({
      result: `Email ${email} recorded for ${business_name}. Sending website and demo video now.`,
    });
  } catch (err) {
    console.error("[collect-email] Error:", err);
    return NextResponse.json({
      result: "Got it, I'll make sure that email gets the website link.",
    });
  }
}
