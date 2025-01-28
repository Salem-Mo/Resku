import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore"; 
import {ServerUrl} from '@/utils/constants';


const ChatTest = () => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(""); // The user you want to chat with

  useEffect(() => {
    const newSocket = io(ServerUrl);
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userId: user._id });

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, { sender: "them", text: msg }]);
    });

    return () => newSocket.close();
  }, [user._id]);

  const sendMessage = () => {
    if (message && receiverId) {
      socket.emit("sendMessage", { to: receiverId, message });
      setMessages((prev) => [...prev, { sender: "me", text: message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat with {receiverId}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "me" ? "right" : "left" }}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="User ID to chat with"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatTest;
