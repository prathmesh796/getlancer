"use client";
import { useState } from "react";

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
    <div>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  );
}