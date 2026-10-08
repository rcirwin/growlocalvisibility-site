/**
 * Email hygiene for voice-call captures. Kept free of googleapis so it can be
 * tested on its own.
 *
 * The voice agent reads our own address out loud ("email me at
 * ryan@growlocalvisibility.com"), and Retell's post-call analysis has been
 * recording that as the prospect's email_captured, overwriting real research
 * emails in column F (RYA-293). Never store our own domain on a lead.
 */

const OWN_DOMAINS = ["growlocalvisibility.com"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/;

/**
 * Normalize a spoken email into proper format.
 * "john dot smith at gmail dot com" -> "john.smith@gmail.com"
 */
export function normalizeEmail(spoken: string): string {
  return spoken
    .trim()
    .toLowerCase()
    .replace(/\s+at\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s+dash\s+/g, "-")
    .replace(/\s+underscore\s+/g, "_")
    .replace(/\s+/g, "");
}

/** True for one of our own addresses. */
export function isOwnEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] || "";
  return OWN_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

// Spelled-out digits can't be normalized safely: "john the plumber five nine
// at gmail dot com" would collapse to johntheplumberfivenine@gmail.com when
// the real address is johntheplumber59@gmail.com.
const SPOKEN_DIGIT_RE = /\b(zero|oh|one|two|three|four|five|six|seven|eight|nine)\b/i;

/**
 * The normalized email if it is a well-formed address that isn't ours,
 * otherwise null. Captures that can't be normalized reliably are rejected
 * rather than written to the CRM.
 */
export function usableLeadEmail(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const spoken = String(raw);
  if (/\s/.test(spoken.trim()) && SPOKEN_DIGIT_RE.test(spoken)) return null;
  const email = normalizeEmail(spoken);
  if (!EMAIL_RE.test(email) || isOwnEmail(email)) return null;
  return email;
}

/**
 * Whether a post-call capture may replace what's already in column F.
 * A blank or our-own-domain cell is always fillable. A real address is only
 * replaced when the prospect explicitly gave an email on the call
 * (interested_got_email); a voicemail greeting or a misheard capture must not
 * clobber an address the researcher found.
 */
export function shouldWriteEmail(
  existing: string | undefined | null,
  callOutcome: string | undefined | null
): boolean {
  const current = String(existing || "").trim();
  if (!current || isOwnEmail(current)) return true;
  return callOutcome === "interested_got_email";
}
