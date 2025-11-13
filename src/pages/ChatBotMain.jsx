import React, { useState } from "react";
import { getChatResponse } from "../services/openaiChatService";
import "../css/ChatBotMain.css";

export default function ChatBotMain() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 ¡Hola! Soy Astralis Assistant. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Para las sugerencias automáticas
  const [conversationContext, setConversationContext] = useState(""); // Para mantener el contexto de la conversación

  const sendMessage = async (message) => {
    message = message || input;
    if (!message.trim()) return;
    const userMsg = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await getChatResponse(message, messages);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

      // Generar nuevas sugerencias basadas en la respuesta del bot
      generateSuggestions(botReply);

      // Actualizar el contexto de la conversación para personalizar futuras sugerencias
      setConversationContext(botReply.toLowerCase());

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

  // Función para generar sugerencias automáticas personalizadas
  const generateSuggestions = (botResponse) => {
    let newSuggestions = [];

    // Personalizar sugerencias basadas en las palabras clave de la respuesta del bot
    if (botResponse.toLowerCase().includes("saldo")) {
      newSuggestions = [
        "Consultar saldo",
        "Ver movimientos",
        "Ver CVV de la tarjeta",
        "Ver tarjeta",
        "Consultar mi límite de crédito",
      ];
    } else if (botResponse.toLowerCase().includes("cambiar contraseña")) {
      newSuggestions = [
        "Restablecer contraseña",
        "Actualizar seguridad de cuenta",
        "Consultar políticas de seguridad",
        "Cambiar pregunta de seguridad",
      ];
    } else if (botResponse.toLowerCase().includes("transferir")) {
      newSuggestions = [
        "Transferir dinero",
        "Ver transferencias recientes",
        "Ver saldo disponible para transferencias",
      ];
    } else {
      // Otras sugerencias genéricas
      newSuggestions = [
        "Consultar saldo",
        "Ver mis tarjetas",
        "Contactar soporte",
        "Ver historial de transacciones",
      ];
    }

    setSuggestions(newSuggestions);
  };

  // Función para manejar cuando el usuario hace clic en una sugerencia
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
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

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="Input-client">
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(null)}
          />
          <button onClick={sendMessage} disabled={loading}>
            Enviar
          </button>
        </div>
      </main>
    </div>
  );
}
