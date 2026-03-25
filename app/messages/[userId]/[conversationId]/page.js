"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useMessages } from "@/hooks/useMessages";
import { sendMessage } from "@/services/chat";

export default function Page({ params }) {
  const userId = params?.userId;
  const conversationId = params?.conversationId;
  const messages = useMessages(conversationId);
  const [text, setText] = useState("");

  const otherParticipantId = useMemo(() => {
    if (!conversationId) return null;
    const parts = conversationId.split("__");
    return parts.find((p) => p !== userId) || null;
  }, [conversationId, userId]);

  const onSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await sendMessage({ conversationId, senderId: userId, text: trimmed });
    setText("");
  };

  return (
    <div className="flex h-screen">
      <Sidebar userId={userId} />

      <main className="flex-1 flex flex-col">
        <header className="shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">
                <Link href={`/messages/${userId}`} className="hover:underline">
                  Messages
                </Link>{" "}
                / {otherParticipantId || conversationId}
              </div>
              <h1 className="text-2xl font-semibold">Conversation</h1>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
            {messages.length === 0 ? (
              <div className="text-gray-600">No messages yet. Say hello.</div>
            ) : (
              messages.map((m) => {
                const mine = m.senderId === userId;
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        mine ? "bg-yellow text-gray-900" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <footer className="border-t bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-yellow/50"
            />
            <button
              onClick={onSend}
              className="rounded-xl bg-yellow px-5 py-3 hover:bg-light_yellow transition"
            >
              Send
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

