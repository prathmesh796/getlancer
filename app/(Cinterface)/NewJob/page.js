"use client"

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


const page = () => {
    const { data: session } = useSession();

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const jobData = {
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
            budget: data.budget,
            location: data.location,
            skills: data.skills.split(',').map(skill => skill.trim()), // Optional: convert comma-separated string to array
            company: session?.user?.name || "Unknown",
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
        <main>
            <h1>Post a New Job</h1>

            <form action="" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                    <input type="text" id="jobTitle" name="jobTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="jobDescription" className="block text-gray-700 text-sm font-bold mb-2">Job Description</label>
                    <textarea id="jobDescription" name="jobDescription" rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">Budget</label>
                    <input type="number" id="budget" name="budget" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="Location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <input type="text" id="Location" name="location" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <div className="mb-4">
                    <label htmlFor="Skills" className="block text-gray-700 text-sm font-bold mb-2">Skills</label>
                    <input type="text" id="Skills" name="skills" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>

                <button type="submit" className="flex bg-yellow m-10 text-black px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">Post Job</button>
            </form>
        </main>
    )
}

export default page
