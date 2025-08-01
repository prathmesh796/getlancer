"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UpdateCProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/ClientProfile/`, {
        method: "GET",
        data: { userId: session.user.id },
      })
        .then(res => res.json())
        .then(data => {
          setCompanyName(data.companyName || "");
          setWebsite(data.website || "");
          setBio(data.bio || "");
          setLocation(data.location || "");
          setSocialLinks(data.socialLinks || {});
          setLoading(false);
        });
    }
  }, [session]);

  const handleSocialChange = (field, value) => {
    setSocialLinks(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("website", website);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("socialLinks", JSON.stringify(socialLinks));
    if (logo) {
      formData.append("logo", logo);
    }

    const res = await fetch("/api/profile/ClientProfile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      router.push("/Cinterface/Cdash");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Client Profile</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Social links */}
        {["facebook", "twitter", "linkedin", "instagram", "github"].map((platform) => (
          <input
            key={platform}
            type="text"
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
            value={socialLinks[platform]}
            onChange={(e) => handleSocialChange(platform, e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
        ))}

        {/* Logo Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="w-full mb-4 p-2 border rounded"
        />

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