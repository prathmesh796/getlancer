"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";
import { Spinner } from "@/components/ui/spinner";
import type { FprofileType } from "@/types/User";

const socialPlatforms = ["Twitter", "LinkedIn", "Github"];

const UpdateFProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [fprofile, setFprofile] = useState<FprofileType | null>(null);
  const [newProfile, setNewProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  
  

  // Form fields
  const [title, setTitle] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  
  const [location, setLocation] = useState<string>("");
  const [platform, setPlatform] = useState<string>(socialPlatforms[0]);
  const [linkInput, setLinkInput] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/FreelancerProfile?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.freelancerProfile) {
            const profile = data.freelancerProfile;
            setFprofile(profile);
          } else {
            setNewProfile(true);
          }
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session]);

  // Populate local form fields when profile is loaded
  useEffect(() => {
    if (fprofile) {
      setTitle(fprofile.title || "");
      setBio(fprofile.bio || "");
      setSkills(fprofile.skills || []);
      setLocation(fprofile.location || "");
      setProfilePic((fprofile.profilePic && (fprofile.profilePic.url || fprofile.profilePic)) || null);
    }
  }, [fprofile]);

  const handleSocialDelete = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set the profile picture to the file's data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let fprofileData: FprofileType | null = null;

    if (newProfile) {

      fprofileData = {
        ...(fprofile || {}),
        title,
        bio,
        skills,
        location,
        profilePic: profilePic as any,
        socialLinks,
      } as FprofileType;
    } else {

      fprofileData = {
        ...fprofile,
        title,
        bio,
        skills,
        socialLinks,
        location,
        profilePic: profilePic as any,
      } as FprofileType;
    }

    const res = await fetch("/api/profile/FreelancerProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fprofileData
      }),
    });

    if (res.ok) {
      router.push("/Fprofile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/95 dark:bg-slate-900/90 rounded-2xl shadow-lg mt-10 mb-10">
      {newProfile && (
        <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-500 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <span className="text-blue-700 dark:text-blue-200 font-bold text-lg">👋</span>
          <span className="text-blue-700 dark:text-blue-200">
            Looks like you haven’t created your freelancer profile yet. Fill in the details to get started!
          </span>
        </div>
      )}

      <h1 className="text-3xl font-extrabold mb-8 tracking-tight bg-linear-to-r from-yellow via-orange-300 to-marine_blue bg-clip-text text-transparent">
        Update Freelancer Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-lg font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-yellow-200 dark:border-yellow-500">
            <div>
              {profilePic ? (
                <Image
                  width={100}
                  height={100}
                  src={profilePic}
                  alt="Profile Picture"
                  className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300 bg-gray-100 dark:bg-slate-800 text-gray-400">
                  <span className="text-5xl">👤</span>
                </div>
              )}
            </div>
            <label className="inline-block">
              <input
                type="file"
                onChange={handleFileChange}
                className="block text-sm text-gray-500 dark:text-gray-300"
                accept="image/*"
              />
              <span className="ml-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 cursor-pointer hover:underline">Change</span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-lg font-medium mb-2">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g. Full Stack Web Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-lg font-medium mb-2">Bio</label>
          <textarea
            placeholder="A little about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition"
            rows={4}
          />
        </div>

        {/* Skills */}
        

        {/* Experience */}
        

        {/* Location */}
        <div>
          <label className="block text-lg font-medium mb-2">Location</label>
          <input
            type="text"
            placeholder="City, Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>
        
        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-linear-to-r from-yellow-400 via-yellow-300 to-orange-300 hover:from-yellow-500 hover:to-orange-400 text-black font-bold py-3 rounded-xl mt-6 shadow-lg transition text-lg"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateFProfile;