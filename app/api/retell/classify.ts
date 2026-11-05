/**
 * Transcript check for Retell's post-call call_outcome. Kept free of
 * googleapis and Next so it can be tested on its own.
 *
 * Retell's analysis labels a call `interested_no_email` whenever someone picks
 * up and Jessie gets the pitch out before they hang up ("Yeah." then a click).
 * It also reads automated replies (rental-office texts, phone menus) as
 * `callback_requested`. A 2026-11-05 review of 11 "interested" rows found one
 * real lead. So positive labels are only kept when the prospect's own words
 * show it; everything else is downgraded before it reaches the CRM.
 */

export type TranscriptTurn = { role: string; content: string };

export type Verdict = {
  /** The call_outcome to apply (a key of the webhook's OUTCOME_MAP). */
  outcome: string;
  /** Set when the Retell label was overridden, for call_notes. */
  downgradeReason?: string;
};

// Recorded greetings, phone menus and auto-replies, not a person.
const AUTOMATED_RE =
  /\bpress\s+(one|two|three|four|five|six|seven|eight|nine|zero|\d)\b|\bextension\b|leave (your|a) (name|message)|at the tone|mailbox|your call is important|please stay on the line|record your name|sent a message, the content is|we have received your inquiry|business hours|we are (currently )?closed|you'?ve reached|please listen carefully|(menu|options) (has|have) changed|phone system has changed|we will call you back/i;

// Clear no / brush-off from the prospect.
const NEGATIVE_RE =
  /not interested|no,? thanks?|no thank you|don'?t (want|need)|do not (want|need)|already (have|got|made|built|working)|we'?re (good|fine|okay|ok)|i'?m (good|fine|okay|ok)\b|remove (me|us)|stop calling|don'?t call|retired|go fuck|fuck (you|yourself)/i;

// Words a prospect only says when they want the site.
const STRONG_POSITIVE_RE =
  /\b(send (it|me|that|the link|over)|text (it|me)|email (it|me)|what'?s the (link|website|url|address)|what is the (link|website|url|address)|link to the (site|website)|(i'?m|we'?re|sounds|that'?s|i am) (interested|great|good|awesome|perfect)|sounds good|i'?d like (it|that|to see)|love (it|that|to see)|let me see it|go ahead)\b/i;

// A short yes, which only counts as an answer to Jessie asking to send it.
const AFFIRMATIVE_RE = /^\W*(yes|yeah|yep|yup|sure|ok(ay)?|please|absolutely|definitely|go ahead|totally|of course)\b/i;
const SEND_QUESTION_RE = /\b(send|email|text)\b[^?]*\?|\b(link|email address|best email)\b[^?]*\?/i;

// Asking to be called back later (from a person, not a recording).
const CALLBACK_RE =
  /call (me |us |you )?(right )?back|call (me |us )?(later|tomorrow|another time)|try (me |us )?(again )?(later|tomorrow)|i'?m (busy|driving|with a customer|on a job)|bad time/i;

