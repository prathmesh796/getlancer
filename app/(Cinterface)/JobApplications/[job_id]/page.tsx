"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faEnvelope, faFileAlt, faCalendar, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { ensureConversation } from "@/services/chat";

export default function JobApplicationsPage({ params }: { params: Promise<{ job_id: string }> }) {
    const { job_id } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();

    const [applications, setApplications] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (job_id) {
            fetchApplications();
        }
    }, [job_id]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/jobs/${job_id}/applications`, {
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
            setJobTitle(data.jobTitle || "");
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return null;
    }

    if (status === "authenticated") {
        return (
            <div className="flex min-h-screen">
                <Sidebar userId={session?.user?.id} />

                <main className="flex-1 overflow-y-auto min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-deep_blue dark:hover:text-yellow transition-colors mb-4"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                                <span>Back to Jobs</span>
                            </button>

                            <h1 className="text-3xl font-bold bg-gradient-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">
                                Applications for: {jobTitle}
                            </h1>
                        </div>
                    </header>

                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
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
                                {applications.map((app, index) => (
                                    <div
                                        key={app.userId}
                                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow to-light_yellow rounded-full flex items-center justify-center text-deep_blue font-bold text-xl">
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
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                                <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {app.userBio && (
                                            <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                                <p className="text-sm text-gray-700 dark:text-slate-300">
                                                    <span className="font-semibold">Bio: </span>
                                                    {app.userBio}
                                                </p>
                                            </div>
                                        )}

                                        {app.userSkills && app.userSkills.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Skills:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {app.userSkills.map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

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

                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => {
                                                    // Start (or open) a realtime chat with this applicant.
                                                    // ConversationId is derived deterministically from both participant ids.
                                                    const currentUserId = session?.user?.id;
                                                    if (!currentUserId || !app?.userId) return;

                                                    ensureConversation({
                                                        participants: [currentUserId, app.userId],
                                                    })
                                                        .then(({ conversationId }) => {
                                                            router.push(`/messages/${currentUserId}/${conversationId}`);
                                                        })
                                                        .catch((err) => {
                                                            console.error("Error starting conversation:", err);
                                                        });
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                                            >
                                                Contact Applicant
                                            </button>
                                            <button
                                                onClick={() => {
                                                    router.push(`/profile/view/${app.userId}`);
                                                }}
                                                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300"
                                            >
                                                View Profile
                                            </button>
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

    return null;
}
