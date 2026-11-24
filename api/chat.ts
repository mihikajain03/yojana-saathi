/**
 * Vercel serverless function: POST /api/chat
 * Proxies chat history to the Gemini API. The API key stays server-side only.
 */

export const config = {
  runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are "Yojana Saathi", a helpful assistant for Indian government schemes (yojana).

Rules:
- Answer ONLY questions about Indian central or state government schemes, eligibility, documents, benefits, and how to apply.
- Reply in simple Hinglish (mix of Hindi in Roman script and English) that everyday people can understand. Keep answers short and clear.
- If the user asks something unrelated to government schemes, politely decline and steer them back to schemes.
- NEVER invent, guess, or fabricate eligibility criteria, income limits, benefit amounts, deadlines, or application links. If you are not sure, say so clearly.
- Always remind the user to verify the latest details on the official government website before applying.
- Do not ask for or store Aadhaar, bank, or other sensitive personal numbers.`;

type IncomingMessage = {
  role: 'user' | 'bot';
  text: string;
};

type GeminiContent = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export type ChatHandlerResult =
  | { ok: true; reply: string }
  | { ok: false; status: number; error: string };

/** Shared chat logic used by the Vercel handler and the Vite dev middleware. */
export async function runChat(
  messages: IncomingMessage[],
  apiKey: string | undefined
): Promise<ChatHandlerResult> {
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      error: 'Server is missing GEMINI_API_KEY configuration.',
    };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      ok: false,
      status: 400,
      error: 'Please type a question about a government scheme.',
    };
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const lastText = lastUser?.text?.trim() ?? '';

  if (!lastText) {
    return {
      ok: false,
      status: 400,
      error: 'Please type a question about a government scheme.',
    };
  }

  if (lastText.length > 500) {
    return {
      ok: false,
      status: 400,
      error:
        'Aapka message thoda lamba hai (max 500 characters). Please shorten it and try again.',
    };
  }

  const contents: GeminiContent[] = messages
    .filter((m) => m.text?.trim())
    .map((m) => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text.trim() }],
    }));

  // Gemini requires the conversation to start with a user turn.
  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  if (contents.length === 0) {
    return {
      ok: false,
      status: 400,
      error: 'Please type a question about a government scheme.',
    };
  }

  const models = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
  ];

  const payload = JSON.stringify({
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    },
  });

  let sawRateLimit = false;
  let lastStatus = 502;
  let lastErrText = '';

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      let geminiRes: Response;
      try {
        geminiRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: payload,
        });
      } catch {
        return {
          ok: false,
          status: 502,
          error: 'Network error while reaching the AI service. Please try again.',
        };
      }

      if (geminiRes.status === 429) {
        sawRateLimit = true;
        break;
      }

      if (!geminiRes.ok) {
        lastStatus = geminiRes.status;
        lastErrText = await geminiRes.text().catch(() => '');
        console.error(
          `[api/chat] Gemini ${model} HTTP ${geminiRes.status}:`,
          lastErrText.slice(0, 500)
        );
        // Retry once on temporary overload, otherwise try next model.
        if (geminiRes.status === 503 && attempt === 0) {
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        if (geminiRes.status === 404 || geminiRes.status === 503) {
          break;
        }
        return {
          ok: false,
          status: 502,
          error:
            'Our AI service is temporarily unavailable. Please try again shortly.',
        };
      }

      const data = (await geminiRes.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };

      const reply = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? '')
        .join('')
        .trim();

      if (reply) {
        return { ok: true, reply };
      }

      break;
    }
  }

  if (sawRateLimit) {
    return {
      ok: false,
      status: 429,
      error:
        'Bahut saare requests aa gaye hain. Please wait a moment and try again.',
    };
  }

  console.error(
    `[api/chat] All models failed. Last HTTP ${lastStatus}:`,
    lastErrText.slice(0, 500)
  );

  return {
    ok: false,
    status: 502,
    error:
      'Our AI service is temporarily unavailable. Please try again shortly.',
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = await runChat(body.messages ?? [], process.env.GEMINI_API_KEY);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({ reply: result.reply });
}
