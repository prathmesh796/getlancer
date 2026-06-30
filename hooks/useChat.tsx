"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export const useChat = (projectId: string) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!projectId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "messages"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [projectId]);

  return messages;
};