import React from 'react'
import Image from 'next/image';
import { MdLocationOn, MdAttachMoney, MdWork } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { User, FprofileType } from '@/types/User';
import { getSocialIcon, getSocialName } from '@/lib/socialUtils';

const Fprofile = ({ freelancerProfile, user }: { freelancerProfile: FprofileType, user: User }) => {

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Profile Header */}
                <div className="relative overflow-hidden rounded-3xl p-1 shadow-2xl mb-8">
                    <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Picture */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-linear-to-r from-yellow via-light_yellow to-yellow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <Image
                                    src={freelancerProfile?.profilePic?.url || "/profilepic.jpeg"}
                                    alt="Profile"
                                    width={160}
                                    height={160}
                                    className="relative rounded-full object-cover border-4 border-white shadow-xl"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                    {user?.name || "Freelancer"}
                                </h1>
                                <p className="text-xl md:text-2xl mb-4">
                                    {freelancerProfile?.title || "Professional Freelancer"}
                                </p>

                                {/* Quick Info */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                                    {freelancerProfile?.location && (
                                        <div className="flex items-center gap-2">
                                            <MdLocationOn size={20} className="text-yellow" />
                                            <span>{freelancerProfile.location}</span>
                                        </div>
                                    )}
                                    {freelancerProfile?.hourlyRate > 0 && (
                                        <div className="flex items-center gap-2">
                                            <MdAttachMoney size={20} className="text-yellow" />
                                            <span>${freelancerProfile.hourlyRate}/hr</span>
                                        </div>
                                    )}
                                </div>

                                {/* Top Skills Preview */}
                                {freelancerProfile?.skills && freelancerProfile.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {freelancerProfile.skills.slice(0, 4).map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold text-white"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {freelancerProfile.skills.length > 4 && (
                                            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold">
                                                +{freelancerProfile.skills.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="relative overflow-hidden rounded-3xl dark:bg-slate-800 shadow-xl p-1">
                            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-yellow via-light_yellow to-yellow"></div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">About</h2>
                                </div>
                                <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">
                                    {freelancerProfile?.bio || "This freelancer hasn't added a bio yet."}
                                </p>
                            </div>
                        </div>

                        {/* Experience Section */}
                        {freelancerProfile?.experience && freelancerProfile.experience.length > 0 && (
                            <div className="relative overflow-hidden rounded-3xl dark:bg-slate-800 shadow-xl p-1">
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                                        <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Experience</h2>
                                    </div>
                                    <div className="space-y-6">
                                        {freelancerProfile.experience.map((exp, index) => (
                                            <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-slate-700 last:border-l-0 last:pb-0">
                                                <div className="absolute left-0 top-0 w-4 h-4 bg-linear-to-br from-yellow to-light_yellow rounded-full translate-x-[-9px] shadow-lg"></div>
                                                <h3 className="text-xl font-bold text-deep_blue dark:text-slate-50 mb-1">{exp.title || "Position"}</h3>
                                                <p className="text-gray-600 dark:text-slate-400 font-semibold mb-2">{exp.company || "Company"}</p>
                                                {exp.description && (
                                                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Portfolio Section */}
                        {freelancerProfile?.projects && freelancerProfile.projects.length > 0 && (
                            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-1">
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 via-pink-500 to-red-500"></div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                        <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Portfolio</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {freelancerProfile.projects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                            >
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-deep_blue dark:text-slate-50 mb-2">{project.name || "Project"}</h3>
                                                    {project.description && (
                                                        <p className="text-gray-700 dark:text-slate-300 text-sm">{project.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Skills Section */}
                        <div className="relative overflow-hidden rounded-3xl dark:bg-slate-800 shadow-xl p-1">
                            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-linear-to-b from-green-500 to-emerald-500 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-deep_blue dark:text-slate-50">Skills</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {freelancerProfile?.skills && freelancerProfile.skills.length > 0 ? (
                                        freelancerProfile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-linear-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border-2 border-gray-300 dark:border-slate-500 rounded-full text-deep_blue dark:text-slate-50 font-semibold text-sm hover:from-yellow hover:to-light_yellow hover:border-yellow hover:scale-110 transition-all duration-300 transform cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-slate-400 text-sm">No skills listed</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        {freelancerProfile?.socialLinks && Object.keys(freelancerProfile.socialLinks).some(key => freelancerProfile.socialLinks[key]) && (
                            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-deep_blue dark:text-slate-50">Connect</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {freelancerProfile.socialLinks.map((link: string) => {
                                        if (!link) return null;
                                        return (
                                            <a
                                                key={link}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative overflow-hidden rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                                            >
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative flex items-center gap-2">
                                                    <div className="transform group-hover:rotate-12 transition-transform duration-300">
                                                        {getSocialIcon(link)}
                                                    </div>
                                                    <span className="font-semibold text-xs capitalize">
                                                        {getSocialName(link)}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stats Card */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-6 shadow-xl text-white">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                                <div className="relative">
                                    <MdWork className="mb-2" size={32} />
                                    <h3 className="text-xs font-semibold uppercase tracking-wide mb-1">Projects</h3>
                                    <p className="text-3xl font-bold">{freelancerProfile?.projects?.length || 0}</p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-yellow to-light_yellow p-6 shadow-xl">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                                <div className="relative">
                                    <FaStar className="text-deep_blue/80 mb-2" size={32} />
                                    <h3 className="text-deep_blue/80 text-xs font-semibold uppercase tracking-wide mb-1">Rating</h3>
                                    <p className="text-deep_blue text-3xl font-bold">5.0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fprofile