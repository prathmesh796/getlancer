"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { MdEdit, MdLocationOn, MdAttachMoney, MdWork, MdSchool } from "react-icons/md";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe, FaStar } from "react-icons/fa";

export default function Page() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/FreelancerProfile/?userId=${encodeURIComponent(session.user.id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data.freelancerProfile || {});
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });
    }
  }, [session]);

  const getSocialIcon = (platform) => {
    const iconProps = { size: 20, className: "text-white" };
    switch (platform.toLowerCase()) {
      case 'facebook': return <FaFacebook {...iconProps} />;
      case 'twitter': return <FaTwitter {...iconProps} />;
      case 'linkedin': return <FaLinkedin {...iconProps} />;
      case 'instagram': return <FaInstagram {...iconProps} />;
      case 'github': return <FaGithub {...iconProps} />;
      default: return <FaGlobe {...iconProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-deep_blue via-marine_blue to-blue dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="animate-pulse text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep_blue via-marine_blue to-blue p-1 shadow-2xl mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow via-light_yellow to-yellow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Image
                    src={profile?.profilePic?.url || "/profilepic.jpeg"}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="relative rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>

                {/* Profile Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {session?.user?.name || "Freelancer"}
                  </h1>
                  <p className="text-xl md:text-2xl mb-4">
                    {profile?.title || "Professional Freelancer"}
                  </p>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                    {profile?.location && (
                      <div className="flex items-center gap-2">
                        <MdLocationOn size={20} className="text-yellow" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile?.hourlyRate > 0 && (
                      <div className="flex items-center gap-2">
                        <MdAttachMoney size={20} className="text-yellow" />
                        <span>${profile.hourlyRate}/hr</span>
                      </div>
                    )}
                  </div>

                  {/* Top Skills Preview */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {profile.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 4 && (
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold">
                          +{profile.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Update Button */}
              <Link href="/Fprofile/updateFprofile">
                <button className="flex items-center gap-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
                  <MdEdit size={20} />
                  Update Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-1">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow via-light_yellow to-yellow"></div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
                  <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">About Me</h2>
                </div>
                <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed">
                  {profile?.bio || "I'm a passionate freelancer dedicated to delivering high-quality work. Let's collaborate on your next project!"}
                </p>
              </div>
            </div>

            {/* Experience Section */}
            {profile?.experience && profile.experience.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-1">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-deep_blue">Experience</h2>
                  </div>
                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                        <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-br from-yellow to-light_yellow rounded-full -translate-x-[9px] shadow-lg"></div>
                        <h3 className="text-xl font-bold text-deep_blue mb-1">{exp.title || "Position"}</h3>
                        <p className="text-gray-600 font-semibold mb-2">{exp.company || "Company"}</p>
                        <p className="text-sm text-gray-500 mb-3">{exp.duration || "Duration"}</p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Section */}
            {profile?.projects && profile.projects.length > 0 && (
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-1">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-deep_blue">Portfolio</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {profile.projects.map((project, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        {project.image && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={project.image}
                              alt={project.title || "Project"}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-deep_blue mb-2">{project.title || "Project"}</h3>
                          {project.description && (
                            <p className="text-gray-700 text-sm">{project.description}</p>
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
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-1">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-deep_blue">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-full text-deep_blue font-semibold text-sm hover:from-yellow hover:to-light_yellow hover:border-yellow hover:scale-110 transition-all duration-300 transform cursor-default"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {profile?.socialLinks && Object.keys(profile.socialLinks).some(key => profile.socialLinks[key]) && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
                  <h2 className="text-2xl font-bold text-deep_blue">Connect</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(profile.socialLinks).map(([platform, link]: [string, string | undefined]) => {
                    if (!link) return null;
                    return (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-deep_blue to-marine_blue p-4 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow/20 to-light_yellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex flex-col items-center gap-2">
                          <div className="transform group-hover:rotate-12 transition-transform duration-300">
                            {getSocialIcon(platform)}
                          </div>
                          <span className="text-white font-semibold text-xs capitalize">
                            {platform}
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
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <MdWork className="mb-2" size={32} />
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-1">Projects</h3>
                  <p className="text-3xl font-bold">{profile?.projects?.length || 0}</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow to-light_yellow p-6 shadow-xl">
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
