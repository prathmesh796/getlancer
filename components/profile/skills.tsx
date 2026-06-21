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

export function SkillsDialog({ userId, skillsData }: { userId: string, skillsData: string[] }) {
    const [skills, setSkills] = useState<string[]>(skillsData);
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            setSkills([...skills, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fetch("/api/profile/FreelancerProfile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, updateFields: { skills } }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Profile updated:", data);
                // Optionally, you can add a success message or close the dialog here
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                // Optionally, you can add an error message here
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
                    <DialogTitle>Edit Skills</DialogTitle>
                    <DialogDescription>
                        Make changes to your skills here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="skills">Skills</Label>
                        <Input id="skills" name="skills"
                            type="text"
                            placeholder="React, etc."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown} />
                    </Field>
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full text-yellow-700 text-sm font-medium shadow-sm"
                                >
                                    {skill}
                                    <Button variant="ghost" size="icon" onClick={() => setSkills(skills.filter((_, i) => i !== idx))}>
                                        <RxCross2 className="text-red-500" />
                                    </Button>
                                </span>
                            ))}
                        </div>
                    )}
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