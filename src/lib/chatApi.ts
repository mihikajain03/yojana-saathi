import type { ChatMessage } from '@/types';

export const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'initial',
  role: 'bot',
  text:
    'Namaste! Main Yojana Saathi hoon, aapki AI assistant. Main aapko sarkari yojanao ke baare mein jaankari de sakti hoon. Aap mujhse Hindi/Hinglish ya English mein sawaal pooch sakte hain. Jaise: "Mujhe kisan yojana batao" ya "How can I get a pension?"',
};

export function makeMessage(role: 'user' | 'bot', text: string): ChatMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, text };
}

const FRIENDLY = {
  empty: 'Please type a question about a government scheme.',
  tooLong:
    'Aapka message thoda lamba hai (max 500 characters). Please shorten it and try again.',
  network: 'Network error. Please check your connection and try again.',
  server: 'Our AI service is temporarily unavailable. Please try again shortly.',
  rateLimit:
    'Bahut saare requests aa gaye hain. Please wait a moment and try again.',
  generic: 'Sorry, something went wrong. Please try again.',
} as const;

/**
 * Send a user message (with optional chat history) to /api/chat and return
 * the assistant reply. Validation and API errors resolve to friendly strings
 * so the existing chat UI can show them without changes.
 */
export async function sendMessage(
  userText: string,
  history: ChatMessage[] = []
): Promise<string> {
  const trimmed = userText.trim();

  if (!trimmed) {
    return FRIENDLY.empty;
  }

  if (trimmed.length > 500) {
    return FRIENDLY.tooLong;
  }

  const messages =
    history.length > 0
      ? history.map(({ role, text }) => ({ role, text }))
      : [{ role: 'user' as const, text: trimmed }];

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  } catch {
    return FRIENDLY.network;
  }

  if (response.status === 429) {
    return FRIENDLY.rateLimit;
  }

  if (response.status >= 500) {
    return FRIENDLY.server;
  }

  let data: { reply?: string; error?: string } = {};
  try {
    data = await response.json();
  } catch {
    return FRIENDLY.generic;
  }

  if (!response.ok) {
    return data.error?.trim() || FRIENDLY.generic;
  }

  const reply = data.reply?.trim();
  if (!reply) {
    return FRIENDLY.generic;
  }

  return reply;
}
