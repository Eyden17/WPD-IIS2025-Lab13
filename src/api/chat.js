import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 Inicializa cliente oficial OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint para el chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Formato inválido de mensajes" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content || "No se obtuvo respuesta.";

    return res.json({ reply: content });
  } catch (error) {
    console.error("Error en OpenAI API:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor backend en puerto ${PORT}`));
