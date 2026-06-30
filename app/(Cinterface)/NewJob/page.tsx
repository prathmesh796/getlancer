"use client"

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Navbar from "@/components/Navbar";
import { cn } from '@/lib/utils';

const textareaClassName = cn(
    "flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
);

const Page = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const jobData = {
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
            bounty: data.bounty,
            location: data.location,
            skills: typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()) : [],
            company: session?.user?.name || "Unknown",
            userId: session?.user?.id,
        };

        await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jobData),
        });

        router.push("/Cdash");
    };

    return (
        <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar userId={session?.user?.id} />
            <main className="flex-1">
                <Navbar activeTab={"New Job"} />
                <div className="flex-1 flex justify-center items-center">
                    <Card className="w-full max-w-xl border-gray-200 m-5 p-10 shadow-2xl dark:border-slate-700">
                        <CardHeader className="p-0 pb-8">
                            <CardTitle className="bg-linear-to-r from-deep_blue to-marine_blue bg-clip-text text-center text-3xl font-extrabold text-transparent dark:from-yellow dark:to-light_yellow">
                                Post a New Job
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="jobTitle" className="mb-1 block text-base font-semibold">
                                        Job Title
                                    </label>
                                    <Input
                                        type="text"
                                        id="jobTitle"
                                        name="jobTitle"
                                        className="h-10"
                                        required
                                        placeholder="e.g. Senior React Developer"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="jobDescription" className="mb-1 block text-base font-semibold">
                                        Job Description
                                    </label>
                                    <textarea
                                        id="jobDescription"
                                        name="jobDescription"
                                        rows={4}
                                        className={textareaClassName}
                                        required
                                        placeholder="Describe the role, responsibilities, and expectations..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="bounty" className="mb-1 block text-base font-semibold">
                                            Bounty
                                        </label>
                                        <Input
                                            type="number"
                                            id="bounty"
                                            name="bounty"
                                            min="0"
                                            className="h-10"
                                            required
                                            placeholder="e.g. 2000"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="Location" className="mb-1 block text-base font-semibold">
                                            Location
                                        </label>
                                        <Input
                                            type="text"
                                            id="Location"
                                            name="location"
                                            className="h-10"
                                            required
                                            placeholder="e.g. Remote / Berlin"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Skills" className="mb-1 block text-base font-semibold">
                                        Skills <span className="text-xs font-normal text-muted-foreground">(comma separated)</span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="Skills"
                                        name="skills"
                                        className="h-10"
                                        required
                                        placeholder="e.g. React, Node.js, TypeScript"
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        type="submit"
                                        className="rounded-full bg-linear-to-r from-yellow to-light_yellow px-10 py-3 font-bold text-deep_blue shadow-md hover:scale-105 hover:from-light_yellow hover:to-yellow hover:shadow-xl"
                                    >
                                        Post Job
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default Page
