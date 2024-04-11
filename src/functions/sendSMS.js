import React from "react";
import Infobip from "infobip";

const SendMessage = () => {
  const sendMessage = async () => {
    const infobip = new Infobip({
      apiKey:
        "bd28cde236f7a8ea1543c42218327537-0afefbf7-5b96-4a75-ac4f-b19d6fede555",
      username: "sditch2001",
      password: "Sharmaine2001",
    });

    try {
      const response = await infobip.sendMessage({
        from: "SENDER_ID",
        to: "RECIPIENT_PHONE_NUMBER",
        text: "Your message content here",
      });
      console.log("Message sent successfully:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default SendMessage;
