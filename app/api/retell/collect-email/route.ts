/**
 * POST /api/retell/collect-email
 * In-call custom function: records email captured during voice call.
 * Updates CRM immediately so the Outreach agent can send the follow-up email.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByName, findLeadByPhone, updateLeadRow } from "../sheets";
import { leadPhoneFromCall } from "../match";
import { Resend } from "resend";
import { normalizeEmail, usableLeadEmail } from "../email";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { email: rawEmail, business_name } = args;

    const email = usableLeadEmail(rawEmail);
    console.log(`[collect-email] Raw: "${rawEmail}" → Normalized: "${email ?? normalizeEmail(String(rawEmail || ""))}" for ${business_name}`);

    // Never store or send to our own address or an unreadable capture (RYA-293).
    // Ask the agent to confirm the address instead.
    if (!email) {
      console.warn(`[collect-email] Rejected unusable email "${rawEmail}" for ${business_name}`);
      return NextResponse.json({
        result:
          "That email didn't come through clearly. Please ask them to spell it out, letter by letter, and confirm it back.",
      });
    }

    // Update CRM: match the live call's number first, then an unambiguous name
    const callPhone = leadPhoneFromCall(body.call);
    const lead =
      (callPhone ? await findLeadByPhone(callPhone) : null) ||
      (business_name ? await findLeadByName(business_name) : null);
    if (lead) {
      await updateLeadRow(lead._row, {
        email,
        preferred_contact: "email",
        updated_at: new Date().toISOString(),
      });
      console.log(`[collect-email] Updated row ${lead._row}`);

      // Send the website link immediately (no em dashes in customer copy)
      if (lead.vercel_url) {
        try {
          await getResend().emails.send({
            from: "Ryan Irwin <ryan@growlocalvisibility.com>",
            to: email,
            subject: `Your free website for ${lead.business_name}`,
            text: [
              `Hi${lead.owner_name ? ` ${lead.owner_name}` : ""},`,
              "",
              `As promised on the phone, here's the free website we built for ${lead.business_name}:`,
              "",
              `Website: ${lead.vercel_url}`,
              lead.demo_url ? `Video walkthrough: ${lead.demo_url}` : "",
              "",
              `It highlights your ${lead.primary_category || "services"} and showcases your great Google reviews.`,
              "",
              `It's yours to keep, free. No credit card, no contract, and it doesn't expire.`,
              "",
              `The best next step is to add it to your Google Maps listing so people who find you on Google can click straight through. Open your Google Business Profile, choose Edit profile, paste the link above into the Website field, and save. Reply to this email if you'd like a hand.`,
              "",
              `If you ever want more, like your own domain or help ranking higher on Google Maps, every plan is at growlocalvisibility.com. None of it is required.`,
              "",
              `Take a look and let me know what you think! I'm happy to make any changes you'd like, free.`,
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
      result: `Email ${email} recorded for ${business_name}. Sending the website link now.`,
    });
  } catch (err) {
    console.error("[collect-email] Error:", err);
    return NextResponse.json({
      result: "Got it, I'll make sure that email gets the website link.",
    });
  }
}
