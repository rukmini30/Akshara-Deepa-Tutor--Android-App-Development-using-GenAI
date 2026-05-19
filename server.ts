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
    const maxRetries = 2;
    let attempt = 0;

    const runChat = async () => {
      const { message, chatHistory } = req.body;
      const chat = ai.chats.create({
        model: "gemini-flash-latest",
        config: {
          systemInstruction: `You are Akshara-Deepa AI, a brilliant personal tutor for 10th-grade (SSLC) students. 
          Your mission is to make learning exciting, simple, and effective.
          - Use clear, simple language with relatable real-life examples.
          - If asked for a "study plan", create a structured, day-wise schedule for the requested topic.
          - Incorporate encouraging gamified language (e.g., "Level up your math skills!", "You're on a streak!").
          - If the user asks about Science, Math, or Social Studies, provide clear bullet points and visual descriptions.
          - Be encouraging and supportive like a wise older sibling.`,
        },
        history: chatHistory || []
      });

      const result = await chat.sendMessage({ message });
      return result.text;
    };

    while (attempt <= maxRetries) {
      try {
        const responseText = await runChat();
        return res.json({ response: responseText });
      } catch (error: any) {
        attempt++;
        console.error(`AI Tutor Attempt ${attempt} failed:`, error);
        
        // If it's a 503 or 429, we might want to retry after a short delay
        const isRetryable = error?.status === 503 || error?.status === 429 || error?.message?.includes("503") || error?.message?.includes("high demand");
        
        if (isRetryable && attempt <= maxRetries) {
          console.log(`Retrying AI Tutor in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }

        res.status(500).json({ 
          error: "The AI tutor is currently very busy helping other students. Please try again in a few moments.",
          details: error?.message 
        });
        break;
      }
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
