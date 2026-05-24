"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";


const socialPlatforms = ["Facebook", "Twitter", "LinkedIn", "Instagram", "Github"];

const UpdateCProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [platform, setPlatform] = useState("Facebook");
  const [linkInput, setLinkInput] = useState("");
  const [logo, setLogo] = useState({});
  const [loading, setLoading] = useState(true);
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

  const handleSocialAdd = () => {
    if (linkInput.trim() !== "") {
      setSocialLinks(prev => ({
        ...prev,
        [platform.toLowerCase()]: linkInput.trim()
      }));
      setLinkInput("");
    }
  };

  const handleSocialDelete = (key) => {
    // Create new object excluding the deleted key
    const updatedLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(([k]) => k !== key)
    );
    setSocialLinks(updatedLinks);
    if (editingIndex === key) {
      setNewProject({ name: "", description: "", link: "", tags: [] });
      setEditingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", session.user.id);
    formData.append("companyName", companyName);
    formData.append("website", website);
    formData.append("bio", bio);
    formData.append("description", description);
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
      router.push("/Cprofile");
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

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {Object.keys(socialLinks).length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {Object.entries(socialLinks).map(([key, link]) => (
                <li key={key} className="flex justify-between" >
                  <div>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {link}
                  </div>
                  <button onClick={() => handleSocialDelete(key)} aria-label={`Delete ${key} link`}>
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
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="w-full mb-4 p-2 border rounded"
        />

        {logo?.url && (
          <div className="flex justify-center mb-4">
            <Image
              src={logo.url}
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