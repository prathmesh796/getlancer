"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import { Application } from "@/types/Jobs";

export default function MyApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        if (session?.user?.id) {
            setLoading(true);
            fetchApplications();
        }
    }, [session]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`/api/applications?freelancerId=${encodeURIComponent(session.user.id)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            setApplications(data.applications || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter applications based on search query and status
    const filteredApplications = applications.filter(app => {
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;

        return matchesStatus;
    });

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
                <Spinner className="size-10" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar userId={session?.user?.id} />

            <main className="flex-1 overflow-y-auto min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navbar activeTab="My Applications" />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 md:h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                        <h2 className="text-xl md:text-2xl font-bold text-deep_blue dark:text-slate-50">
                            Applications Submitted
                        </h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Filter</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>Accepted</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>Rejected</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {filteredApplications.length > 0 ? (
                        <div className="space-y-4">
                            {filteredApplications.map((app: Application) => (
                                <div
                                    key={app._id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
                                        <div className="flex-1">
                                            <h3 className="text-xl md:text-2xl font-bold text-deep_blue dark:text-slate-50 mb-2">
                                                {app.jobId}
                                            </h3>
                                        </div>

                                        <div className={`px-4 py-2 rounded-full text-sm font-semibold self-start ${app.status === 'pending'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : app.status === 'assigned'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                            }`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mt-1 text-gray-500 dark:text-slate-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Your Proposal:</p>
                                                <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                                                    {app.proposal}
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
                                {statusFilter !== "all" ? (
                                    <>
                                        <p className="text-gray-500 dark:text-slate-400 text-lg mb-4">
                                            No applications found matching your filters
                                        </p>
                                        <Button
                                            variant="link"
                                            onClick={() => {
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
            </main >
        </div >
    );
}
