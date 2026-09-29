/**
 * POST /api/retell/lookup-lead
 * In-call custom function: looks up a lead in the CRM by business name or phone number.
 * Returns all available info — everything is from public Google Maps data anyway.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, findLeadsByName, type LeadRow } from "../sheets";
import { leadPhoneFromCall } from "../match";

function formatLeadForAgent(lead: LeadRow): string {
  const parts: string[] = [];

  parts.push(`Business: ${lead.business_name}`);
  if (lead.owner_name) parts.push(`Owner: ${lead.owner_name}`);
  if (lead.primary_category) parts.push(`Category: ${lead.primary_category}`);
  if (lead.services_list) parts.push(`Services: ${lead.services_list}`);
  if (lead.review_count) parts.push(`Reviews: ${lead.review_count} reviews, ${lead.average_rating} stars`);
  if (lead.service_area) parts.push(`Area: ${lead.service_area}`);

  if (lead.vercel_url) {
    parts.push(`Website URL: ${lead.vercel_url}`);
    parts.push(`Website status: BUILT AND LIVE`);
  } else if (lead.pipeline_status === "built" || lead.pipeline_status === "deployed") {
    parts.push(`Website status: Built but not fully deployed yet`);
  } else if (lead.pipeline_status === "researched") {
    parts.push(`Website status: Being built right now`);
  } else if (lead.pipeline_status === "new") {
    parts.push(`Website status: In the queue, not started yet`);
  }

  if (lead.demo_url) parts.push(`Demo video: ${lead.demo_url}`);

  if (lead.review_summary) {
    const summary = String(lead.review_summary);
    parts.push(`What customers say: ${summary.substring(0, 200)}`);
  }

  if (lead.call_attempts && Number(lead.call_attempts) > 0) {
    parts.push(`Previous call attempts: ${lead.call_attempts}`);
    if (lead.call_outcome) parts.push(`Last call result: ${lead.call_outcome}`);
  }

  if (lead.email) parts.push(`Email on file: ${lead.email}`);
  if (lead.dnc_flagged === "TRUE") parts.push(`WARNING: This lead is flagged DO NOT CALL`);

  return parts.join(". ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { business_name, phone_number, caller_phone } = args;

    console.log(`[lookup] Search: name="${business_name || ""}" phone="${phone_number || caller_phone || ""}"`);

    let lead: LeadRow | null = null;

    // Phone first (exact): a number the agent passed, then the lead's number
    // from the live call itself.
    for (const phone of [phone_number, caller_phone, leadPhoneFromCall(body.call)]) {
      if (lead) break;
      if (phone) lead = await findLeadByPhone(String(phone));
    }

    // Then the name, only if it identifies exactly one lead.
    if (!lead && business_name) {
      const matches = await findLeadsByName(business_name);
      if (matches.length > 1) {
        console.log(`[lookup] Ambiguous: "${business_name}" matched ${matches.length} leads`);
        return NextResponse.json({
          result: `I found a few businesses with a name like that. Can you tell me the city they're in, or the phone number on their Google listing?`,
        });
      }
      lead = matches[0] || null;
    }

    if (!lead) {
      return NextResponse.json({
        result: "I don't have any information on that business yet. If you give me their name and details, I can pass it along to Ryan and we can get a website started for them.",
      });
    }

    const info = formatLeadForAgent(lead);
    console.log(`[lookup] Found: ${lead.business_name} (row ${lead._row})`);
    return NextResponse.json({
      result: `I found their info. ${info}`,
    });
  } catch (err) {
    console.error("[lookup] Error:", err);
    return NextResponse.json({
      result: "I'm having trouble looking that up right now. Let me take down your info and have Ryan follow up.",
    });
  }
}
