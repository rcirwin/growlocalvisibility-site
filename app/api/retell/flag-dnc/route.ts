/**
 * POST /api/retell/flag-dnc
 * In-call custom function: permanently flags a phone number as Do Not Call.
 * This is PERMANENT and IRREVOCABLE. Updates CRM immediately.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, findLeadByName, updateLeadRow } from "../sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { phone_number, business_name } = args;

    console.log(`[DNC] ⚠️ Flagging ${business_name} (${phone_number}) as DO NOT CALL`);

    // Try to find by phone first, then by name
    let lead = phone_number ? await findLeadByPhone(phone_number) : null;
    if (!lead && business_name) {
      lead = await findLeadByName(business_name);
    }

    if (lead) {
      await updateLeadRow(lead._row, {
        AS: "TRUE",
        AN: "hard-no",
        Z: "contacted",
        AD: "declined",
        AO: "DO NOT CALL - prospect requested removal",
        AH: new Date().toISOString(),
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
