"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSaveAs } from "react-icons/md";

const socialPlatforms = ["Facebook", "Twitter", "LinkedIn", "Instagram", "Github"];

const UpdateFProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [location, setLocation] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [platform, setPlatform] = useState("Facebook");
  const [linkInput, setLinkInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProject, setNewProject] = useState({ name: "", description: "", link: "", tags: [] });
  const [projectTagsInput, setProjectTagsInput] = useState("");
  const [experience, setExperience] = useState([]);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [newExperience, setNewExperience] = useState({ role: "", company: "", startDate: "", endDate: "", description: "" });

  const [newProfile, setNewProfile] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/FreelancerProfile?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.freelancerProfile) {
            const profile = data.freelancerProfile;
            setTitle(profile.title || "");
            setSkills(profile.skills || []);
            setBio(profile.bio || "");
            setHourlyRate(profile.hourlyRate || "");
            setLocation(profile.location || "");
            setSocialLinks(profile.socialLinks || {});
            setExperience(profile.experience || []);
            setProjects(profile.projects || []);
            setProfilePic(profile.profilePic?.url || null);
          } else {
            setNewProfile(true);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Set the profile picture to the file's data URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/profile/FreelancerProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: session.user.id,
        title,
        bio,
        skills,
        hourlyRate,
        experience,
        location,
        profilePic,
        socialLinks,
        projects,
      }),
    });

    if (res.ok) {
      router.push("/Fprofile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {newProfile && (
        <p className="text-blue-600 mb-2">
          Looks like you haven’t created your freelancer profile yet. Fill in the details to get started!
        </p>
      )}
      <h1 className="text-2xl font-bold mb-4">Update Freelancer Profile</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Profile Picture</label>
        <div className="flex justify-between items-center mb-4 p-2 border rounded">
          {profilePic && (
            <Image
              width={100}
              height={100}
              src={profilePic}
              alt="Profile Picture"
              className="w-44 h-44 rounded-full object-cover border-2 border-yellow-400"
            />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className=""
          />
        </div>

        <label className="block mb-1">Title</label>
        <input type="text" placeholder="Your Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-4 p-2 border rounded" required />

        <label className="block mb-1">Bio</label>
        <textarea
          placeholder="A little about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          rows={4}
        />

        <label className="block mb-1">Skills (comma separated)</label>
        <input
          type="text"
          placeholder="React, Node, MongoDB"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(",").map(s => s.trim()))}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-1">Hourly Rate (in USD)</label>
        <input
          type="number"
          placeholder="Your hourly rate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* experience section */}
        <label htmlFor="">Experience</label>
        <div className="border p-4 rounded mb-6">
          <input
            type="text"
            placeholder="Role"
            value={newExperience.role}
            onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="month"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="month"
            placeholder="End Date"
            value={newExperience.endDate}
            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />

          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="button"
            onClick={() => {
              const experienceData = { ...newExperience };
              if (editingExperienceIndex !== null) {
                const updated = [...experience];
                updated[editingExperienceIndex] = experienceData;
                setExperience(updated);
                setEditingExperienceIndex(null);
              } else {
                setExperience([...experience, experienceData]);
              }
              setNewExperience({ role: "", company: "", startDate: "", endDate: "", description: "" });
            }}
            className="bg-yellow p-2 rounded-full"
          >
            {editingExperienceIndex !== null ? <MdOutlineSaveAs className="w-6 h-6" /> : <IoAddCircleOutline className="w-6 h-6" />}
          </button>
        </div>

        <ul className="space-y-3">
          {experience.map((exp, index) => (
            <li key={index} className="flex justify-between border p-3 rounded">
              <div className="flex flex-col justify-start">
                <div className="font-medium">{exp.role} at {exp.company}</div>
                <div className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </div>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <button
                  className="bg-light_yellow text-black px-2 py-2 rounded-full"
                  onClick={() => {
                    setNewExperience(exp);
                    setEditingExperienceIndex(index);
                  }}
                >
                  <FiEdit3 />
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-2 rounded-full"
                  onClick={() => {
                    const updated = experience.filter((_, i) => i !== index);
                    setExperience(updated);
                    if (editingExperienceIndex === index) {
                      setNewExperience({ role: "", company: "", startDate: "", endDate: "", description: "" });
                      setEditingExperienceIndex(null);
                    }
                  }}
                >
                  <MdDeleteForever />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <label className="block mb-1">Location</label>
        <input
          type="text"
          placeholder="City, Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Social Links */}
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
              {Object.entries(socialLinks).map(([key, link]: [string, string | undefined]) => (
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

        <label htmlFor="">Projects</label>
        <div className="border p-4 rounded mb-6">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="url"
            placeholder="Link"
            value={newProject.link}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={projectTagsInput}
            onChange={(e) => setProjectTagsInput(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <button
            type="button"
            onClick={() => {
              const tags = projectTagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

              if (newProject.name || newProject.description || newProject.link) {
                setProjects([...projects, { ...newProject, tags }]);
              }

              const projectsData = { ...projects };
              if (editingIndex !== null) {
                const updated = [...projects];
                updated[editingIndex] = projectsData;
                setProjects(updated);
                setEditingIndex(null);
              } else {
                setExperience([...projects, projectsData]);
              }
              setNewProject({ name: "", description: "", link: "", tags: [] });
              setProjectTagsInput("");
            }}
            className="bg-yellow p-2 rounded-full"
          >
            {editingIndex !== null ? <MdOutlineSaveAs className="w-6 h-6" /> : <IoAddCircleOutline className="w-6 h-6" />}
          </button>
        </div>

        <ul className="space-y-3">
          {projects.map((proj, index) => (
            <li key={index} className="flex justify-between border p-3 rounded m-4">
              <div className="flex flex-col justify-start ">
                <div className="font-medium">Project Name : <Link href={proj.link} target="_blank" className="underline" >{proj.name}</Link></div>


                <p className="text-sm mt-1">Project description : {proj.description}</p>

                <div>
                  Tags :

                  {proj.tags.map((tag) => (
                    <span key={tag} className="w-fit px-1 py-[1px] bg-gray-300 rounded-full box-border text-white text-center mx-1 ">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <button
                  className="bg-light_yellow text-black p-2 rounded-full"
                  onClick={() => {
                    setNewProject(proj);
                    setEditingIndex(index);
                  }}
                >
                  <FiEdit3 className="" />
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-full "
                  onClick={() => {
                    const updated = projects.filter((_, i) => i !== index);
                    setProjects(updated);
                    if (editingIndex === index) {
                      setNewProject({ name: "", description: "", link: "", tags: [] });
                      setEditingIndex(null);
                    }
                  }}
                >
                  <MdDeleteForever className="" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button type="submit" className="bg-yellow text-black font-semibold p-2 rounded w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateFProfile;