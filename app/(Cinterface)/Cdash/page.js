"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link"
import CJobs from '@/components/CJobs';
import Sidebar from '@/components/Sidebar';

export default function page() {
    const { data: session } = useSession();

    const [query, setQuery] = React.useState("");
    const [jobs, setJobs] = React.useState([]);

    React.useEffect(() => {
        if (session?.user?.id) {
            const fetchCprofile = async () => {
                const response = await fetch(`/api/jobs/ClientJobs?userId=${encodeURIComponent(session?.user?.id)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).catch(err => {
                    console.error("Failed to fetch client jobs:", err);
                });
                const data = await response.json();
                setJobs(data);
            };
            
            fetchCprofile();
        }

    }, [session]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-4xl font-semibold">Let's get Some work done...</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/NewJob" className="flex justify-center items-center">
                                <button className="flex bg-yellow m-10 px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200"><IoMdAddCircleOutline className='w-6 h-6 mr-2' />Post New Job</button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
                    <div className='m-4 p-2 rounded-full border border-gray-300  flex justify-center gap-2 items-center shadow-md w-2/3 '>
                        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-6' />
                        <input
                            type="text"
                            //onChange={(e) => setQuery(e.target.value)}
                            className="w-full border-gray-50 z-10  focus:outline-none" placeholder="Search your jobs..."
                        />

                        <select name="JobStatus" id="" className='px-4 py-2 rounded-full border border-gray-300 focus:outline-none'>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    {/* Overview Section */}
                    <div className="flex flex-row gap-4 w-full">
                        {jobs.length > 0 ? (
                            <div className="w-full">
                                <h2 className="text-2xl font-semibold mb-4">Your Jobs</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs.map((job) => (
                                        <CJobs job={job} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <h2 className="text-2xl font-semibold mb-4">Your Jobs</h2>
                                <p>No jobs found.</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div >
    )
}
