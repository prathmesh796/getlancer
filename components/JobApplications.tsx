import { Application } from '@/types/Jobs';
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFileAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ensureConversation } from "@/services/chat";
import { Button } from "@/components/ui/button"; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const JobApplications = ({ applications }: {applications: Application[] | []}) => {
    const { data: session } = useSession();

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    return (
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

            {applications.length > 0 ? (
                <div className="space-y-6">
                    {applications.map((app: Application, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-700"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-linear-to-br from-yellow to-light_yellow rounded-full flex items-center justify-center text-deep_blue font-bold text-xl">
                                        {app.freelancerId}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-deep_blue dark:text-slate-50">
                                            {app.freelancerId}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                            <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                                            <span>{app.freelancerId}</span>
                                        </div>
                                    </div>
                                </div>

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
    )
}

export default JobApplications