import { useEffect } from "react";

export default function WhatsAppWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?14465";
    script.async = true;

    script.onload = () => {
      const options = {
        enabled: true,
        chatButtonSetting: {
          backgroundColor: "#00e785",
          ctaText: "Chat with us",
          borderRadius: "25",
          marginLeft: "0",
          marginRight: "20",
          marginBottom: "20",
          ctaIconWATI: false,
          position: "right",
        },
        brandSetting: {
          brandName: "Marahep",
          brandSubTitle: "undefined",
          brandImg: "",
          welcomeText: "Hi there!\nHow can I help you?",
          messageText: "Hello, %0A I have a question about Marahep",
          backgroundColor: "#00e785",
          ctaText: "Chat with us",
          borderRadius: "25",
          autoShow: false,
          phoneNumber: "96597666370",
        },
      };
      // @ts-expect-error (ignore TypeScript warning about global function)
      window.CreateWhatsappChatWidget(options);
    };

    document.body.appendChild(script);
  }, []);

  return null; // nothing to render, it only injects the widget
}
