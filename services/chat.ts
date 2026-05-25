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

const conversationIdForParticipants = (participants) =>
  [...participants].sort().join("__");

export async function ensureConversation({ participants }) {
  if (!Array.isArray(participants) || participants.length < 2) {
    throw new Error("participants must be an array of at least 2 userIds");
  }

  const conversationId = conversationIdForParticipants(participants);
  const conversationRef = doc(db, "conversations", conversationId);
  const existing = await getDoc(conversationRef);

  if (!existing.exists()) {
    await setDoc(conversationRef, {
      participants: [...new Set(participants)],
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
}) {
  if (!conversationId) throw new Error("conversationId is required");
  if (!senderId) throw new Error("senderId is required");
  if (!text || !text.trim()) return;

  const trimmed = text.trim();
  const messagesRef = collection(db, "conversations", conversationId, "messages");

  await addDoc(messagesRef, {
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
  });

  const conversationRef = doc(db, "conversations", conversationId);
  await updateDoc(conversationRef, {
    updatedAt: serverTimestamp(),
    lastMessage: {
      senderId,
      text: trimmed,
      createdAt: serverTimestamp(),
    },
  });
}