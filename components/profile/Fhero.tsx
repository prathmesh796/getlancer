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
import { useState, useEffect } from "react"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner";
import { Input } from "../ui/input";

export type FheroType = {
    name: string;
    title: string;
    bio: string;
    location: string;
    hourlyRate: number;
    profilePic: File;
}

export function FHeroDialog({ userId, hero }: { userId: string, hero: FheroType }) {
    const [newHero, setNewHero] = useState(hero);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setNewHero(hero);
    }, [hero.name, hero.title, hero.bio, hero.location, hero.hourlyRate, hero.profilePic]);

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file)); // Create preview URL
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("name", newHero.name || "");
        formData.append("title", newHero.title || "");
        formData.append("bio", newHero.bio || "");
        formData.append("location", newHero.location || "");
        formData.append("hourlyRate", newHero.hourlyRate?.toString() || "0");
        if (image) {
            formData.append("profilePic", image);
        }

        const res = fetch('/api/profile/FreelancerProfile', {
            method: "PATCH",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Profile updated:", data);
                toast("Profile updated successfully!");
                setOpen(false);
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                toast("Failed to update about");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                    <FaRegEdit className="mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit About</DialogTitle>
                    <DialogDescription>
                        Make changes to your about here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup className="grid grid-cols-2">
                    <Field>
                        <Label htmlFor="logo">Profile Picture</Label>
                        <Input id="logo" name="logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e)} />
                        {preview && (
                            <img
                                src={preview || undefined}
                                alt="Preview"
                                className="mt-2 w-24 h-24 object-cover rounded"
                            />
                        )}
                    </Field>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name"
                                placeholder="Enter your name..."
                                value={newHero.name || ""}
                                onChange={(e) => setNewHero({ ...newHero, name: e.target.value })} />
                        </Field>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title"
                                placeholder="Enter your title..."
                                value={newHero.title || ""}
                                onChange={(e) => setNewHero({ ...newHero, title: e.target.value })} />
                        </Field>
                        <Field>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio"
                                placeholder="Tell us about yourself..."
                                value={newHero.bio || ""}
                                onChange={(e) => setNewHero({ ...newHero, bio: e.target.value })} />
                        </Field>
                        <Field>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location"
                                placeholder="Enter your location..."
                                value={newHero.location || ""}
                                onChange={(e) => setNewHero({ ...newHero, location: e.target.value })} />
                        </Field>
                        <Field>
                            <Label htmlFor="hourlyRate">Hourly Rate</Label>
                            <Input id="hourlyRate" name="hourlyRate" type="number"
                                placeholder="Enter your hourly rate..."
                                value={newHero.hourlyRate || 0}
                                onChange={(e) => setNewHero({ ...newHero, hourlyRate: Number(e.target.value) })} />
                        </Field>
                    </FieldGroup>
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