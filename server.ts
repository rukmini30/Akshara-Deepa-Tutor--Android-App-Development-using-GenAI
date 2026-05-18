import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Tutor Endpoint
  app.post("/api/tutor/ask", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are an AI tutor helping 10th grade (SSLC) students. Your name is Akshara-Deepa AI. Explain concepts clearly with simple examples. If the user asks about Science, Math, or Social Studies, provide deep insights. Keep responses student-friendly and encouraging.",
        },
        history: chatHistory || []
      });

      const result = await chat.sendMessage({ message });
      res.json({ response: result.text });
    } catch (error: any) {
      console.error("AI Tutor Error:", error);
      res.status(500).json({ error: "Failed to get response from AI tutor. Please check your internet connection." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
