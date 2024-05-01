import React from "react";
import Infobip from "infobip";

const sendMessage = async () => {
  const infobip = new Infobip({
    apiKey:
      "f137b8f5f60e3c8ba83ff05fd09277e0-5c40c0b2-0ee4-44d4-8435-cf6431a6c963",
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
  return response;
};

export default sendMessage;
