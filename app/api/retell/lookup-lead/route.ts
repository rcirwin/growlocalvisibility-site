/**
 * POST /api/retell/lookup-lead
 * In-call custom function: looks up a lead in the CRM by business name or phone number.
 * Returns key info the agent can use in conversation.
 *
 * SECURITY: Full details (website URL, services, reviews) are only returned if:
 *   1. The caller_phone matches the lead's phone number (verified caller), OR
 *   2. The lookup is from an outbound call (we called them, so we know who they are)
 *
 * If an unverified caller asks about a different business, only basic public info
 * (name, category) is returned — no URLs, emails, or detailed data.
 */

import { NextRequest, NextResponse } from "next/server";
import { findLeadByPhone, findLeadByName, readAllLeads, type LeadRow } from "../sheets";

function phoneLast10(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

function formatFullDetails(lead: LeadRow): string {
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

function formatLimitedDetails(lead: LeadRow): string {
  // Only return info that's publicly available (Google Maps level)
  const parts: string[] = [];
  parts.push(`Business: ${lead.business_name}`);
  if (lead.primary_category) parts.push(`Category: ${lead.primary_category}`);
  if (lead.service_area) parts.push(`Area: ${lead.service_area}`);

  // Don't reveal: website URL, email, services detail, reviews, call history
  if (lead.vercel_url) {
    parts.push(`Website status: We do have a website ready for this business`);
  } else {
    parts.push(`Website status: Not started yet`);
  }

  return parts.join(". ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const args = body.args || body;
    const { business_name, phone_number, caller_phone, call_direction } = args;

    console.log(`[lookup] Search: name="${business_name || ""}" phone="${phone_number || ""}" caller="${caller_phone || ""}" dir="${call_direction || ""}"`);

    let lead: LeadRow | null = null;

    // Try phone first (more precise), then name
    if (phone_number) {
      lead = await findLeadByPhone(phone_number);
    }
    if (!lead && business_name) {
      lead = await findLeadByName(business_name);
    }

    // Partial match fallback
    if (!lead && business_name) {
      const allLeads = await readAllLeads();
      const lower = business_name.toLowerCase();
      lead = allLeads.find(l => {
        const name = String(l.business_name || "").toLowerCase();
        const searchWords = lower.split(/\s+/);
        return searchWords.some((w: string) => w.length > 2 && name.includes(w));
      }) || null;
    }

    if (!lead) {
      return NextResponse.json({
        result: "I don't have any information on that business yet. If you give me their name and details, I can pass it along to Ryan and we can get a website started for them.",
      });
    }

    // Security check: is the caller verified?
    const isOutbound = call_direction === "outbound";
    const callerVerified = caller_phone
      ? phoneLast10(caller_phone) === phoneLast10(String(lead.phone || ""))
      : false;
    const fullAccess = isOutbound || callerVerified;

    if (fullAccess) {
      const info = formatFullDetails(lead);
      console.log(`[lookup] FULL details for ${lead.business_name} (verified: caller=${callerVerified}, outbound=${isOutbound})`);
      return NextResponse.json({
        result: `I found their info. ${info}`,
      });
    } else {
      const info = formatLimitedDetails(lead);
      console.log(`[lookup] LIMITED details for ${lead.business_name} (unverified caller)`);
      return NextResponse.json({
        result: `I found some info but I can only share details with the business owner directly. ${info}. If you're the owner, can you confirm the phone number on file so I can pull up the full details?`,
      });
    }
  } catch (err) {
    console.error("[lookup] Error:", err);
    return NextResponse.json({
      result: "I'm having trouble looking that up right now. Let me take down your info and have Ryan follow up.",
    });
  }
}
