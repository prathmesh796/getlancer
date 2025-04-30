"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      fetch(`/api/FreelancerProfile?userId=${session.user.id}`)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/FreelancerProfile", {
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
      router.push("/Finterface/Fdash");
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingExperienceIndex !== null ? "Update Experience" : "Add Experience"}
          </button>
        </div>

        <ul className="space-y-3">
          {experience.map((exp, index) => (
            <li key={index} className="border p-3 rounded bg-gray-50">
              <div className="font-medium">{exp.role} at {exp.company}</div>
              <div className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate}
              </div>
              <p className="text-sm mt-1">{exp.description}</p>

              <div className="mt-2 space-x-2">
                <button
                  className="bg-yellow-400 text-black px-3 py-1 rounded text-sm"
                  onClick={() => {
                    setNewExperience(exp);
                    setEditingExperienceIndex(index);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => {
                    const updated = experience.filter((_, i) => i !== index);
                    setExperience(updated);
                    if (editingExperienceIndex === index) {
                      setNewExperience({ role: "", company: "", startDate: "", endDate: "", description: "" });
                      setEditingExperienceIndex(null);
                    }
                  }}
                >
                  Delete
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
              className="bg-blue-500 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
          {/* Show added links */}
          {Object.keys(socialLinks).length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {Object.entries(socialLinks).map(([key, link]) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {link}
                </li>
              ))}
            </ul>
          )}

          {/* Projects Section */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Projects</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="url"
                placeholder="Link"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={projectTagsInput}
                onChange={(e) => setProjectTagsInput(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const tags = projectTagsInput
                  .split(",")
                  .map(tag => tag.trim())
                  .filter(tag => tag.length > 0);

                if (newProject.name || newProject.description || newProject.link) {
                  setProjects([...projects, { ...newProject, tags }]);
                  setNewProject({ name: "", description: "", link: "", tags: [] });
                  setProjectTagsInput("");
                }
              }}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Add Project
            </button>

            {projects.length > 0 && (
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-1">
                {projects.map((proj, idx) => (
                  <li key={idx}>
                    <strong>{proj.name}</strong>: {proj.description} –{" "}
                    <a className="text-blue-600 underline" href={proj.link} target="_blank">{proj.link}</a>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="text-xs text-gray-500">Tags: {proj.tags.join(", ")}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button type="submit" className="bg-yellow text-black font-semibold p-2 rounded w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateFProfile;