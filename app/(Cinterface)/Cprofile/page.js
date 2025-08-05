"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { MdOpenInNew } from "react-icons/md";

const Cprofile = () => {
  const { data: session } = useSession();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [logo, setLogo] = useState({});
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
          const { clientProfile } = data;
          setCompanyName(clientProfile.companyName || "");
          setWebsite(clientProfile.website || "");
          setBio(clientProfile.bio || "");
          setLocation(clientProfile.location || "");
          setSocialLinks(clientProfile.socialLinks || {});
          setLogo(clientProfile.logo || {});
          setLoading(false);
        });
    }
  }, [session]);

  if(loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; 
  }

  return (
    <main className="container mx-auto p-8">
      {/* Welcome Section */}
      <section className="text-center flex justify-between items-center shadow-xl px-6 rounded-lg">
        <div className='flex flex-col justify-center items-start'>
          <h1 className="text-4xl font-bold mb-4">{companyName}</h1>
          <p className="text-lg text-gray-600">{bio}</p>
          <p className="text-md text-gray-500 mt-2">{location}</p>
          <button className="flex bg-yellow px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200" onClick={() => window.open(website, "_blank")}>Visit Website <MdOpenInNew className="ml-2" size={24}/></button>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <Image src={logo?.url || "/office-building.jpg"} alt={`${companyName} logo`} className="my-4 object-cover rounded-full" height={200} width={200} priority style={{ aspectRatio: "1 / 1" }} />
          <Link href="/Cprofile/updateCprofile" className="bg-yellow my-2 px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">Update Profile</Link>
        </div>
      </section>

      {/* Actions Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* View Profile */}
        <Link href="/Cprofile" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">View Profile</h2>
          <p className="text-gray-500">See and manage your profile details.</p>
        </Link>

        {/* Update Profile */}
        


      </section>
    </main>
  );
};

export default Cprofile;