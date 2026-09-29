/**
 * Google Sheets CRM helper for Retell webhook handlers.
 * Reads/writes to the Grow Local Visibility CRM spreadsheet.
 */

import { google } from "googleapis";
import { matchLeadsByName } from "./match";

const SPREADSHEET_ID = "1Jum7Y-95AyFwrGsutpXbDNwvGS3VeUb4oKLq6QKxTW4";
const SHEET_NAME = "Leads";

// Must match the live sheet's header row exactly (source of truth:
// website-builder/scripts/sheets-api.js). Routes write by column NAME, never by
// letter, so inserting a column only requires updating this list.
const HEADERS = [
  "business_name", "ryans_cold_calling_results", "business_slug", "address", "phone", "email", "google_maps_url",
  "services_list", "services_detailed", "description", "owner_name", "years_in_business",
  "service_area", "review_summary", "standout_reviews", "review_count", "average_rating",
  "hours", "photo_urls", "social_links", "certifications", "primary_category",
  "tagline_suggestion", "repo_path", "vercel_url", "demo_url", "pipeline_status",
  "retry_count", "email_sent", "sms_sent", "lead_response", "lead_source",
  "contact_name", "created_at", "updated_at", "error_notes", "additional_info",
  "skills_used", "call_attempts", "last_call_date", "call_outcome", "call_notes",
  "preferred_contact", "callback_requested", "call_recording_url", "dnc_flagged",
  "existing_website", "website_checked_at", "website_check_result",
];

// Column name to letter mapping
function colIndex(name: string): number {
  return HEADERS.indexOf(name);
}

function indexToCol(idx: number): string {
  let col = "";
  let i = idx + 1;
  while (i > 0) {
    i--;
    col = String.fromCharCode(65 + (i % 26)) + col;
    i = Math.floor(i / 26);
  }
  return col;
}

async function getSheets() {
  // Use service account credentials from env var (base64 encoded JSON)
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var not set");
  }

  let credentials;
  try {
    // Try base64 first, then raw JSON
    credentials = JSON.parse(
      Buffer.from(credentialsJson, "base64").toString("utf-8")
    );
  } catch {
    credentials = JSON.parse(credentialsJson);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export type LeadRow = { [key: string]: string | number; _row: number };

export async function readAllLeads(): Promise<LeadRow[]> {
  const sheets = await getSheets();
  const lastCol = indexToCol(HEADERS.length - 1);
  const range = `${SHEET_NAME}!A2:${lastCol}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  const rows = res.data.values || [];
  return rows.map((row, i) => {
    const obj: LeadRow = { _row: i + 2 };
    HEADERS.forEach((h, j) => {
      obj[h] = row[j] || "";
    });
    return obj;
  });
}

export async function findLeadByPhone(
  phone: string
): Promise<LeadRow | null> {
  const digits = phone.replace(/\D/g, "");
  const leads = await readAllLeads();

  for (const lead of leads) {
    const leadDigits = String(lead.phone || "").replace(/\D/g, "");
    if (
      leadDigits.length >= 10 &&
      leadDigits.slice(-10) === digits.slice(-10)
    ) {
      return lead;
    }
  }
  return null;
}

/** Every lead matching a spoken business name (see match.ts for the rules). */
export async function findLeadsByName(businessName: string): Promise<LeadRow[]> {
  return matchLeadsByName<LeadRow>(await readAllLeads(), businessName);
}

/** The lead matching a spoken business name, or null if none or ambiguous. */
export async function findLeadByName(
  businessName: string
): Promise<LeadRow | null> {
  const matches = await findLeadsByName(businessName);
  return matches.length === 1 ? matches[0] : null;
}

export async function updateLeadRow(
  row: number,
  updates: Record<string, string>
): Promise<void> {
  const sheets = await getSheets();

  const requests = Object.entries(updates).map(([colName, value]) => {
    // Accept either column letter (e.g., "E") or column name (e.g., "email")
    let idx: number;
    if (/^[A-Z]{1,2}$/.test(colName)) {
      // Column letter
      idx = colName.length === 1
        ? colName.charCodeAt(0) - 65
        : (colName.charCodeAt(0) - 64) * 26 + (colName.charCodeAt(1) - 65);
    } else {
      idx = colIndex(colName);
    }

    if (idx < 0) {
      console.warn(`Unknown column: ${colName}`);
      return null;
    }

    const col = indexToCol(idx);
    return sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${col}${row}`,
      valueInputOption: "RAW",
      requestBody: { values: [[value]] },
    });
  });

  await Promise.all(requests.filter(Boolean));
}
