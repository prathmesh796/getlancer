"use client";

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link"
import CJobs from '@/components/CJobs';
import Sidebar from '@/components/Sidebar';

export default function Page() {
    const { data: session } = useSession();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            const fetchCprofile = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/jobs/ClientJobs?userId=${encodeURIComponent(session?.user?.id)}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const data = await response.json();
                    setJobs(data.ClientJobs || []);
                } catch (err) {
                    console.error("Failed to fetch client jobs:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchCprofile();
        }

    }, [session]);

    // Filter jobs based on search query and status
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !searchQuery ||
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-4xl font-semibold bg-gradient-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">Let&apos;s get some work done...</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/NewJob" className="flex justify-center items-center">
                                <button className="flex items-center gap-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
                                    <IoMdAddCircleOutline className='w-6 h-6' />
                                    Post New Job
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Search and Filter Bar */}
                    <div className='mb-8 p-3 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex justify-center gap-2 items-center shadow-lg'>
                        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-4 text-gray-400 dark:text-slate-400' />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border-gray-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-50 z-10 focus:outline-none"
                            placeholder="Search your jobs by title, location, or description..."
                        />

                        <select
                            name="JobStatus"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 focus:outline-none bg-white dark:bg-slate-700 dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors'
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Jobs Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
                                <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">
                                    Your Posted Jobs
                                    <span className="text-lg font-normal text-gray-600 ml-3">
                                        ({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'})
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-pulse text-gray-600 text-lg">Loading your jobs...</div>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredJobs.map((job) => (
                                    <CJobs key={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm">
                                <div className="max-w-md mx-auto">
                                    {searchQuery || statusFilter !== "all" ? (
                                        <>
                                            <p className="text-gray-500 text-lg mb-4">
                                                No jobs found matching your filters
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setStatusFilter("all");
                                                }}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                Clear filters
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 text-lg mb-6">
                                                You haven't posted any jobs yet
                                            </p>
                                            <Link href="/NewJob">
                                                <button className="flex items-center gap-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform mx-auto">
                                                    <IoMdAddCircleOutline className='w-6 h-6' />
                                                    Post Your First Job
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div >
    )
}
