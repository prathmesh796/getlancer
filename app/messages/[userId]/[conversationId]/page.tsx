"use client";

import { useEffect, useMemo, useRef, useState, use } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useMessages } from "@/hooks/useMessages";
import { sendMessage } from "@/services/chat";

export default function Page({ params }: { params: Promise<{ userId: string; conversationId: string }> }) {
  const { userId, conversationId } = use(params);
  const messages = useMessages(conversationId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const otherParticipantId = useMemo(() => {
    if (!conversationId) return null;
    const parts = conversationId.split("__");
    return parts.find((p) => p !== userId) || null;
  }, [conversationId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const onSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);
    try {
      await sendMessage({ conversationId, senderId: userId, text: trimmed });
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar userId={userId} />

      <main className="flex-1 flex flex-col">
        <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                <Link href={`/messages/${userId}`} className="hover:underline">
                  Messages
                </Link>{" "}
                / {otherParticipantId || conversationId}
              </div>
              <h1 className="text-2xl font-semibold text-deep_blue dark:text-slate-50">
                {otherParticipantId ? `Chat with ${otherParticipantId}` : "Conversation"}
              </h1>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {messages.length === 0 ? (
              <div className="text-gray-600 dark:text-slate-300 text-center py-14">
                <div className="mx-auto max-w-md rounded-3xl border border-gray-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 backdrop-blur p-8 shadow-sm">
                  <div className="text-lg font-semibold text-deep_blue dark:text-slate-50 mb-2">
                    No messages yet
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    Send a message below to start the conversation.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => {
                  const mine = m.senderId === userId;
                  const createdAt =
                    typeof m?.createdAt?.toDate === "function" ? m.createdAt.toDate() : null;

                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={[
                          "max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 py-3 shadow-sm border",
                          mine
                            ? "bg-gradient-to-r from-yellow to-light_yellow text-deep_blue border-yellow/30"
                            : "bg-white/90 dark:bg-slate-800/80 text-gray-900 dark:text-slate-50 border-gray-100 dark:border-slate-700",
                        ].join(" ")}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {m.text}
                        </div>
                        <div
                          className={[
                            "mt-2 text-[11px]",
                            mine ? "text-deep_blue/70" : "text-gray-500 dark:text-slate-400",
                          ].join(" ")}
                        >
                          {createdAt ? createdAt.toLocaleString() : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </section>

        <footer className="border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky bottom-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-3 items-end">
              <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 resize-none rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow/40 text-gray-900 dark:text-slate-50"
            />
              <button
                onClick={onSend}
                disabled={sending || !text.trim()}
                className={[
                  "rounded-2xl px-5 py-3 font-semibold transition",
                  sending || !text.trim()
                    ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                    : "bg-yellow hover:bg-light_yellow text-deep_blue shadow-sm",
                ].join(" ")}
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

