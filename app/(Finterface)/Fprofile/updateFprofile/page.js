"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UpdateFProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/freelancer/profile/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title || "");
          setSkills(data.skills || []);
          setBio(data.bio || "");
          setLoading(false);
        });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/freelancer/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, skills, bio }),
    });

    if (res.ok) {
      router.push("/Finterface/Fdash");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Freelancer Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={skills.join(", ")}
          onChange={(e) => setSkills(e.target.value.split(",").map(s => s.trim()))}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button className="bg-yellow text-black font-semibold p-2 rounded w-full" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateFProfile;