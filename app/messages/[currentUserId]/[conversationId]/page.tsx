"use client";

import { useEffect, useMemo, useRef, useState, use } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useMessages } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { sendMessage } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export default function Page({ params }: { params: Promise<{ currentUserId: string; conversationId: string }> }) {
    const { currentUserId: userId, conversationId } = use(params);
    const messages = useMessages(conversationId);
    const conversations = useConversations(userId);
    const conversation = conversations.find((c: any) => c.id === conversationId);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    const otherParticipant = useMemo(() => {
        if (!conversation) return null;
        return conversation.participantDetails?.find((p: any) => p.userId !== userId) || null;
    }, [conversation, userId]);

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
        <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar userId={userId} />

            <main className="flex-1 flex flex-col">
                <Navbar activeTab="message" />

                <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                    <div className="max-w-5xl mx-auto py-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <div className="flex">
                            <Link href={`/messages`} className="p-4">
                                <ArrowLeft />
                            </Link>
                            <Link href={`/profile/${otherParticipant?.userId}`}>
                                <h1 className="text-2xl font-semibold text-deep_blue dark:text-slate-50">
                                    {otherParticipant?.userName ? `${otherParticipant.userName}` : "Conversation"}
                                </h1>
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {messages.length === 0 ? (
                            <div className="text-gray-600 dark:text-slate-300 text-center py-14">
                                <Card className="mx-auto max-w-md border-gray-100 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
                                    <CardContent className="p-8 text-center">
                                        <div className="mb-2 text-lg font-semibold text-deep_blue dark:text-slate-50">
                                            No messages yet
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Send a message below to start the conversation.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((m) => {
                                    const mine = m.senderId === userId;
                                    const createdAt =
                                        typeof m?.createdAt?.toDate === "function" ? m.createdAt.toDate() : null;

                                    return (
                                        <Message key={m.id} align={mine ? "end" : "start"}>
                                            {m.type === "mark" && <Marker variant="separator">
                                                <MarkerIcon>
                                                    <CheckIcon />
                                                </MarkerIcon>
                                                <MarkerContent>{m.text}</MarkerContent>
                                            </Marker>}
                                            {m.type !== "mark" && (
                                                <>
                                                    <MessageAvatar>
                                                        <Avatar>
                                                            <AvatarImage src={mine ? `/profilepic.jpeg` : `/office-building.jpg`} />
                                                            <AvatarFallback>{mine ? "You" : "Other"}</AvatarFallback>
                                                        </Avatar>
                                                    </MessageAvatar>
                                                    <MessageContent>
                                                        <Bubble variant={mine ? "default" : "outline"}>
                                                            <BubbleContent>{m.text}</BubbleContent>
                                                        </Bubble>
                                                        <MessageFooter>
                                                            {createdAt ? createdAt.toLocaleString() : ""}
                                                        </MessageFooter>
                                                    </MessageContent>
                                                </>)}
                                        </Message>
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
                                placeholder="Type a message… "
                                rows={1}
                                className={cn(
                                    "flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2 text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                )}
                            />
                            <Button
                                onClick={onSend}
                                disabled={sending || !text.trim()}
                                className="rounded-2xl px-5 py-3 font-semibold bg-yellow text-deep_blue hover:bg-light_yellow disabled:bg-muted disabled:text-muted-foreground"
                            >
                                {sending ? "Sending…" : "Send"}
                            </Button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}