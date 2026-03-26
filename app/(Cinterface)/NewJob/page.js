"use client"

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const Page = () => {
    const { data: session } = useSession();

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const jobData = {
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
            bounty: data.bounty,
            location: data.location,
            skills: data.skills.split(',').map(skill => skill.trim()),
            company: session?.user?.name || "Unknown",
            userId: data.userId || session?.user?.id
        };

        const res = await fetch("/api/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jobData),
        });

        const responseData = await res.json();

        router.push("/Cdash");
    };


    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar userId={session?.user?.id} />
            <main className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-xl bg-white/90 dark:bg-slate-800/90 shadow-2xl rounded-2xl p-10 border border-gray-200 dark:border-slate-700">
                    <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">
                        Post a New Job
                    </h1>

                    <form action="" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="jobTitle" className="block text-gray-700 dark:text-slate-200 text-base font-semibold mb-1">
                                Job Title
                            </label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                className="border border-gray-300 dark:border-slate-600 rounded-lg w-full py-2 px-4 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow"
                                required
                                placeholder="e.g. Senior React Developer"
                            />
                        </div>

                        <div>
                            <label htmlFor="jobDescription" className="block text-gray-700 dark:text-slate-200 text-base font-semibold mb-1">
                                Job Description
                            </label>
                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                rows="4"
                                className="border border-gray-300 dark:border-slate-600 rounded-lg w-full py-2 px-4 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow resize-y"
                                required
                                placeholder="Describe the role, responsibilities, and expectations..."
                            ></textarea>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="bounty" className="block text-gray-700 dark:text-slate-200 text-base font-semibold mb-1">
                                    Bounty
                                </label>
                                <input
                                    type="number"
                                    id="bounty"
                                    name="bounty"
                                    min="0"
                                    className="border border-gray-300 dark:border-slate-600 rounded-lg w-full py-2 px-4 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 transition focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow"
                                    required
                                    placeholder="e.g. 2000"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="Location" className="block text-gray-700 dark:text-slate-200 text-base font-semibold mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="Location"
                                    name="location"
                                    className="border border-gray-300 dark:border-slate-600 rounded-lg w-full py-2 px-4 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 transition focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow"
                                    required
                                    placeholder="e.g. Remote / Berlin"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="Skills" className="block text-gray-700 dark:text-slate-200 text-base font-semibold mb-1">
                                Skills <span className="text-xs text-gray-400 font-normal">(comma separated)</span>
                            </label>
                            <input
                                type="text"
                                id="Skills"
                                name="skills"
                                className="border border-gray-300 dark:border-slate-600 rounded-lg w-full py-2 px-4 bg-slate-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow"
                                required
                                placeholder="e.g. React, Node.js, TypeScript"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-yellow to-light_yellow text-deep_blue font-bold px-10 py-3 rounded-full shadow-md hover:shadow-xl hover:scale-105 hover:from-light_yellow hover:to-yellow transition-all duration-200"
                            >
                                Post Job
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Page
