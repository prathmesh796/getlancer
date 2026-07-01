"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faFileAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ensureConversation } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import type { Job, Application } from "@/types/Jobs"

export default function JobApplicationsPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = use(params);
    const router = useRouter();
    const { data: session } = useSession();

    const [applications, setApplications] = useState<Application[] | []>([]);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (jobId) {
            const fetchApplications = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/jobs/${jobId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setApplications(data.job.applications);
                    setJob(data.job);
                } catch (error) {
                    console.error("Error fetching applications:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchApplications();
        }
    }, [jobId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
                <Spinner className="size-10" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar userId={session?.user?.id} />

            <main className="flex-1 overflow-y-auto min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <Navbar activeTab="Job Applications" />

                <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-deep_blue dark:hover:text-yellow transition-colors mb-4"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                            <span>Back to Jobs</span>
                        </button>

                        <h1 className="text-3xl font-bold bg-linear-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">
                            Applications for: {job.title}
                        </h1>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                        <h2 className="text-2xl font-bold text-deep_blue dark:text-slate-50">
                            Received Applications
                            <span className="text-lg font-normal text-gray-600 dark:text-slate-400 ml-3">
                                ({applications.length} {applications.length === 1 ? 'applicant' : 'applicants'})
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse text-gray-600 dark:text-slate-400 text-lg">Loading applications...</div>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="space-y-6">
                            {applications.map((app: Application, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        {/* <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-yellow to-light_yellow rounded-full flex items-center justify-center text-deep_blue font-bold text-xl">
                                                {app.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-deep_blue dark:text-slate-50">
                                                    {app.userName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                                                    <span>{app.userEmail}</span>
                                                </div>
                                            </div>
                                        </div> */}

                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                            <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                                        <div className="flex items-start gap-2">
                                            <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mt-1 text-gray-500 dark:text-slate-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Proposal:</p>
                                                <p className="text-sm text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg whitespace-pre-wrap">
                                                    {app.proposal}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                        <Button
                                            onClick={() => {
                                                const currentUserId = session?.user?.id;
                                                if (!currentUserId || !app?.freelancerId) return;

                                                ensureConversation({
                                                    participants: [currentUserId, app.freelancerId],
                                                })
                                                    .then(({ conversationId }) => {
                                                        router.push(`/messages/${currentUserId}/${conversationId}`);
                                                    })
                                                    .catch((err) => {
                                                        console.error("Error starting conversation:", err);
                                                    });
                                            }}
                                            className="w-full sm:w-auto rounded-full bg-linear-to-r from-yellow to-light_yellow font-semibold text-deep_blue hover:shadow-lg"
                                        >
                                            Contact Applicant
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                router.push(`/profile/view/${app.freelancerId}`);
                                            }}
                                            className="w-full sm:w-auto rounded-full font-semibold"
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm">
                            <div className="max-w-md mx-auto">
                                <p className="text-gray-500 dark:text-slate-400 text-lg mb-6">
                                    No applications received yet for this job
                                </p>
                                <p className="text-sm text-gray-400 dark:text-slate-500">
                                    Check back later to see who has applied
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
