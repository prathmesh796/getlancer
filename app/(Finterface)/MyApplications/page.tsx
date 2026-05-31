"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFileAlt, faBriefcase, faMapMarkerAlt, faCalendar, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MyApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchApplications();
        }
    }, [session]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/jobs/applications?userId=${encodeURIComponent(session.user.id)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setApplications(data.applications || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter applications based on search query and status
    const filteredApplications = applications.filter(app => {
        const matchesSearch = !searchQuery ||
            app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (status === "loading") {
        return null;
    }

    if (status === "authenticated") {
        return (
            <div className="flex min-h-screen">
                <Sidebar userId={session?.user?.id} />

                <main className="flex-1 overflow-y-auto min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <h1 className="text-3xl font-bold bg-linear-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent mb-4">
                                My Applications
                            </h1>

                            <div className='p-2 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex justify-center gap-2 items-center shadow-md'>
                                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-6 text-gray-400 dark:text-slate-400' />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="z-10 h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
                                    placeholder="Search applications by title, company, or location..."
                                />

                                <select
                                    name="StatusFilter"
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
                        </div>
                    </header>

                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                            <h2 className="text-2xl font-bold text-deep_blue dark:text-slate-50">
                                Applications Submitted
                                <span className="text-lg font-normal text-gray-600 dark:text-slate-400 ml-3">
                                    ({filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'})
                                </span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-pulse text-gray-600 dark:text-slate-400 text-lg">Loading your applications...</div>
                            </div>
                        ) : filteredApplications.length > 0 ? (
                            <div className="space-y-4">
                                {filteredApplications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-deep_blue dark:text-slate-50 mb-2">
                                                    {app.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
                                                        <span>{app.company}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                                                        <span>{app.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4" />
                                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                                            ${app.bounty?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                                        <span>Posted: {new Date(app.datePosted).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${app.status === 'open'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : app.status === 'assigned'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 dark:text-slate-300 mb-4 line-clamp-2">
                                            {app.description}
                                        </p>

                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {app.skills?.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                                            <div className="flex items-start gap-2 mb-2">
                                                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mt-1 text-gray-500 dark:text-slate-400" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Your Proposal:</p>
                                                    <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                                                        {app.myProposal}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm">
                                <div className="max-w-md mx-auto">
                                    {searchQuery || statusFilter !== "all" ? (
                                        <>
                                            <p className="text-gray-500 dark:text-slate-400 text-lg mb-4">
                                                No applications found matching your filters
                                            </p>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setStatusFilter("all");
                                                }}
                                                className="font-semibold text-blue-600 dark:text-blue-400"
                                            >
                                                Clear filters
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 dark:text-slate-400 text-lg mb-6">
                                                You haven't applied to any jobs yet
                                            </p>
                                            <Button
                                                onClick={() => router.push('/Fdash')}
                                                className="rounded-full bg-linear-to-r from-yellow to-light_yellow px-8 py-3 font-semibold text-deep_blue hover:scale-105 hover:shadow-2xl"
                                            >
                                                Browse Jobs
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    return null;
}
