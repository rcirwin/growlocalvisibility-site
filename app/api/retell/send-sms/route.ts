/**
 * POST /api/retell/send-sms
 * In-call custom function: sends website link via SMS during the call.
 * Note: Requires A2P registration to be complete for custom SMS.
 * Until then, returns a message that the link will be emailed instead.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { phone_number, website_url, business_name } = args;

    console.log(`[send-sms] Request to text ${phone_number} for ${business_name}: ${website_url}`);

    // TODO: Integrate with Retell SMS API or Twilio once A2P registration is complete
    // For now, the email collection function handles delivery

    return NextResponse.json({
      result: `I'll make sure the website link for ${business_name} gets sent over. In the meantime, if you share your email I can send everything there right away.`,
    });
  } catch (err) {
    console.error("[send-sms] Error:", err);
    return NextResponse.json({
      result: "I'll get that link sent over to you.",
    });
  }
}
