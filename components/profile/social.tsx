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
import { FaRegEdit } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react"
import { toast } from "sonner"
import { Role } from "@/types/User"

export function SocialDialog({ userId, userRole, socialData }: { userId: string, userRole: Role, socialData: string[] }) {
    let apiUrl = ""
    if(userRole === 'Client') apiUrl = '/api/profile/ClientProfile'
    else apiUrl = '/api/profile/FreelancerProfile'
    
    const [socialLinks, setSocialLinks] = useState<string[]>(socialData);
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            setSocialLinks([...socialLinks, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            console.log("Submitting social links:", socialLinks);
            const response = await fetch(apiUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, updateFields: { socialLinks } }),
            })
            
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Profile updated:", data);
            toast("Social links updated successfully!");
            DialogClose
        } catch (error) {
            console.error("Error updating profile:", error);
            toast("Failed to update social links");
        }
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
                    <DialogTitle>Edit Social Links</DialogTitle>
                    <DialogDescription>
                        Make changes to your social links here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="socialLinks">Social Links</Label>
                        <Input id="socialLinks" name="socialLinks"
                            placeholder="https://twitter.com/username, etc."
                            value={inputValue}
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown} />
                    </Field>
                    {socialLinks?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {socialLinks.map((link, idx) => (
                                <span
                                    key={idx}
                                    className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-blue-700 text-sm font-medium shadow-sm"
                                >
                                    {link}
                                    <span className="ml-2 text-red-500 cursor-pointer" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))}>
                                        <RxCross2 />
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}