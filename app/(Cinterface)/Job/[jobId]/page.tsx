"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import JobDesc from "@/components/JobDesc";
import JobApplications from "@/components/JobApplications";
import { Spinner } from "@/components/ui/spinner";
import Navbar from "@/components/Navbar";
import type { Job, Application } from "@/types/Jobs"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = use(params);
    const router = useRouter();
    const { data: session } = useSession();

    const [applications, setApplications] = useState<Application[] | []>([]);
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("desc")

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
                    //console.log(data)

                    setApplications(data.applications);
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
                <Navbar activeTab="Job" />

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
                            {job?.title}
                        </h1>
                    </div>
                </header>

                <Tabs defaultValue="overview">
                    <TabsList variant="line">
                        <TabsTrigger value="desc" onClick={() => setActiveTab("desc")}>Job Details</TabsTrigger>
                        <TabsTrigger value="applications" onClick={() => setActiveTab("applications")}>Applications</TabsTrigger>
                    </TabsList>
                </Tabs>


                {activeTab === "desc" && <JobDesc job={job} />}
                {activeTab === "applications" && <JobApplications applications={applications} />}
            </main>
        </div>
    );
}
