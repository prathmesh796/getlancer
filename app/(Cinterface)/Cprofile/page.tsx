"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { MdOpenInNew, MdLocationOn } from "react-icons/md";
import type { User, CprofileType } from "@/types/User";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button"
import { AboutDialog } from "@/components/profile/about";
import { SocialDialog } from "@/components/profile/social";
import { getSocialIcon, getSocialName } from "@/lib/socialUtils";
import { CHeroDialog } from "@/components/profile/Chero";

const Cprofile = () => {
  const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null)
  const [clientProfile, setClientProfile] = useState<CprofileType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true)
      fetch(`/api/profile/ClientProfile/?userId=${encodeURIComponent(session.user.id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          const user: User = data.user
          const clientProfile: CprofileType = data.profile;

          setUser(user)
          setClientProfile(clientProfile);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.user?.id]);

  const handleVerification = async () => {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user?.id ?? user._id }),
    });

    if (response.ok) {
      toast("Verification link has been sent to your email.")
      setLoading(false)
    } else {
      const data = await response.json();
      toast(data.message || "Something went wrong.");
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar userId={session?.user?.id} />
      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <Navbar activeTab={"Profile"} />
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          {/* Hero Section with Company Header */}
          <section className="relative overflow-hidden rounded-3xl p-1 shadow-xl transform hover:scale-[1.01] transition-all duration-300">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12">
              {/* Company Info */}
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                <div className="flex justify-between items-center gap-10">
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
                  <div className='flex-col justify-center items-center md:items-start text-center md:text-left'>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text bg-linear-to-r from-white to-gray-200">
                      {session?.user?.name}
                    </h1>
                    <p className="text-lg font-light text-gray-800 md:text-xl mb-4">
                      {clientProfile?.companyName}
                    </p>
                    <div className="flex flex-col md:flex-row gap-10">
                      <p className="text-md md:text-lg mb-3 max-w-2xl text-gray-400 leading-relaxed">
                        {clientProfile?.bio}
                      </p>
                      {clientProfile?.location && (
                        <div className="flex items-center gap-2 mb-3">
                          <MdLocationOn size={20} className="text-yellow" />
                          <span className="text-md">{clientProfile?.location}</span>
                        </div>
                      )}
                    </div>


                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {clientProfile?.website && (
                        <button
                          className="flex items-center gap-2 bg-linear-to-r from-yellow to-light_yellow text-deep_blue px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-101 transition-all duration-300 transform"
                          onClick={() => window.open(clientProfile.website, "_blank")}
                        >
                          Visit Website
                          <MdOpenInNew size={20} />
                        </button>
                      )}

                      {user && user.isVerified == false && (
                        <Button className="items-center bg-gray-600 backdrop-blur-sm px-8 py-6 rounded-full font-semibold hover:scale-105 transition-all duration-300 transform" onClick={handleVerification}>
                          Verify Email
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <CHeroDialog userId={session.user.id} hero={{ name: session.user.name, companyName: clientProfile?.companyName, bio: clientProfile?.bio, location: clientProfile?.location, website: clientProfile?.website, logo: clientProfile?.logo as any }} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description Section */}
              <section className="relative overflow-hidden rounded-3xl bg-white/5 shadow-xl p-1 transform hover:scale-[1.01] transition-all duration-300">
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                    <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">About the Company</h2>
                    <AboutDialog userId={user?._id} userRole="Client" about={clientProfile?.description} />
                  </div>
                  <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {clientProfile?.description || "No description provided yet."}
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* Social Links Section */}
              <section className="relative overflow-hidden rounded-3xl bg-white/5 shadow-xl p-8 md:p-10 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
                  <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Socials</h2>
                  <SocialDialog userId={user?._id} userRole='Client' socialData={clientProfile?.socialLinks || []} />
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
              <p className="text-3xl font-bold">{user?.createdAt || "N/A"}</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-yellow to-light_yellow p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Posted Jobs</h3>
              <p className="text-deep_blue text-3xl font-bold">{clientProfile?.postedJobs?.length || 0}</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-2">Total Hires</h3>
              <p className="text-white text-3xl font-bold">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cprofile;