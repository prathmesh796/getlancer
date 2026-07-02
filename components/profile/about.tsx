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
import { Label } from "@/components/ui/label"
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner";
import type { Role } from "@/types/User"

export function AboutDialog({ userId, userRole, about }: { userId: string, userRole: Role, about: string }) {
    let apiUrl = ""
    if (userRole === 'Client') apiUrl = '/api/profile/ClientProfile'
    else apiUrl = '/api/profile/FreelancerProfile'

    const [newAbout, setNewAbout] = useState(about);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fetch(apiUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, updateFields: { description : newAbout } }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Profile updated:", data);
                toast("About updated successfully!");
                DialogClose
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                toast("Failed to update about");
            });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                    <FaRegEdit className="mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit About</DialogTitle>
                    <DialogDescription>
                        Make changes to your about here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="about">About</Label>
                        <Textarea id="about" name="about"
                            placeholder="Tell us about yourself..."
                            value={newAbout}
                            onChange={(e) => setNewAbout(e.target.value)} />
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}