"use client";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Banner from "@/components/Banner";

export default function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: rawToken } = use(params);
  const token = decodeURIComponent(rawToken);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <Banner />

      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-md m-5 shadow-lg">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              className="w-full bg-yellow text-black hover:bg-light_yellow"
            >
              Reset Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
