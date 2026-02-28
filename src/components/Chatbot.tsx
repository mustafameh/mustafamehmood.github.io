"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  statusSteps?: string[];
}

interface StreamEvent {
  type: "status" | "text" | "done" | "error";
  text?: string;
  content?: string;
}

const GREETING =
  "Hi! I'm Mustafa's AI assistant. Ask me about his experience, projects, and skills — or I can email a message to him for you.";

function AiStarsIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" fill="currentColor" />
      <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z" fill="currentColor" opacity="0.6" />
      <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeStatuses, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-chatbot]")) return;
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setActiveStatuses([]);

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed." }));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.error || "Something went wrong." },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream.");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      const collectedStatuses: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: StreamEvent;
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          if (event.type === "status" && event.text) {
            collectedStatuses.push(event.text);
            setActiveStatuses([...collectedStatuses]);
          } else if (event.type === "text" && event.content) {
            assistantText += event.content;
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  ...last,
                  content: assistantText,
                  statusSteps: [...collectedStatuses],
                };
              } else {
                copy.push({
                  role: "assistant",
                  content: assistantText,
                  statusSteps: [...collectedStatuses],
                });
              }
              return copy;
            });
          } else if (event.type === "error" && event.content) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: `Error: ${event.content}` },
            ]);
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setActiveStatuses([]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating action button */}
      <motion.button
        data-chatbot
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 text-white flex items-center justify-center transition-all bg-transparent"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M12 6l.8 2.4L15.2 9.2l-2.4.8L12 12.4l-.8-2.4L8.8 9.2l2.4-.8z" fill="currentColor" stroke="none" />
              <path d="M16 11.5l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4z" fill="currentColor" stroke="none" opacity="0.6" />
              <path d="M8 11.5l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3z" fill="currentColor" stroke="none" opacity="0.4" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            data-chatbot
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: "#06060f",
              border: "1px solid rgba(0,79,144,0.15)",
              boxShadow: "0 0 35px rgba(0,79,144,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,79,144,0.1)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  border: "1px solid rgba(0,79,144,0.2)",
                  background: "rgba(0,79,144,0.06)",
                }}
              >
                <AiStarsIcon size={16} className="text-primary-light" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">mustafa.ai</p>
                <p className="text-[10px] text-primary-light/50">Portfolio assistant</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors p-1"
                aria-label="Close chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
              {/* Greeting */}
              <div className="flex gap-2.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ border: "1px solid rgba(0,79,144,0.2)", background: "rgba(0,79,144,0.06)" }}
                >
                  <AiStarsIcon size={11} className="text-primary-light/70" />
                </div>
                <div
                  className="rounded-xl rounded-tl-sm px-3 py-2 max-w-[82%]"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-sm text-white/70">{GREETING}</p>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div
                          className="rounded-xl rounded-tr-sm px-3 py-2 max-w-[82%]"
                          style={{
                            border: "1px solid rgba(0,79,144,0.25)",
                            background: "rgba(0,79,144,0.08)",
                          }}
                        >
                          <p className="text-sm text-white/90">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{ border: "1px solid rgba(0,79,144,0.2)", background: "rgba(0,79,144,0.06)" }}
                        >
                          <AiStarsIcon size={11} className="text-primary-light/70" />
                        </div>
                        <div className="max-w-[82%] space-y-1.5">
                          {msg.statusSteps && msg.statusSteps.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {msg.statusSteps.map((s, j) => (
                                <span
                                  key={j}
                                  className="inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5"
                                  style={{
                                    color: "rgba(26,127,196,0.5)",
                                    background: "rgba(0,79,144,0.1)",
                                    border: "1px solid rgba(0,79,144,0.15)",
                                  }}
                                >
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                  </svg>
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          <div
                            className="rounded-xl rounded-tl-sm px-3 py-2 max-w-none text-sm text-white/70 [&_p]:my-1 [&_ul]:my-1 [&_ul]:pl-4 [&_ul]:list-disc [&_li]:my-0.5 [&_strong]:text-white/85 [&_a]:text-primary-light [&_a]:underline"
                            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                          >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading / thinking indicator */}
                {isLoading && (
                  <motion.div
                    key="loading-indicator"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex gap-2.5"
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ border: "1px solid rgba(0,79,144,0.2)", background: "rgba(0,79,144,0.06)" }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <AiStarsIcon size={11} className="text-primary-light/70" />
                      </motion.div>
                    </div>
                    <div className="space-y-1.5">
                      <AnimatePresence>
                        {activeStatuses.map((s, j) => (
                          <motion.div
                            key={`status-${j}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-wrap gap-1"
                          >
                            <span
                              className="inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5"
                              style={{
                                color: "rgba(26,127,196,0.5)",
                                background: "rgba(0,79,144,0.1)",
                                border: "1px solid rgba(0,79,144,0.15)",
                              }}
                            >
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                              </svg>
                              {s}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div
                        className="rounded-xl rounded-tl-sm px-3 py-2.5"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                      >
                        <div className="flex items-center gap-1.5">
                          <motion.span
                            className="w-2 h-2 rounded-full"
                            style={{ background: "rgba(0,79,144,0.5)" }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                          />
                          <motion.span
                            className="w-2 h-2 rounded-full"
                            style={{ background: "rgba(0,79,144,0.5)" }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.span
                            className="w-2 h-2 rounded-full"
                            style={{ background: "rgba(0,79,144,0.5)" }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                          />
                          {activeStatuses.length === 0 && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                              transition={{ delay: 0.5 }}
                              className="text-[11px] ml-1"
                              style={{ color: "rgba(26,127,196,0.35)" }}
                            >
                              Thinking...
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid rgba(0,79,144,0.1)" }}>
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Mustafa..."
                  maxLength={500}
                  disabled={isLoading}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-primary-light/40 focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(0,79,144,0.03)",
                    border: "1px solid rgba(0,79,144,0.22)",
                    boxShadow: "0 0 15px rgba(0,79,144,0.06)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,79,144,0.3)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(0,79,144,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,79,144,0.15)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(0,79,144,0.06)";
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  style={{
                    border: "1px solid rgba(0,79,144,0.35)",
                    background: "rgba(0,79,144,0.1)",
                    boxShadow: "0 0 12px rgba(0,79,144,0.15)",
                  }}
                  aria-label="Send message"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a7fc4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="1">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
