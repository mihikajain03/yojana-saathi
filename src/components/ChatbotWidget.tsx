import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { sendMessage, INITIAL_BOT_MESSAGE, makeMessage } from '@/lib/chatApi';

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text) return;

    const userMsg = makeMessage('user', text);
    const history = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    sendMessage(text, history)
      .then((reply) => {
        setMessages((prev) => [...prev, makeMessage('bot', reply)]);
        setIsTyping(false);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          makeMessage('bot', 'Sorry, something went wrong. Please try again.'),
        ]);
        setIsTyping(false);
      });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const suggestions = [
    'Kisan yojana batao',
    'Senior citizen pension?',
    'Girl child scheme',
    'Health insurance kaise mile?',
  ];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-glow transition hover:scale-105 active:scale-95"
        aria-label="Open chatbot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex h-[32rem] max-h-[80vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card animate-scale-in"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-500 to-leaf-700 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Yojana Saathi AI</p>
              <p className="flex items-center gap-1 text-[11px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf-300 animate-pulse-soft" /> Online · Hindi & English
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 transition hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed animate-fade-in ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-brand-500 text-white'
                      : 'rounded-bl-md bg-white text-ink-800 shadow-soft'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-ink-100 bg-white px-3 pb-2 pt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="chip border border-ink-200 bg-ink-50 text-ink-600 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-ink-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question..."
              className="flex-1 rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-800 placeholder-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