// Jessie's pitch line: the point after which the prospect has heard the offer.
const PITCH_RE = /built (you|it|one|a|them|\w[\w&'. -]* a) (one|free )?(free )?website|built you one|built one/i;

const NOISE_RE = /^\s*\((unintelligible audio|sent a message[\s\S]*)\)\s*$/i;

function userTurns(turns: TranscriptTurn[]): TranscriptTurn[] {
  return turns.filter((t) => t.role === "user");
}

function cleanText(turns: TranscriptTurn[]): string {
  return turns
    .map((t) => t.content)
    .filter((c) => !NOISE_RE.test(c))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(s: string): number {
  return s ? s.split(/\s+/).filter(Boolean).length : 0;
}

/** True if the user side of the call is a recording or an auto-reply. */
export function looksAutomated(turns: TranscriptTurn[]): boolean {
  return userTurns(turns).some((t) => AUTOMATED_RE.test(t.content));
}

/** True when the prospect said something that shows they want the site. */
export function expressedInterest(turns: TranscriptTurn[]): boolean {
  const pitchAt = turns.findIndex((t) => t.role === "agent" && PITCH_RE.test(t.content));
  const after = pitchAt >= 0 ? turns.slice(pitchAt + 1) : turns;
  const userText = cleanText(userTurns(after));
  if (!userText || NEGATIVE_RE.test(userText)) return false;
  if (STRONG_POSITIVE_RE.test(userText)) return true;
  // "Yes" right after "Can I send you the link?"
  for (let i = 1; i < after.length; i++) {
    const prev = after[i - 1];
    const cur = after[i];
    if (cur.role === "user" && prev.role === "agent" && SEND_QUESTION_RE.test(prev.content) && AFFIRMATIVE_RE.test(cur.content)) {
      return true;
    }
  }
  return false;
}

/** No-one spoke back after the pitch (hung up mid-pitch, or never engaged). */
function silentAfterPitch(turns: TranscriptTurn[]): boolean {
  const pitchAt = turns.findIndex((t) => t.role === "agent" && PITCH_RE.test(t.content));
  if (pitchAt < 0) return true; // never got the offer out
  return wordCount(cleanText(userTurns(turns.slice(pitchAt + 1)))) === 0;
}

/**
 * Decide the outcome to write. `retellOutcome` is Retell's
 * custom_analysis_data.call_outcome; `emailUsable` says whether the captured
 * email passed usableLeadEmail().
 */
export function verifyOutcome(retellOutcome: string, turns: TranscriptTurn[] | undefined, emailUsable: boolean): Verdict {
  const t = turns || [];
  const automated = looksAutomated(t);
  const humanText = cleanText(userTurns(t).filter((u) => !AUTOMATED_RE.test(u.content)));

  const downgrade = (reason: string): Verdict => {
    let outcome: string;
    if (automated && !expressedInterest(t) && !NEGATIVE_RE.test(humanText)) outcome = "no_answer";
    else if (NEGATIVE_RE.test(humanText)) outcome = "not_interested";
    else if (silentAfterPitch(t)) outcome = "no_answer";
    else outcome = "spoke_neutral";
    return { outcome, downgradeReason: `Retell said ${retellOutcome}; ${reason}` };
  };

  switch (retellOutcome) {
    case "interested_got_email":
      if (emailUsable && !automated) return { outcome: retellOutcome };
      if (expressedInterest(t)) return { outcome: "interested_no_email", downgradeReason: `Retell said ${retellOutcome}; no usable email` };
      return downgrade("no usable email and no interest in transcript");

    case "interested_no_email":
      if (expressedInterest(t)) return { outcome: retellOutcome };
      return downgrade(automated ? "answered by a recording/IVR" : "prospect never said yes (hung up or brief reply)");

    case "callback_requested":
      if (!automated && CALLBACK_RE.test(humanText)) return { outcome: retellOutcome };
      return downgrade(automated ? "callback came from a recording/auto-reply" : "no callback request in transcript");

    case "not_interested":
    case "hard_no_dnc":
      // A recording ("we are closed") is not a declining human.
      if (automated && wordCount(humanText) === 0) return { outcome: "no_answer", downgradeReason: `Retell said ${retellOutcome}; answered by a recording/IVR` };
      return { outcome: retellOutcome };

    default:
      return { outcome: retellOutcome };
  }
}

/** call_ended: a user hang-up with nothing said is not a conversation. */
export function endedOutcome(reason: string, turns: TranscriptTurn[] | undefined): string {
  if (reason.includes("voicemail")) return "voicemail-left";
  if (["no_answer", "busy", "dial_no_answer", "dial_busy"].includes(reason)) return "no-answer";
  if (["user_hangup", "agent_hangup", "inactivity"].includes(reason)) {
    const t = turns || [];
    const human = cleanText(userTurns(t).filter((u) => !AUTOMATED_RE.test(u.content)));
    if (wordCount(human) === 0) return looksAutomated(t) ? "voicemail-left" : "no-answer";
    return "spoke";
  }
  return reason || "unknown";
}
