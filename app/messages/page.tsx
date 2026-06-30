"use client";

import { use } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useConversations } from "@/hooks/useConversations";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function Page({ params }) {
  const userId: string = use(params);
  const conversations = useConversations(userId);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar userId={userId} />

      <main className="flex-1 overflow-y-auto">
        <Navbar activeTab="messages" />
        <header className="shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-4xl font-semibold">Messages</h1>
            <div className="flex items-center space-x-4">
              <Button asChild className="rounded-full bg-yellow text-black hover:bg-light_yellow">
                <Link href="/NewMessage">
                  New Message
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {conversations.length === 0 ? (
            <div className="text-gray-600">No conversations yet.</div>
          ) : (
            <div className="divide-y rounded-xl border bg-white">
              {conversations.map((c) => {
                const other =
                  Array.isArray(c.participants) ? c.participants.find((p) => p !== userId) : null;
                const title = other || c.id;
                const preview = c.lastMessage?.text || "No messages yet";

                return (
                  <Link
                    key={c.id}
                    href={`/messages/${userId}/${c.id}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{title}</div>
                      <div className="text-xs text-gray-500">Open</div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">{preview}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
