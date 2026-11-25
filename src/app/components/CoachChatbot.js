"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, RotateCcw, MessageCircle, ArrowRight } from "lucide-react";
import {
  SEED_FAQS,
  findBestFaqMatch,
  deduplicateAndUpsertFaq,
  mergeFaqLists,
} from "../../lib/chatbotMemory";

const STORAGE_KEY = "wfz_chatbot_qa_memory_v2";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to World Fitness Zone! I'm Coach James's AI Assistant.\n\nWhether you want details on our flagship 13-Week Transformation, Coach James's 20-year fitness journey, tailored Western & Desi meal plans, or how to start your 14-day free pass — ask me anything.",
};

const QUICK_CHIPS = [
  "13-Week Transformation details",
  "Coach's 20-Year Journey",
  "Meal Plans & Diet Tiers",
  "How to join / Contact Coach",
];

function stripMarkdownFormatting(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .trim();
}

function sanitizeFaqList(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) =>
    item && typeof item.answer === "string"
      ? { ...item, answer: stripMarkdownFormatting(item.answer) }
      : item
  );
}

function formatMessageLines(text) {
  const cleaned = stripMarkdownFormatting(text);
  return cleaned.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={i} style={{ height: "0.45rem" }} />;
    }
    if (trimmed.startsWith("- ")) {
      return (
        <div key={i} className="wfz-cb-bullet">
          <span className="wfz-cb-bullet-dot" aria-hidden="true" />
          <span>{trimmed.slice(2).trim()}</span>
        </div>
      );
    }
    return (
      <p key={i} className="wfz-cb-line">
        {line}
      </p>
    );
  });
}

