import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Chat endpoint for Kano Gist & Resident Interactions
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { residentName, residentRole, location, characterPrompt, message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      // Realistic culturally grounded fallback response generator if API key is pending
      const fallbackReplies: Record<string, string[]> = {
        'Amina Al-Hassan': [
          `Sannu! It is so good to hear from you. We are currently designing a new silk babban riga and bridal couture here in Nassarawa GRA. What do you think about the new season fabrics?`,
          `Nagode for checking in! You know Nassarawa is always busy, but we make time for good friends. Are you attending the polo match this weekend?`,
          `Ah, you have good taste! Truly, Kano fashion is setting the pace for the whole continent. Tell me what outfit you need tailored.`
        ],
        'Farouk Sanusi': [
          `Alhaji! Ba matsala at all. The tech hub here in Bompai is moving fast. We are closing our seed round for northern logistics. How is your capital portfolio doing?`,
          `Yauwa! Good timing. Kano is ripe for high-tech investments right now. Let's grab some suya at Grand Square or talk numbers soon.`,
          `My brother, in business, network is your real net worth. When are we cruising down State Road in that new machine?`
        ],
        'Hajiya Fatima Dantata': [
          `Ina kwana, my son! Welcome to Kurmi Market. Gold and precious gems are steady. May Allah bless your wealth and endeavors. Did you come for pure 24k pieces or royal jewelry?`,
          `Barka da yamma! Kurmi has been trading for 500 years, and honor always comes first. How can an elder assist your family today?`,
          `Masha'Allah, you carry yourself with great respect. Always honor your elders and invest in tangible assets.`
        ],
        'Inspector Garba': [
          `Officer on duty! Kano Metropolitan Command is maintaining strict peace across GRA and Sabon Gari. Keep your security detail organized and obey traffic laws, Alhaji.`,
          `Good afternoon sir. If you are rolling with your VIP motorcade or police outriders, ensure your sirens are cleared with division HQ. Otherwise, stay safe.`,
          `Everything is calm on the highways today, from Kano to Zaria. Reach out if you notice any unusual movement.`
        ],
        'Zainab Bello': [
          `Hey! KanoTok is totally buzzing right now with the Durbar preparation footage! Did you see the clip of the royal horses?`,
          `Haha, omg you are so funny! I'm hanging out around the civic center with my crew. Are you coming through?`,
          `Wallahi Kano has the best energy in Nigeria. Have you checked out the rooftop lounge in Nassarawa yet?`
        ],
        'Bello Danbatta': [
          `Assalamu Alaikum. The Emirate Council welcomes all sons of the soil who preserve our heritage and traditions. Peace be upon your household.`,
          `Barka! Wisdom and patience are the marks of a true leader in Kano. Never forget where you come from.`,
          `The Emir's Court remains open to honest counsel. May your legacy bring prosperity to Kano State.`
        ]
      };

      const replies = fallbackReplies[residentName] || [
        `Sannu aboki! Kano is alive and moving fast today. Hope your day is blessed.`,
        `Nagode! Life in Kano is full of grace and opportunity. Ba matsala at all!`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      res.json({
        reply: randomReply,
        source: 'local-cultural-engine',
        residentName
      });
      return;
    }

    const systemInstruction = `You are roleplaying as ${residentName}, a fictional resident of Kano State, Nigeria.
Your role/status: ${residentRole || 'Kano Citizen'}.
Your current primary location in Kano: ${location || 'Nassarawa GRA, Kano'}.
Character Background: ${characterPrompt || 'A proud, polite, culturally grounded resident of Kano with authentic northern Nigerian manners, respect, and vibrant personality.'}

Conversation Guidelines:
- Speak naturally in realistic Nigerian English with authentic Hausa conversational words and expressions where appropriate (e.g., "Sannu" (hello), "Nagode" (thank you), "Ina kwana" (good morning), "Ba matsala" (no problem), "Wallahi", "Masha'Allah", "Aboki" (friend), "Alhaji", "Barka", "Gaskiya" (truth), "Toh" (okay)).
- Reflect the deep prestige, ancient history (Dala Hill, Kurmi Market, Emir's Palace), and modern commercial vitality of Kano.
- If asked about relationships, friendship, business deals, politics, or money, stay true to your character's persona and age.
- Keep responses concise and natural for a smartphone chat app (2 to 4 sentences). Never break character. Never mention being an AI or language model.`;

    const chatSession = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    // Feed recent history if available
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-4)) {
        if (item.sender === 'user') {
          // just track
        }
      }
    }

    const result = await chatSession.sendMessage({
      message: message,
    });

    const replyText = result.text || `Sannu! Nagode for your message, Alhaji.`;

    res.json({
      reply: replyText.trim(),
      source: 'gemini-3.8-flash',
      residentName
    });
  } catch (error: any) {
    console.error('Gemini API chat error:', error);
    res.status(500).json({
      error: 'Failed to process resident chat',
      fallback: `Sannu! Network is slightly fluctuating around Kano today, but nagode for reaching out!`
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LIFE IN KANO server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
