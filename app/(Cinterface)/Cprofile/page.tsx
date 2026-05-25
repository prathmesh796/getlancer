"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { MdOpenInNew, MdLocationOn, MdEdit } from "react-icons/md";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe } from "react-icons/fa";
import type { CprofileType } from "@/types/User";

const Cprofile = () => {
  const { data: session } = useSession();

  const [clientProfile, setClientProfile] = useState<CprofileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/ClientProfile/?userId=${encodeURIComponent(session.user.id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          const clientProfile: CprofileType = data.clientProfile;
          setClientProfile(clientProfile);
          setLoading(false);
        });
    }
  }, [session]);

  const getSocialIcon = (platform: string) => {
    const iconProps = { size: 24, className: "text-white" };
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section with Company Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep_blue via-marine_blue to-blue p-1 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Company Info */}
              <div className='flex flex-col md:flex-row items-center md:items-start gap-8 flex-1'>
                {/* Logo */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow via-light_yellow to-yellow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Image
                    src={clientProfile.logo?.url || "/office-building.jpg"}
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
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text bg-gradient-to-r from-white to-gray-200">
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
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                        onClick={() => window.open(clientProfile.website, "_blank")}
                      >
                        <FaGlobe size={20} />
                        Visit Website
                        <MdOpenInNew size={20} />
                      </button>
                    )}
                    <Link
                      href="/Cprofile/updateCprofile"
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-3 rounded-full font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 transform"
                    >
                      <MdEdit size={20} />
                      Update Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-1 transform hover:scale-[1.01] transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow via-light_yellow to-yellow"></div>
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
              <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">About the Company</h2>
            </div>
            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
              {clientProfile?.description || "No description provided yet."}
            </p>
          </div>
        </section>

        {/* Social Links Section */}
        {Object.keys(clientProfile?.socialLinks || {}).length > 0 && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-xl p-8 md:p-10 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
              <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Connect With Us</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(clientProfile.socialLinks || {}).map(([platform, link]: [string, any]) => {
                if (!link) return null;
                return (
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-deep_blue to-marine_blue p-6 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow/20 to-light_yellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center gap-3">
                      <div className="transform group-hover:rotate-12 transition-transform duration-300">
                        {getSocialIcon(platform)}
                      </div>
                      <span className="text-white font-semibold text-sm capitalize">
                        {platform}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Stats/Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Member Since</h3>
            <p className="text-3xl font-bold">2024</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow to-light_yellow p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Active Jobs</h3>
            <p className="text-deep_blue text-3xl font-bold">0</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">Total Hires</h3>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cprofile;