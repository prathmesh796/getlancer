import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faDollarSign, faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { Job } from '@/types/Jobs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const CJobs = ({ jobid, job }: { jobid: string, job: Job }) => {
    const applicationCount = job.applications?.length || 0;

    return (
        <Card className="w-full rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-xl" key={jobid}>
            <CardHeader className="p-0">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <CardTitle className="text-2xl text-deep_blue dark:text-slate-50">{job.title}</CardTitle>
                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${job.status === 'open'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : job.status === 'assigned'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                }`}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                        </div>

                        <p className="mb-4 line-clamp-2 text-muted-foreground">{job.description}</p>

                        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4" />
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    ${job.bounty?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                                <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardFooter className="flex items-center justify-between border-t p-0 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                    <span className="font-semibold">
                        {applicationCount} {applicationCount === 1 ? 'Application' : 'Applications'}
                    </span>
                </div>

                <Button
                    asChild
                    className="rounded-full bg-linear-to-r from-yellow to-light_yellow font-semibold text-deep_blue hover:scale-105 hover:shadow-lg"
                >
                    <Link href={`/JobApplications/${job._id}`}>
                        View Applications
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CJobs
