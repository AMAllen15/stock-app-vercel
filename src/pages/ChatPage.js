import React from "react";
import Chat from "../components/Chat"; // Correct path to your Chat component

const ChatPage = () => {
  return (
    <div className="chat-page">
      <h1 className="chat-title">Stock Market Chat Room</h1>
      <p className="chat-description">
        Discuss your favorite stocks and market trends here!
      </p>
      <Chat />
    </div>
  );
};

export default ChatPage;
