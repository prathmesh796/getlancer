"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPassword({ params }) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: params.token,
        password,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
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
  );
}
