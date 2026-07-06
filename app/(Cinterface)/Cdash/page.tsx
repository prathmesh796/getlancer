"use client";

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link"
import CJobs from '@/components/CJobs';
import Sidebar from '@/components/Sidebar';
import { Job } from '@/types/Jobs';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Navbar from '@/components/Navbar';

export default function Page() {
    const { data: session, status } = useSession();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        const fetchClientJobs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/jobs/ClientJobs?userId=${encodeURIComponent(session.user.id)}`, {
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

        fetchClientJobs();
    }, [session, status]);

    // Filter jobs based on search query and status
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !searchQuery ||
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
                <Spinner className="size-10" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar userId={session?.user?.id} />

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <Navbar activeTab={"dashboard"} />
                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                        <h1 className="text-2xl md:text-4xl font-semibold bg-linear-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent text-center md:text-left">Let&apos;s get some work done...</h1>
                        <div className="flex items-center space-x-4">
                            <Link href="/NewJob" className="flex justify-center items-center">
                                <button className="flex items-center gap-2 bg-linear-to-r from-yellow to-light_yellow text-deep_blue px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform text-sm md:text-base">
                                    <IoMdAddCircleOutline className='w-5 h-5 md:w-6 md:h-6' />
                                    Post New Job
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
                    {/* Search and Filter Bar */}
                    <div className='mb-8 p-3 rounded-2xl md:rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex flex-col md:flex-row justify-center gap-2 md:gap-4 items-center shadow-lg'>
                        <div className="flex items-center w-full px-2">
                          <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '20px', height: '20px' }} className='mr-3 text-gray-400 dark:text-slate-400 shrink-0' />
                          <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-transparent border-none text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-0 text-sm md:text-base py-2"
                              placeholder="Search your jobs by title, location, or description..."
                          />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full">
                                    Filter <FontAwesomeIcon icon={faChevronDown} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("assigned")}>Assigned</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("open")}>Open</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Jobs Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 md:h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                                <h2 className="text-xl md:text-3xl font-bold text-deep_blue dark:text-slate-50">
                                    Your Posted Jobs
                                    <span className="text-sm md:text-lg font-normal text-gray-600 ml-2 md:ml-3">
                                        ({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'})
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredJobs.map((job) => (
                                    <CJobs key={job._id} jobid={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm">
                                <div className="max-w-md mx-auto px-4">
                                    {searchQuery || statusFilter !== "all" ? (
                                        <>
                                            <p className="text-gray-500 text-base md:text-lg mb-4">
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
                                            <p className="text-gray-500 text-base md:text-lg mb-6">
                                                You haven't posted any jobs yet
                                            </p>
                                            <Link href="/NewJob">
                                                <button className="flex items-center justify-center gap-2 bg-linear-to-r from-yellow to-light_yellow text-deep_blue px-6 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform mx-auto w-full md:w-auto">
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
        </div>
    )
}
