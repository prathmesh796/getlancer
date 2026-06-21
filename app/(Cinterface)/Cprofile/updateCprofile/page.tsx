"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";
import type { CprofileType } from "@/types/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const textareaClassName = cn(
  "mb-4 flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
);

const socialPlatforms = ["Facebook", "Twitter", "LinkedIn", "Instagram", "Github"];

const UpdateCProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [clientProfile, setClientProfile] = useState<CprofileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState(socialPlatforms[0]);
  const [linkInput, setLinkInput] = useState("");

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
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });
    }
  }, [session]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <Spinner className="size-10" />
      </div>
    );
  }
  if (!clientProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-deep_blue via-marine_blue to-blue dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
        <p className="text-center mt-10">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Client Profile</CardTitle>
        </CardHeader>
        <CardContent>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Input
          type="text"
          placeholder="Company Name"
          value={clientProfile.companyName}
          onChange={(e) => setClientProfile({ ...clientProfile, companyName: e.target.value })}
          className="mb-4"
        />
        <Input
          type="text"
          placeholder="Website"
          value={clientProfile.website}
          onChange={(e) => setClientProfile({ ...clientProfile, website: e.target.value })}
          className="mb-4"
        />
        <Input
          type="text"
          placeholder="Location"
          value={clientProfile.location}
          onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })}
          className="mb-4"
        />
        <textarea
          placeholder="Bio"
          value={clientProfile.bio}
          onChange={(e) => setClientProfile({ ...clientProfile, bio: e.target.value })}
          className={textareaClassName}
        />

        <textarea
          placeholder="Description"
          value={clientProfile.description}
          onChange={(e) => setClientProfile({ ...clientProfile, description: e.target.value })}
          className={textareaClassName}
        />
        


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

        <Button
          className="mt-4 w-full bg-yellow font-semibold text-black hover:bg-light_yellow"
          type="submit"
        >
          Save
        </Button>
      </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCProfile;