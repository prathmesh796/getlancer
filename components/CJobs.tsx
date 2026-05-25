import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faDollarSign, faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons'
import type { Job } from '@/types/Jobs'

const CJobs = ({ jobid, job }: { jobid: string, job: Job }) => {
    const applicationCount = job.applications?.length || 0;

    return (
        <div className='bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 w-full' key={jobid}>
            <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                        <h2 className='text-2xl font-bold text-deep_blue dark:text-slate-50'>{job.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.status === 'open'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : job.status === 'assigned'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                    </div>

                    <p className='text-gray-600 dark:text-slate-400 mb-4 line-clamp-2'>{job.description}</p>

                    <div className='flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-400 mb-4'>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className='w-4 h-4' />
                            <span>{job.location}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faDollarSign} className='w-4 h-4' />
                            <span className='font-semibold text-green-600 dark:text-green-400'>
                                ${job.bounty?.toLocaleString()}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCalendar} className='w-4 h-4' />
                            <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {job.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className='px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium'
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700'>
                <div className='flex items-center gap-2 text-gray-600 dark:text-slate-400'>
                    <FontAwesomeIcon icon={faUsers} className='w-5 h-5' />
                    <span className='font-semibold'>
                        {applicationCount} {applicationCount === 1 ? 'Application' : 'Applications'}
                    </span>
                </div>

                <Link href={`/JobApplications/${job._id}`}>
                    <button className='px-6 py-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'>
                        View Applications
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default CJobs

