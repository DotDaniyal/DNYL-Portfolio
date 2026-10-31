/**
 * Central Communication & Contact Configuration for DNYL Portfolio
 * Daniyal Hayat — https://dnyl.vercel.app/
 */

export interface CommunicationConfig {
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientPhoneDisplay: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  websiteUrl: string;
  websiteName: string;
  presetInquiries: {
    id: string;
    label: string;
    subject: string;
    promptTemplate: string;
  }[];
}

export const DNYL_COMMUNICATION_CONFIG: CommunicationConfig = {
  recipientName: "Daniyal Hayat",
  recipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || "mdaniyalhayyat@gmail.com",
  recipientPhone: "+923331001904",
  recipientPhoneDisplay: "+92 333 1001904",
  whatsappNumber: process.env.VITE_WHATSAPP_PHONE_NUMBER || "923331001904",
  whatsappDisplay: "+92 333 1001904",
  websiteUrl: "https://dnyl.vercel.app/",
  websiteName: "DNYL // Daniyal Hayat Portfolio",
  presetInquiries: [
    {
      id: "web-dev",
      label: "Web Platform Development",
      subject: "Project Inquiry: Full-Stack Web Platform",
      promptTemplate:
        "Hi Daniyal, I came across your DNYL portfolio (dnyl.vercel.app) and would like to discuss a web platform development project."
    },
    {
      id: "android-dev",
      label: "Kotlin Android Application",
      subject: "Project Inquiry: Native Android Mobile App",
      promptTemplate:
        "Hi Daniyal, I reviewed your work on DNYL and would like to consult on an Android application architecture/build."
    },
    {
      id: "gemini-ai",
      label: "Google Gemini AI Systems",
      subject: "Project Inquiry: Gemini AI Integration",
      promptTemplate:
        "Hi Daniyal, I'm reaching out from your portfolio regarding Gemini AI integration and intelligent software design."
    },
    {
      id: "audit-consult",
      label: "Architecture & Code Audit",
      subject: "Consulting: Architecture & Code Review",
      promptTemplate:
        "Hi Daniyal, I would like to book a technical consultation / code audit for our engineering stack."
    },
    {
      id: "general-chat",
      label: "General Discussion & Collaboration",
      subject: "Inquiry: Direct Collaboration",
      promptTemplate:
        "Hi Daniyal, I'd like to connect regarding an engineering collaboration opportunity."
    }
  ]
};

/**
 * Builds the standard official WhatsApp Click-to-Chat URL
 * Format: https://wa.me/COUNTRYCODEPHONENUMBER?text=ENCODED_MESSAGE
 */
export function buildWhatsAppUrl(customMessage?: string, inquiryTopic?: string): string {
  const number = DNYL_COMMUNICATION_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  let messageBody = customMessage?.trim();

  if (!messageBody) {
    messageBody = `Hi Daniyal,\n\nI am contacting you through your DNYL portfolio (${DNYL_COMMUNICATION_CONFIG.websiteUrl}).\n\nI would like to discuss: ${
      inquiryTopic || "a potential project collaboration"
    }.\n\nLooking forward to speaking with you!`;
  }

  const encoded = encodeURIComponent(messageBody);
  return `https://wa.me/${number}?text=${encoded}`;
}
