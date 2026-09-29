/**
 * Lead matching for in-call CRM lookups. Kept free of googleapis so it can be
 * tested on its own.
 *
 * Precision over recall: a wrong match makes the voice agent quote another
 * business's details, or writes an email/callback onto the wrong CRM row. A
 * miss only means the agent asks the caller for more detail. Phone matching is
 * always tried before names.
 */

const FILLER = new Set(["the", "and", "llc", "inc", "co", "corp", "company", "ltd"]);

/** Lowercased words of a business name, ignoring punctuation and filler. */
export function nameTokens(name: string): string[] {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // "Jardinería" -> "Jardineria"
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t && !FILLER.has(t));
}

type Named = Record<string, unknown>; // any row with a business_name field

/**
 * Leads matching a spoken business name. An exact (normalized) match wins
 * outright. Otherwise the caller must have said at least two words, all of
 * them in the lead's name, covering at least half of it: "Del Paso Plumbing"
 * finds "Del Paso Heights Plumbing", but a lone word like "Plumbing" only
 * matches a business named exactly that. More than one result means the name
 * is ambiguous; callers must not pick one.
 */
export function matchLeadsByName<T extends Named>(leads: T[], query: string): T[] {
  const q = nameTokens(query);
  if (q.length === 0) return [];

  const key = q.join(" ");
  const exact = leads.filter((l) => nameTokens(String(l.business_name ?? "")).join(" ") === key);
  if (exact.length > 0) return exact;

  if (q.length < 2) return [];

  return leads.filter((l) => {
    const name = nameTokens(String(l.business_name ?? ""));
    if (name.length === 0 || q.length * 2 < name.length) return false;
    const words = new Set(name);
    return q.every((t) => words.has(t));
  });
}

/**
 * The lead's phone number from the Retell call object that custom-function
 * requests carry: the number we dialed on outbound calls, the caller's number
 * on inbound ones.
 */
export function leadPhoneFromCall(call: unknown): string {
  if (!call || typeof call !== "object") return "";
  const c = call as { direction?: string; to_number?: string; from_number?: string };
  return (c.direction === "inbound" ? c.from_number : c.to_number) || "";
}
