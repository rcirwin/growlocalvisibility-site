/**
 * POST /api/retell/collect-email
 * In-call custom function: records email captured during voice call.
 * Updates CRM immediately so the Outreach agent can send the follow-up email.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByName, findLeadByPhone, updateLeadRow } from "../sheets";
import { leadPhoneFromCall } from "../match";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

/**
 * Normalize spoken email into proper format.
 * Handles: "buddy at buddy dot com" → "buddy@buddy.com"
 *          "john dot smith at gmail dot com" → "john.smith@gmail.com"
 *          "info at tonys-plumbing dot net" → "info@tonys-plumbing.net"
 */
function normalizeEmail(spoken: string): string {
  let email = spoken.trim().toLowerCase();

  // Replace spoken patterns with symbols
  email = email.replace(/\s+at\s+/g, "@");
  email = email.replace(/\s+dot\s+/g, ".");
  email = email.replace(/\s+dash\s+/g, "-");
  email = email.replace(/\s+underscore\s+/g, "_");

  // Remove any remaining spaces
  email = email.replace(/\s+/g, "");

  // Basic validation — if it doesn't look like an email, return as-is
  if (!email.includes("@") || !email.includes(".")) {
    console.warn(`[collect-email] Could not normalize email: "${spoken}" → "${email}"`);
  }

  return email;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { email: rawEmail, business_name } = args;

    const email = normalizeEmail(rawEmail);
    console.log(`[collect-email] Raw: "${rawEmail}" → Normalized: "${email}" for ${business_name}`);

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
