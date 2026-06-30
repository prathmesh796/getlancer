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
import { Textarea } from "@/components/ui/textarea"
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSaveAs } from "react-icons/md";
import { useState } from "react"
import { projects } from "@/types/User";
import Link from "next/link";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner"

export function ProjectsDialog({ userId, projectsData }: { userId: string, projectsData: projects[] }) {
    const [projects, setProjects] = useState<projects[]>(projectsData );
    const [editingIndex, setEditingIndex] = useState(null);
    const [newProject, setNewProject] = useState<projects>({ title: "", description: "", link: "", tags: [] } as projects);
    const [projectTagsInput, setProjectTagsInput] = useState<string>("");

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fetch("/api/profile/FreelancerProfile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, updateFields: { projects } }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Profile updated:", data);
                toast("Projects updated successfully!");
                DialogClose
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                toast("Failed to update projects");
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
                        <DialogTitle>Edit Projects</DialogTitle>
                        <DialogDescription>
                            Make changes to your projects here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="skills">Projects</Label>
                            <Input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                className="w-full border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            />
                            <Textarea
                                name="description"
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                rows={2}
                            />
                            <Input
                                type="url"
                                placeholder="Link"
                                value={newProject.link}
                                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                                className="w-full border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            />
                            <Input
                                type="text"
                                placeholder="Tags (comma-separated)"
                                value={projectTagsInput}
                                onChange={(e) => setProjectTagsInput(e.target.value)}
                                className="w-full border p-2 rounded mb-2 border-gray-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            />

                            <Button
                                type="button"
                                onClick={() => {
                                    const tags = projectTagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
                                    if (newProject.title || newProject.description || newProject.link) {
                                        if (editingIndex !== null) {
                                            const updated = [...projects];
                                            updated[editingIndex] = { ...newProject, tags };
                                            setProjects(updated);
                                            setEditingIndex(null);
                                        } else {
                                            setProjects([...projects, { ...newProject, tags }]);
                                        }
                                    }
                                    setNewProject({ title: "", description: "", link: "", tags: [] });
                                    setProjectTagsInput("");
                                }}
                                className="self-end mt-2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full shadow transition"
                                title={editingIndex !== null ? "Save Project" : "Add Project"}
                            >
                                {editingIndex !== null ? <MdOutlineSaveAs className="w-6 h-6" /> : <IoAddCircleOutline className="w-6 h-6" />}
                            </Button>


                    </Field>
                    {projects.length > 0 && (
                        <ul className="space-y-3">
                            {projects.map((proj, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border p-4 rounded-xl bg-slate-50 dark:bg-slate-800 shadow"
                                >
                                    <div className="flex-1">
                                        <div className="font-semibold mb-1">
                                            <span>Project Name: </span>
                                            <Link href={proj.link} target="_blank" className="underline text-marine_blue hover:text-blue-800 dark:text-yellow-300">
                                                {proj.title}
                                            </Link>
                                        </div>
                                        <div className="text-sm mt-1 mb-1">
                                            <span className="font-medium">Description:</span> {proj.description}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="font-medium">Tags:</span>
                                            {proj.tags.map((tag, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-green-300 dark:bg-green-600 rounded-full text-white text-xs">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            type="button"
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition"
                                            onClick={() => {
                                                setNewProject(proj);
                                                setEditingIndex(index);
                                                setProjectTagsInput(proj.tags.join(", "));
                                            }}
                                            title="Edit Project"
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition"
                                            onClick={() => {
                                                const updated = projects.filter((_, i) => i !== index);
                                                setProjects(updated);
                                                if (editingIndex === index) {
                                                    setNewProject({ title: "", description: "", link: "", tags: [] });
                                                    setEditingIndex(null);
                                                    setProjectTagsInput("");
                                                }
                                            }}
                                            title="Delete Project"
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
        </Dialog>
    )
}