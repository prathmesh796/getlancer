import { Job } from '@/types/Jobs'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faDollarSign, faCalendar, faBuilding, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const JobDesc = ({ job }: { job: Job | null }) => {
  if (!job) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card className="shadow-lg border-none rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-deep_blue dark:text-slate-50">
                            <FontAwesomeIcon icon={faInfoCircle} className="text-yellow w-6 h-6" />
                            Job Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </CardContent>
                </Card>

                {job.skills && job.skills.length > 0 && (
                    <Card className="shadow-lg border-none rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-deep_blue dark:text-slate-50">
                                Required Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:from-slate-700 dark:to-slate-600 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-slate-500"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
                <Card className="shadow-lg border-none rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-deep_blue dark:text-slate-50">
                            Job Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                            <div className="bg-blue-100 dark:bg-slate-700 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                <FontAwesomeIcon icon={faBuilding} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Company</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{job.company || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Bounty</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">${Number(job.bounty).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{job.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                                <FontAwesomeIcon icon={faCalendar} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Posted On</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{new Date(job.datePosted).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-700">
                             <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-500">Status</span>
                                <span className={`rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${job.status === 'open'
                                        ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800'
                                        : job.status === 'assigned'
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                    }`}>
                                    {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : "Unknown"}
                                </span>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}

export default JobDesc