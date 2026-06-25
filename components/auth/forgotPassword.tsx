import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function ForgotPasswordDialog() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        e.preventDefault();
        const response = await fetch("/api/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            setMessage("Reset passord link has been sent to your email.")
            setLoading(false)
        } else {
            const data = await response.json();
            setMessage(data.message || "Something went wrong.");
            setLoading(false)
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="mt-2 h-auto p-0 text-yellow" variant="link">
                    forgot password?
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label className="block text-lg font-medium mb-2">Email</Label>
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                        />
                    </Field>
                    {(loading) ? (<p>Sending link...</p>) : (<p>{message}</p>)}
                </FieldGroup>
                <DialogFooter className="flex justify-between">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>
                        Send Reset Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}