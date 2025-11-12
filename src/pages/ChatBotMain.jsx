import React, { useState } from "react";
import { getChatResponse } from "../services/openaiChatService";
import "../css/ChatBotMain.css";

export default function ChatBotMain() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 ¡Hola! Soy Astralis Assistant. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await getChatResponse(input, messages);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error al conectar con el asistente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App-container">
      <header className="App-header">
        <h1>💬 Banco Astralis Assistant</h1>
      </header>

      <main className="Chatbot-container">
        <div className="Chat">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender}`}>
              <p className={`Chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
                {msg.text}
              </p>
            </div>
          ))}
          {loading && <p className="loading">Pensando...</p>}
        </div>

        <div className="Input-client">
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}
