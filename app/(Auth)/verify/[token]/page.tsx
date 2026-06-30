"use client";
import { use, useState, useEffect, useRef } from "react";
import Banner from "@/components/Banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmail({ params }: { params: Promise<{ token: string }> }) {
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
            <Banner />

            <div className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-md m-5 shadow-lg">
                    <CardHeader>
                        <CardTitle>Verify Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {message}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}