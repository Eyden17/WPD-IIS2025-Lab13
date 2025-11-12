import { processKB } from "../data/processKB.js";

/**
 * Envía el mensaje del usuario al backend Express (que usa openai).
 */
export async function getChatResponse(message, history = []) {
  const systemPrompt = `
Eres ${processKB.assistant_identity.role}.
Tu misión: ${processKB.assistant_identity.mission}.
Responde en español con tono ${processKB.assistant_identity.tone}.
Usa la base de conocimiento del Banco Astralis:

${JSON.stringify(processKB.intents, null, 2)}

Políticas de seguridad:
${processKB.security_principles.rules.join("\n")}
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: message },
  ];

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();
    return data.reply || "No se obtuvo respuesta del asistente.";
  } catch (err) {
    console.error("Error al comunicarse con el backend:", err);
    return "Error al comunicarse con el asistente.";
  }
}
