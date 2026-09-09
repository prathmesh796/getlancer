"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      return;
    }

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setConversations(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      },
      (error) => {
        console.error("Unable to listen for conversations", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return conversations;
}

