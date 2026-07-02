"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConversations } from "@/hooks/useConversations";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const conversations = useConversations(userId!);

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar userId={userId} />

      <main className="flex-1 flex flex-col">
        <Navbar activeTab="messages" />
        
        <section className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {conversations.length === 0 ? (
              <div className="text-gray-600 dark:text-slate-300 text-center py-14">
                <Card className="mx-auto max-w-md border-gray-100 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
                  <CardContent className="p-8 text-center">
                  <div className="mb-2 text-lg font-semibold text-deep_blue dark:text-slate-50">
                    No conversations yet
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Send a message below to start the conversation.
                  </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((c) => {
                  const mine = c.senderId === userId;
                  const createdAt =
                    typeof c?.createdAt?.toDate === "function" ? c.createdAt.toDate() : null;

                  return (
                    <Link href={`/messages/${userId}/${c.id}`} key={c.id} className={`flex-col`}>
                      <div
                        className={[
                          "max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 py-3 shadow-sm border",
                          mine
                            ? "bg-linear-to-r from-yellow to-light_yellow text-deep_blue border-yellow/30"
                            : "bg-white/90 dark:bg-slate-800/80 text-gray-900 dark:text-slate-50 border-gray-100 dark:border-slate-700",
                        ].join(" ")}
                      >
                        <div className="whitespace-pre-wrap wrap-break-words text-sm leading-relaxed">
                          {c.id}
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}