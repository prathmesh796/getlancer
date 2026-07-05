import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface participants {
  userId: string;
  userName: string;
}

const conversationIdForParticipants = (participants: participants[]) =>
  [...participants]
    .map((p) => p.userId)
    .sort((a, b) => a.localeCompare(b))
    .join("__");

export async function ensureConversation({ participants }: { participants: participants[] }) {
  if (!Array.isArray(participants) || participants.length < 2) {
    throw new Error("participants must be an array of at least 2 userIds");
  }

  const conversationId = conversationIdForParticipants(participants);
  const conversationRef = doc(db, "conversations", conversationId);
  const existing = await getDoc(conversationRef);

  if (!existing.exists()) {
    await setDoc(conversationRef, {
      participants: [...new Set(participants.map(p => p.userId))],
      participantDetails: participants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });
  }

  return { conversationId, conversationRef };
}

export async function sendMessage({
  conversationId,
  senderId,
  text,
  type = "text",
}: {
  conversationId: string;
  senderId: string;
  text: string;
  type?: string;
}) {
  if (!conversationId) throw new Error("conversationId is required");
  if (!senderId) throw new Error("senderId is required");
  if (!text || !text.trim()) return;

  const trimmed = text.trim();
  const messagesRef = collection(db, "conversations", conversationId, "messages");

  await addDoc(messagesRef, {
    senderId,
    text: trimmed,
    type,
    createdAt: serverTimestamp(),
  });

  const conversationRef = doc(db, "conversations", conversationId);
  await updateDoc(conversationRef, {
    updatedAt: serverTimestamp(),
    lastMessage: {
      senderId,
      text: trimmed,
      type,
      createdAt: serverTimestamp(),
    },
  });
}