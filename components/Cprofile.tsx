import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGlobe } from "react-icons/fa";
import { MdLocationOn, MdOpenInNew } from "react-icons/md";
import { getSocialIcon, getSocialName } from "@/lib/socialUtils";
import { CprofileType } from '@/types/User';

const Cprofile = ({ clientProfile }: { clientProfile: CprofileType }) => {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            {/* Hero Section with Company Header */}
            <section className="relative overflow-hidden rounded-3xl p-1 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        {/* Company Info */}
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 flex-1'>
                            {/* Logo */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-linear-to-r from-yellow via-light_yellow to-yellow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <Image
                                    src={clientProfile?.logo?.url || "/office-building.jpg"}
                                    alt={`${clientProfile?.companyName} logo`}
                                    className="relative object-cover rounded-full border-4 border-white shadow-xl"
                                    height={180}
                                    width={180}
                                    priority
                                    style={{ aspectRatio: "1 / 1" }}
                                />
                            </div>

                            {/* Company Details */}
                            <div className='flex flex-col justify-center items-center md:items-start text-center md:text-left'>
                                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text bg-linear-to-r from-white to-gray-200">
                                    {clientProfile?.companyName}
                                </h1>
                                <p className="text-lg md:text-xl mb-3 max-w-2xl leading-relaxed">
                                    {clientProfile?.bio}
                                </p>
                                {clientProfile?.location && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <MdLocationOn size={20} className="text-yellow" />
                                        <span className="text-md">{clientProfile?.location}</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {clientProfile?.website && (
                                        <button
                                            className="flex items-center gap-2 bg-linear-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                                            onClick={() => window.open(clientProfile.website, "_blank")}
                                        >
                                            <FaGlobe size={20} />
                                            Visit Website
                                            <MdOpenInNew size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Description Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-1 transform hover:scale-[1.01] transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-yellow via-light_yellow to-yellow"></div>
                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                                <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">About the Company</h2>
                            </div>
                            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {clientProfile?.description || "No description provided yet."}
                            </p>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Social Links Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-xl p-8 md:p-10 transform hover:scale-[1.01] transition-all duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                            <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Connect With Us</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {clientProfile?.socialLinks.length > 0 && clientProfile?.socialLinks.map((link) => {
                                return (
                                    <Link
                                        key={link}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center h-fit"
                                    >
                                        <div className="flex gap-2 items-center w-fit">
                                            <div className="transform group-hover:rotate-12 transition-transform duration-300">
                                                {getSocialIcon(link)}
                                            </div>
                                            <span className="font-semibold text-xs capitalize">
                                                {getSocialName(link)}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            {/* Stats/Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Member Since</h3>
                    <p className="text-3xl font-bold">2024</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-yellow to-light_yellow p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Active Jobs</h3>
                    <p className="text-deep_blue text-3xl font-bold">0</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">Total Hires</h3>
                    <p className="text-white text-3xl font-bold">0</p>
                </div>
            </div>
        </div>
    )
}

export default Cprofile