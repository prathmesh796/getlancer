"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";
import type { CprofileType } from "@/types/User";

const socialPlatforms = ["Facebook", "Twitter", "LinkedIn", "Instagram", "Github"];

const UpdateCProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [clientProfile, setClientProfile] = useState<CprofileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState(socialPlatforms[0]);
  const [linkInput, setLinkInput] = useState("");
  //66f642599ae31b037ff0765d

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
          if (data.clientProfile) {
            setClientProfile(data.clientProfile);
          }
          setLoading(false);
        });
    }
  }, [session]);

  const handleSocialAdd = () => {
    if (linkInput.trim() !== "" && clientProfile) {
      setClientProfile({
        ...clientProfile,
        socialLinks: [
          ...(clientProfile.socialLinks || []),
          { platform, link: linkInput.trim() }
        ]
      });
      setLinkInput("");
      setPlatform(socialPlatforms[0]);
    }
  };

  const handleSocialDelete = (index: number) => {
    if (clientProfile) {
      const updatedLinks = [...(clientProfile.socialLinks || [])];
      updatedLinks.splice(index, 1);
      setClientProfile({
        ...clientProfile,
        socialLinks: updatedLinks
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientProfile || !session?.user?.id) return;

    const formData = new FormData();
    formData.append("userId", session.user.id);
    formData.append("companyName", clientProfile.companyName || "");
    formData.append("website", clientProfile.website || "");
    formData.append("bio", clientProfile.bio || "");
    formData.append("description", clientProfile.description || "");
    formData.append("location", clientProfile.location || "");
    formData.append("socialLinks", JSON.stringify(clientProfile.socialLinks || []));
    
    if (clientProfile.logo) {
      const logo: any = clientProfile.logo;
      if (typeof window !== "undefined" && logo instanceof File) {
        formData.append("logo", logo);
      } else {
        formData.append("logo", JSON.stringify(logo));
      }
    }

    const res = await fetch("/api/profile/ClientProfile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/Cprofile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!clientProfile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Client Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Company Name"
          value={clientProfile.companyName}
          onChange={(e) => setClientProfile({ ...clientProfile, companyName: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Website"
          value={clientProfile.website}
          onChange={(e) => setClientProfile({ ...clientProfile, website: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={clientProfile.location}
          onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Bio"
          value={clientProfile.bio}
          onChange={(e) => setClientProfile({ ...clientProfile, bio: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={clientProfile.description}
          onChange={(e) => setClientProfile({ ...clientProfile, description: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        

        {/* Social links */}
        <div className="mb-4">
          <label className="block mb-2">Social Links</label>
          <div className="flex gap-2 mb-2">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="border p-2 rounded"
            >
              {socialPlatforms.map((plat, idx) => (
                <option key={idx} value={plat}>{plat}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Enter URL"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={handleSocialAdd}
              className="bg-yellow px-3 rounded"
            >
              Add
            </button>
          </div>
          {/* Show added links */}
          {clientProfile.socialLinks && clientProfile.socialLinks.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {clientProfile.socialLinks.map((link, idx) => (
                <li key={idx} className="flex justify-between" >
                  <div>
                    <strong>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}:</strong> {link.link}
                  </div>
                  <button type="button" onClick={() => handleSocialDelete(idx)} aria-label={`Delete ${link.platform} link`}>
                    <MdDeleteForever className="w-6 h-6" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setClientProfile({ ...clientProfile, logo: (e.target.files?.[0] as any) || null })}
          className="w-full mb-4 p-2 border rounded"
        />

        {clientProfile.logo?.url && (
          <div className="flex justify-center mb-4">
            <Image
              src={clientProfile.logo.url}
              alt="Company Logo"
              className="rounded-full object-cover border"
              height={24}
              width={24}
            />
          </div>
        )}

        <button
          className="bg-yellow text-black font-semibold p-2 rounded w-full"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateCProfile;