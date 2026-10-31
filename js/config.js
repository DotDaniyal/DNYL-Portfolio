/**
 * DNYL Communication & Messaging Configuration
 * Official recipient details, WhatsApp endpoints, and inquiry templates
 */
(function (global) {
  'use strict';

  var config = {
    recipientName: "Daniyal Hayat",
    recipientEmail: "mdaniyalhayyat@gmail.com",
    recipientPhone: "+923331001904",
    recipientPhoneDisplay: "+92 333 1001904",
    whatsappNumber: "923331001904",
    whatsappDisplay: "+92 333 1001904",
    websiteUrl: "https://dnyl.vercel.app/",
    websiteName: "DNYL // Daniyal Hayat",
    apiEndpoint: "/api/contact",
    presetInquiries: [
      {
        id: "web-dev",
        label: "Web Platform Development",
        subject: "Web Development Inquiry",
        message: "Hi Daniyal, I saw your DNYL portfolio (dnyl.vercel.app) and would like to discuss building a web platform."
      },
      {
        id: "android-dev",
        label: "Android Application",
        subject: "Android App Inquiry",
        message: "Hi Daniyal, I'm reaching out from your portfolio regarding a native Kotlin Android application."
      },
      {
        id: "gemini-ai",
        label: "Gemini AI Integration",
        subject: "Gemini AI Project",
        message: "Hi Daniyal, I'd like to collaborate on a Google Gemini AI integration project."
      },
      {
        id: "consulting",
        label: "Consulting & Code Audit",
        subject: "Technical Architecture Consultation",
        message: "Hi Daniyal, I would like to schedule a technical architecture consultation / code review."
      }
    ],

    /**
     * Build an official WhatsApp click-to-chat URL:
     * https://wa.me/COUNTRYCODEPHONENUMBER?text=ENCODED_MESSAGE
     */
    buildWhatsAppUrl: function (customText, subjectTopic) {
      var cleanNum = (this.whatsappNumber || "923331001904").replace(/[^0-9]/g, "");
      var text = (customText || "").trim();

      if (!text) {
        text = "Hi Daniyal,\n\nI am contacting you through your DNYL portfolio (https://dnyl.vercel.app/).\n\nTopic: " +
          (subjectTopic || "Project Collaboration") +
          "\n\nI would like to discuss working together.";
      }

      var encoded = encodeURIComponent(text);
      return "https://wa.me/" + cleanNum + "?text=" + encoded;
    }
  };

  global.DNYL_COMMUNICATION_CONFIG = config;
})(typeof window !== 'undefined' ? window : this);
