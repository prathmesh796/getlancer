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
import { useState } from "react"
import { Textarea } from "../ui/textarea";
import { experience } from "@/types/User";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSaveAs } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import MonthYearDatePicker from "../ui/datepicker";
import { toast } from "sonner"

export function ExperienceDialog({ userId, experienceData }: { userId: string, experienceData: experience[] }) {
    const [experience, setExperience] = useState(experienceData);
    const [open, setOpen] = useState(false);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [newExperience, setNewExperience] = useState<Partial<experience>>({ title: "", company: "", startDate: new Date(), endDate: new Date(), description: "" });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fetch("/api/profile/FreelancerProfile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, updateFields: { experience } }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Profile updated:", data);
                toast.success("Experience updated successfully!");
                setOpen(false);
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                toast.error("Failed to update experience!");
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
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Experience</DialogTitle>
                        <DialogDescription>
                            Make changes to your experience here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label className="block text-lg font-medium mb-2">Experience</Label>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-yellow-800 mb-2 flex flex-col gap-2">
                                <div className="grid md:grid-cols-2 gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Role"
                                        value={newExperience.title}
                                        onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                                        className="border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Company"
                                        value={newExperience.company}
                                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                        className="border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-2 mb-2">
                                    <MonthYearDatePicker dateType="startDate" />
                                    <MonthYearDatePicker dateType="endDate" />
                                </div>
                                <Textarea
                                    placeholder="Short description"
                                    value={newExperience.description}
                                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                    className="border p-2 rounded border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                />
                            </div>
                            <Textarea
                                placeholder="Short description"
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                className="w-full border p-2 rounded border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition mb-2"
                                rows={2}
                            />

                            <Button
                                type="button"
                                onClick={() => {
                                    const experienceData = { ...newExperience } as Partial<experience>;
                                    if (
                                        !experienceData.title &&
                                        !experienceData.company &&
                                        !experienceData.startDate &&
                                        !experienceData.endDate &&
                                        !experienceData.description
                                    ) return;

                                    if (editingExperienceIndex !== null) {
                                        const updated = [...experience];
                                        updated[editingExperienceIndex] = experienceData as experience;
                                        setExperience(updated as experience[]);
                                        setEditingExperienceIndex(null);
                                    } else {
                                        setExperience([...experience, experienceData as experience]);
                                    }
                                    setNewExperience({ title: "", company: "", startDate: new Date(), endDate: new Date(), description: "" });
                                }}
                                className="self-end mt-2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full shadow transition"
                                title={editingExperienceIndex !== null ? "Save Experience" : "Add Experience"}
                            >
                                {editingExperienceIndex !== null ? <MdOutlineSaveAs className="w-6 h-6" /> : <IoAddCircleOutline className="w-6 h-6" />}
                            </Button>
                        </Field>
                        {experience.length > 0 && (
                            <ul className="space-y-3">
                                {experience.map((exp, index) => (
                                    <li key={index} className="flex justify-between items-center border p-3 rounded-xl bg-slate-50 dark:bg-slate-800 shadow">
                                        <div className="flex-1">
                                            <div className="font-semibold text-base">{exp.title || <span className="italic text-gray-400">No role</span>} <span className="text-gray-400 font-normal">at</span> {exp.company || <span className="italic text-gray-400">Unknown</span>}</div>
                                            <div className="text-xs text-gray-600">
                                                {exp.startDate ? (
                                                    `${exp.startDate} - ${exp.endDate || "Present"}`
                                                ) : (
                                                    <span className="italic">Dates N/A</span>
                                                )}
                                            </div>
                                            <p className="text-sm mt-1">{exp.description}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                type="button"
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-2 rounded-full transition"
                                                onClick={() => {
                                                    setNewExperience(exp);
                                                    setEditingExperienceIndex(index);
                                                }}
                                                title="Edit Experience"
                                            >
                                                <FiEdit3 />
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-2 rounded-full transition"
                                                onClick={() => {
                                                    const updated = experience.filter((_, i) => i !== index);
                                                    setExperience(updated);
                                                    if (editingExperienceIndex === index) {
                                                        setNewExperience({ title: "", company: "", startDate: new Date(), endDate: new Date(), description: "" });
                                                        setEditingExperienceIndex(null);
                                                    }
                                                }}
                                                title="Delete"
                                            >
                                                <MdDeleteForever />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
        </Dialog >
    )
}