export default function CoachChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [faqMemory, setFaqMemory] = useState(() => sanitizeFaqList(SEED_FAQS));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const persistClientMemory = (list) => {
    const cleanList = sanitizeFaqList(list);
    setFaqMemory(cleanList);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
    } catch {
      // Ignore storage quota / private mode issues cleanly
    }
  };

  useEffect(() => {
    let baseList = sanitizeFaqList(SEED_FAQS);
    try {
      const savedRaw = window.localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseList = sanitizeFaqList(mergeFaqLists(SEED_FAQS, sanitizeFaqList(parsed)));
        }
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseList));
    } catch {
      // Ignore localStorage parse errors
    }
    setFaqMemory(baseList);

    let cancelled = false;
    fetch("/api/chat")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.faqs)) return;
        setFaqMemory((prev) => {
          const synced = sanitizeFaqList(
            mergeFaqLists(prev, sanitizeFaqList(data.faqs))
          );
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
          } catch {
            // Ignore storage errors
          }
          return synced;
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (textOverride) => {
    const prompt = (typeof textOverride === "string" ? textOverride : input).trim();
    if (!prompt || isLoading) return;

    setErrorMsg("");
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: prompt,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (typeof textOverride !== "string") {
      setInput("");
    }

    // 1. Check client-side local FAQ memory first — instant answer, zero API calls
    const localMatch = findBestFaqMatch(prompt, faqMemory);
    if (localMatch) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: stripMarkdownFormatting(localMatch.item.answer),
        },
      ]);
      return;
    }

    // 2. Fall back to backend (/api/chat checks server JSON DB first, then Groq AI)
    setIsLoading(true);

    try {
      const payloadMessages = nextMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (!res.ok || !data?.reply) {
        throw new Error(data?.error || "Unable to reach Coach AI right now.");
      }

      const cleanReply = stripMarkdownFormatting(data.reply);

      // 3. Save/deduplicate newly learned Q&A into client local memory
      const meta = data.savedEntry
        ? {
            id: data.savedEntry.id,
            category: data.savedEntry.category,
            aliases: data.savedEntry.aliases,
            keywords: data.savedEntry.keywords,
            source: data.savedEntry.source,
            updatedAt: data.savedEntry.updatedAt,
          }
        : { source: "groq_learned" };

      const upsertRes = deduplicateAndUpsertFaq(
        faqMemory,
        prompt,
        cleanReply,
        meta
      );
      if (upsertRes.action !== "skipped") {
        persistClientMemory(upsertRes.list);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: cleanReply,
        },
      ]);
    } catch (err) {
      setErrorMsg(
        err?.message ||
          "Connection hiccup. You can also WhatsApp Coach James on +44 7776899913."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMsg("");
    setInput("");
  };

  const showQuickChips = messages.length <= 1 && !isLoading;

  return (
    <>
      <style>{`
        .wfz-cb-root {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 9990;
          font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
        }

        .wfz-cb-launcher {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #071A2B 0%, #0F2D4A 100%);
          color: #FFFFFF;
          border: 2px solid rgba(255, 201, 40, 0.78);
          border-radius: 999px;
          padding: 6px 16px 6px 6px;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(7, 26, 43, 0.38), 0 0 0 4px rgba(21, 94, 239, 0.14);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .wfz-cb-launcher:hover {
          transform: translateY(-2px);
          border-color: #FFC928;
          box-shadow: 0 16px 38px rgba(7, 26, 43, 0.45), 0 0 0 5px rgba(255, 201, 40, 0.2);
        }

        .wfz-cb-launcher-avatar {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #071A2B;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          flex-shrink: 0;
        }

        .wfz-cb-launcher-avatar img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .wfz-cb-online-dot {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #22C55E;
          border: 2px solid #071A2B;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
        }

        .wfz-cb-launcher-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
          text-align: left;
        }

        .wfz-cb-launcher-title {
          font-family: var(--font-outfit), system-ui, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 0.01em;
        }

        .wfz-cb-launcher-sub {
          font-size: 0.72rem;
          font-weight: 600;
          color: #FFC928;
        }

        .wfz-cb-window {
          width: min(395px, calc(100vw - 24px));
          height: min(585px, calc(100dvh - 36px));
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 60px rgba(7, 26, 43, 0.34), 0 0 0 1px rgba(7, 26, 43, 0.08);
        }

        .wfz-cb-header {
          background: linear-gradient(135deg, #071A2B 0%, #0D2944 100%);
          color: #FFFFFF;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid rgba(255, 201, 40, 0.45);
          flex-shrink: 0;
        }

        .wfz-cb-header-left {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .wfz-cb-header-logo {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 201, 40, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
          flex-shrink: 0;
        }

        .wfz-cb-header-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .wfz-cb-header-title {
          font-family: var(--font-outfit), system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .wfz-cb-header-sub {
          font-size: 0.74rem;
          color: rgba(255, 255, 255, 0.78);
          margin: 2px 0 0 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .wfz-cb-status-pill {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          display: inline-block;
        }

        .wfz-cb-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .wfz-cb-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease;
        }

        .wfz-cb-icon-btn:hover {
          background: rgba(255, 201, 40, 0.22);
          border-color: #FFC928;
          color: #FFC928;
        }

        .wfz-cb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          background: #F7F9FC;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .wfz-cb-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 100%;
        }

        .wfz-cb-msg-row.user {
          justify-content: flex-end;
        }

        .wfz-cb-msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid rgba(7, 26, 43, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          flex-shrink: 0;
        }

        .wfz-cb-msg-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .wfz-cb-bubble {
          max-width: 82%;
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 0.875rem;
          line-height: 1.48;
          word-break: break-word;
        }

        .wfz-cb-bubble.assistant {
          background: #FFFFFF;
          color: #172033;
          border: 1px solid rgba(7, 26, 43, 0.08);
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(7, 26, 43, 0.04);
        }

        .wfz-cb-bubble.user {
          background: #155EEF;
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(21, 94, 239, 0.24);
        }

        .wfz-cb-line {
          margin: 0;
        }

        .wfz-cb-line + .wfz-cb-line {
          margin-top: 4px;
        }

        .wfz-cb-bullet {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 3px;
        }

        .wfz-cb-bullet-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #155EEF;
          margin-top: 7px;
          flex-shrink: 0;
        }

        .wfz-cb-bubble.user .wfz-cb-bullet-dot {
          background: #FFC928;
        }

        .wfz-cb-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 4px;
        }

        .wfz-cb-chip {
          background: #EAF2FF;
          color: #071A2B;
          border: 1px solid rgba(21, 94, 239, 0.24);
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 0.77rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.16s ease;
          text-align: left;
        }

        .wfz-cb-chip:hover {
          background: #155EEF;
          color: #FFFFFF;
          border-color: #155EEF;
        }

        .wfz-cb-typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 12px 15px;
        }

        .wfz-cb-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #155EEF;
          animation: wfz-bounce 1.2s infinite ease-in-out;
        }

        .wfz-cb-typing span:nth-child(2) {
          animation-delay: 0.16s;
        }

        .wfz-cb-typing span:nth-child(3) {
          animation-delay: 0.32s;
        }

        @keyframes wfz-bounce {
          0%, 80%, 100% {
            transform: scale(0.65);
            opacity: 0.45;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .wfz-cb-error {
          background: #FEF2F2;
          color: #B91C1C;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 8px 11px;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .wfz-cb-cta-bar {
          background: #EAF2FF;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border-top: 1px solid rgba(21, 94, 239, 0.14);
          flex-shrink: 0;
        }

        .wfz-cb-cta-wa {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #071A2B;
          text-decoration: none;
          transition: color 0.16s ease;
        }

        .wfz-cb-cta-wa:hover {
          color: #155EEF;
        }

        .wfz-cb-cta-join {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          font-weight: 700;
          background: #FFC928;
          color: #071A2B;
          padding: 4px 10px;
          border-radius: 999px;
          text-decoration: none;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .wfz-cb-cta-join:hover {
          background: #f3bc18;
          transform: translateY(-1px);
        }

        .wfz-cb-input-bar {
          padding: 10px 12px;
          background: #FFFFFF;
          border-top: 1px solid rgba(7, 26, 43, 0.08);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .wfz-cb-input {
          flex: 1;
          border: 1px solid rgba(7, 26, 43, 0.16);
          border-radius: 12px;
          padding: 9px 12px;
          font-size: 0.875rem;
          color: #172033;
          background: #F7F9FC;
          outline: none;
          transition: border-color 0.18s ease, background 0.18s ease;
        }

        .wfz-cb-input:focus {
          border-color: #155EEF;
          background: #FFFFFF;
        }

        .wfz-cb-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          border: none;
          background: #155EEF;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.18s ease, transform 0.15s ease;
        }

        .wfz-cb-send-btn:hover:not(:disabled) {
          background: #0F47C7;
          transform: scale(1.03);
        }

        .wfz-cb-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 767px) {
          .wfz-cb-root {
            right: 5%;
            bottom: 16px;
            z-index: 9990;
          }
          .wfz-cb-launcher-text {
            display: none;
          }
          .wfz-cb-launcher {
            width: 56px;
            height: 56px;
            padding: 0;
            border-radius: 50%;
            justify-content: center;
            gap: 0;
          }
          .wfz-cb-launcher-avatar {
            width: 46px;
            height: 46px;
          }
          .wfz-cb-window {
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: auto;
            max-width: calc(100vw - 24px);
            height: min(510px, calc(100dvh - 86px));
            margin: 0 auto;
            border-radius: 18px;
          }
          .wfz-cb-input {
            font-size: 16px;
          }
          .wfz-cb-cta-bar {
            padding: 6px 10px;
            flex-wrap: wrap;
          }
          .wfz-cb-cta-wa {
            font-size: 0.72rem;
          }
          .wfz-cb-cta-join {
            font-size: 0.72rem;
            padding: 4px 9px;
          }
        }
      `}</style>

      <div className="wfz-cb-root">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="launcher"
              type="button"
              className="wfz-cb-launcher"
              onClick={() => setIsOpen(true)}
              aria-label="Open Coach James AI Chat"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={{ duration: 0.2 }}
            >
              <div className="wfz-cb-launcher-avatar">
                <img src="/logo-dark-bg.png" alt="World Fitness Zone Coach AI" />
                <span className="wfz-cb-online-dot" aria-hidden="true" />
              </div>
              <div className="wfz-cb-launcher-text">
                <span className="wfz-cb-launcher-title">Ask Coach AI</span>
                <span className="wfz-cb-launcher-sub">13-Week Coaching Info</span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="window"
              className="wfz-cb-window"
              role="dialog"
              aria-label="Coach James AI Assistant"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="wfz-cb-header">
                <div className="wfz-cb-header-left">
                  <div className="wfz-cb-header-logo">
                    <img src="/logo-dark-bg.png" alt="World Fitness Zone" />
                  </div>
                  <div>
                    <h3 className="wfz-cb-header-title">
                      Coach James AI <Sparkles size={14} color="#FFC928" />
                    </h3>
                    <p className="wfz-cb-header-sub">
                      <span className="wfz-cb-status-pill" aria-hidden="true" />
                      World Fitness Zone &bull; Online
                    </p>
                  </div>
                </div>
                <div className="wfz-cb-header-actions">
                  <button
                    type="button"
                    className="wfz-cb-icon-btn"
                    onClick={handleReset}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    type="button"
                    className="wfz-cb-icon-btn"
                    onClick={() => setIsOpen(false)}
                    title="Close chat"
                    aria-label="Close chat"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="wfz-cb-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`wfz-cb-msg-row ${msg.role}`}>
                    {msg.role === "assistant" && (
                      <div className="wfz-cb-msg-avatar">
                        <img src="/logo.png" alt="Coach" />
                      </div>
                    )}
                    <div className={`wfz-cb-bubble ${msg.role}`}>
                      {formatMessageLines(msg.content)}
                    </div>
                  </div>
                ))}

                {showQuickChips && (
                  <div className="wfz-cb-chips">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="wfz-cb-chip"
                        onClick={() => sendMessage(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="wfz-cb-msg-row assistant">
                    <div className="wfz-cb-msg-avatar">
                      <img src="/logo.png" alt="Coach" />
                    </div>
                    <div
                      className="wfz-cb-bubble assistant wfz-cb-typing"
                      aria-label="Coach is typing"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                {errorMsg && <div className="wfz-cb-error">{errorMsg}</div>}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom CTA Bar */}
              <div className="wfz-cb-cta-bar">
                <a
                  href="https://wa.me/447776899913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wfz-cb-cta-wa"
                >
                  <MessageCircle size={14} color="#155EEF" />
                  WhatsApp Coach: +44 7776899913
                </a>
                <Link
                  href="/#contact"
                  className="wfz-cb-cta-join"
                  onClick={() => setIsOpen(false)}
                >
                  Join Program <ArrowRight size={12} />
                </Link>
              </div>

              {/* Input Form */}
              <form className="wfz-cb-input-bar" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  className="wfz-cb-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about coaching, diet, 13-week plan..."
                  disabled={isLoading}
                  maxLength={1000}
                />
                <button
                  type="submit"
                  className="wfz-cb-send-btn"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
