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
  const [description, setDescription] = useState("");
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
          setDescription(clientProfile.description || "");
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
          <div className="flex space-x-4 mt-4">
            <button className="flex bg-yellow my-2 px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200" onClick={() => window.open(website, "_blank")}>Visit Website <MdOpenInNew className="ml-2" size={24}/></button>
            <Link href="/Cprofile/updateCprofile" className="bg-yellow my-2 px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">Update Profile</Link>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <Image src={logo?.url || "/office-building.jpg"} alt={`${companyName} logo`} className="my-4 object-cover rounded-full" height={200} width={200} priority style={{ aspectRatio: "1 / 1" }} />
          
        </div>
      </section>

      <section className="text-center flex justify-between items-center shadow-xl px-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{description}</p>
      </section>

      <section className="text-center flex justify-between items-center shadow-xl px-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
        <div className="flex flex-col space-y-2">
          {Object.entries(socialLinks).map(([platform, link]) => (
            <Link key={platform} href={link} className="text-blue-500 hover:underline">
              {platform}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Cprofile;