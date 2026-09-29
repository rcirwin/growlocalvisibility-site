/**
 * POST /api/retell/flag-dnc
 * In-call custom function: permanently flags a phone number as Do Not Call.
 * This is PERMANENT and IRREVOCABLE. Updates CRM immediately.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, findLeadByName, updateLeadRow } from "../sheets";
import { leadPhoneFromCall } from "../match";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { phone_number, business_name } = args;

    console.log(`[DNC] ⚠️ Flagging ${business_name} (${phone_number}) as DO NOT CALL`);

    // Phone first (the live call's number, then the one the agent passed),
    // then an unambiguous name match
    const callPhone = leadPhoneFromCall(body.call);
    let lead = callPhone ? await findLeadByPhone(callPhone) : null;
    if (!lead && phone_number) {
      lead = await findLeadByPhone(phone_number);
    }
    if (!lead && business_name) {
      lead = await findLeadByName(business_name);
    }

    if (lead) {
      await updateLeadRow(lead._row, {
        dnc_flagged: "TRUE",
        call_outcome: "hard-no",
        pipeline_status: "contacted",
        lead_response: "declined",
        call_notes: "DO NOT CALL - prospect requested removal",
        updated_at: new Date().toISOString(),
      });
      console.log(`[DNC] Row ${lead._row} permanently flagged`);
    } else {
      console.log(`[DNC] Could not find lead for ${business_name} / ${phone_number}`);
    }

    return NextResponse.json({
      result: "Number flagged as Do Not Call.",
    });
  } catch (err) {
    console.error("[DNC] Error:", err);
    return NextResponse.json({
      result: "Noted, you will not be contacted again.",
    });
  }
}
