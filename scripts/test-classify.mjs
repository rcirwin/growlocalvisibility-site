// Tests for app/api/retell/classify.ts. Run: npm run test:retell
// Transcripts are paraphrased from real calls reviewed 2026-11-05 (names removed).
import assert from "node:assert/strict";
import { verifyOutcome, endedOutcome } from "../app/api/retell/classify.ts";

const A = (content) => ({ role: "agent", content });
const U = (content) => ({ role: "user", content });
const HELLO = A("Hey, this is Jessie from Grow Local Visibility calling about Acme Plumbing.");
const PITCH = A("I noticed you don't have a website on your Google listing yet. You've got forty great reviews, so I went ahead and built you one. It's totally free and it's yours to keep.");

const cases = [
  // Mislabeled by Retell as interested
  ["one word then hang-up", "interested_no_email", [U("Yeah."), HELLO, PITCH], false, "no_answer"],
  ["hang-up mid-pitch", "interested_no_email", [HELLO, U("Uh-huh."), PITCH], false, "no_answer"],
  ["ambiguous thanks", "interested_no_email", [HELLO, U("Yep."), PITCH, U("On my way to make it. Thank you so much.")], false, "spoke_neutral"],
  ["call screening bot", "interested_no_email", [U("If you record your name and reason for calling, I'll see if this person is available."), HELLO, U("Thanks. Please stay on the line.")], false, "no_answer"],
  ["polite no", "interested_no_email", [HELLO, PITCH, U("I'm okay, I don't need one. Thank you.")], false, "not_interested"],
  ["auto-reply callback", "callback_requested", [A("Hey, this is"), U("Hello, and thanks for reaching out. We have received your inquiry and we'll call you back as soon as possible.")], false, "no_answer"],
  ["voicemail greeting callback", "callback_requested", [U("Hi. You've reached Acme Plumbing. We will call you back. Thank you.")], false, "no_answer"],
  ["IVR", "callback_requested", [U("Thank you for calling. Please listen carefully, our phone system has changed. For sales press one.")], false, "no_answer"],
  ["got_email but our own address", "interested_got_email", [HELLO, PITCH, U("Okay.")], false, "spoke_neutral"],

  // Real interest is kept
  ["asks for the link", "interested_no_email", [HELLO, PITCH, U("How do I know this isn't a scam?"), A("You can check us out."), U("What is the link to the website?")], false, "interested_no_email"],
  ["yes to send question", "interested_no_email", [HELLO, PITCH, A("Can I send you the link by email?"), U("Yes, please.")], false, "interested_no_email"],
  ["gave email", "interested_got_email", [HELLO, PITCH, A("What's your best email?"), U("joe at gmail dot com")], true, "interested_got_email"],
  ["person asks for callback", "callback_requested", [HELLO, U("I'm with a customer, can you call me back in an hour?")], false, "callback_requested"],
  ["send it", "interested_no_email", [HELLO, PITCH, U("Oh nice, yeah send it over.")], false, "interested_no_email"],

  // Untouched
  ["real decline", "not_interested", [HELLO, PITCH, U("Not interested, thanks.")], false, "not_interested"],
  ["voicemail", "voicemail_left", [], false, "voicemail_left"],
];

let failed = 0;
for (const [name, retell, turns, email, want] of cases) {
  const got = verifyOutcome(retell, turns, email).outcome;
  if (got !== want) { failed++; console.error(`FAIL ${name}: ${retell} -> ${got}, want ${want}`); }
}

assert.equal(endedOutcome("user_hangup", [HELLO]), "no-answer");
assert.equal(endedOutcome("user_hangup", [HELLO, U("Hello?")]), "spoke");
assert.equal(endedOutcome("user_hangup", [U("You've reached Acme. Leave a message at the tone.")]), "voicemail-left");
assert.equal(endedOutcome("voicemail_reached", []), "voicemail-left");

if (failed) process.exit(1);
console.log(`classify: ${cases.length} cases + endedOutcome passed`);
