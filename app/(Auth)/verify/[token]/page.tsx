"use client";
import { use, useState, useEffect, useRef } from "react";

export default function VerifyEmail({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token: rawToken } = use(params);
    const token = decodeURIComponent(rawToken);
    const [message, setMessage] = useState("verifying...");
    const verifyStarted = useRef(false);

    useEffect(() => {
        if (verifyStarted.current) return;
        verifyStarted.current = true;

        const verify = async () => {
            const res = await fetch("/api/verify", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            setMessage(data.message);
        };

        verify();
    }, [token]);
    return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
            {message}
        </div>
    );
}