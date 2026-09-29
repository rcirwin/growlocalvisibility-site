"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const business = formData.get("business") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || "";
  const googleMaps = (formData.get("google-maps") as string) || "Not provided";
  const message = (formData.get("message") as string) || "No message";

  if (!name || !business || (!phone && !email)) {
    return { success: false, error: "Please add your name, business, and phone number." };
  }

  try {
    await resend.emails.send({
      from: "Grow Local Visibility <noreply@growlocalvisibility.com>",
      to: "ryan@growlocalvisibility.com",
      subject: `Free website request: ${business} (${name})`,
      ...(email ? { replyTo: email } : {}),
      text: [
        `Name: ${name}`,
        `Business: ${business}`,
        `Phone: ${phone || "Not provided"}`,
        `Email: ${email || "Not provided"}`,
        `Google Maps Link: ${googleMaps}`,
        `Message: ${message}`,
      ].join("\n"),
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
