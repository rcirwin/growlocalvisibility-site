"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const business = formData.get("business") as string;
  const phone = (formData.get("phone") as string) || "Not provided";
  const email = formData.get("email") as string;
  const googleMaps = (formData.get("google-maps") as string) || "Not provided";
  const message = (formData.get("message") as string) || "No message";

  if (!name || !business || !email) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await resend.emails.send({
      from: "Grow Local Visibility <onboarding@resend.dev>",
      to: "ryan@growlocalvisibility.com",
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Business: ${business}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
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
