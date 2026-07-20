"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, FprofileType } from '@/types/User';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { useRouter } from 'next/navigation';
import Banner from '@/components/Banner';

const CompleteProfile = () => {
  const { data: session } = useSession();
  const [FreelancerProfile, setFreelancerProfile] = useState<FprofileType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", session.user.id);
    formData.append("title", FreelancerProfile.title || "");
    formData.append("bio", FreelancerProfile.bio || "");
    formData.append("description", FreelancerProfile.description || "");
    formData.append("location", FreelancerProfile.location || "");
    formData.append("hourlyRate", FreelancerProfile.hourlyRate?.toString() || "0");
    if (image) {
      formData.append("logo", image);
    }

    const response = await fetch("/api/profile/ClientProfile", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Profile updated successfully");
      router.replace("/Fdash");
    } else {
      toast.error(data.message || "Failed to update profile");
    }
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("No file selected")
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file)); // Create preview URL
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className='bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
      <Banner />
      <div className='flex justify-center'>
        <FieldGroup className='w-full max-w-md m-5 border shadow-lg p-6 rounded-xl'>
          <h1 className='text-center text-2xl font-bold mb-4'>Complete Your Profile</h1>
          <Field>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' type="text" placeholder='Title' value={FreelancerProfile?.title || ""} onChange={(e) => setFreelancerProfile({ ...FreelancerProfile, title: e.target.value } as FprofileType)} />

            <Label htmlFor='bio'>Bio</Label>
            <Input id='bio' type="text" placeholder='Bio' value={FreelancerProfile?.bio || ""} onChange={(e) => setFreelancerProfile({ ...FreelancerProfile, bio: e.target.value } as FprofileType)} />

            <Label htmlFor='location'>Location</Label>
            <Input id='location' type="text" placeholder='Location' value={FreelancerProfile?.location || ""} onChange={(e) => setFreelancerProfile({ ...FreelancerProfile, location: e.target.value } as FprofileType)} />

            <Label htmlFor='rate'>Hourly rate</Label>
            <Input id='rate' type="number" placeholder='Hourly Rate' value={FreelancerProfile?.hourlyRate || ""} onChange={(e) => setFreelancerProfile({ ...FreelancerProfile, hourlyRate: Number(e.target.value) } as FprofileType)} />

            <Label htmlFor='about'>About</Label>
            <Textarea id='about' placeholder='About' value={FreelancerProfile?.description || ""} onChange={(e) => setFreelancerProfile({ ...FreelancerProfile, description: e.target.value } as FprofileType)} />

            <Label htmlFor="logo">Profile Picture</Label>
            <Input id="logo" name="logo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)} />
            {preview && (
              <img
                src={preview || undefined}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}

            <Button type="button" onClick={handleSubmit}>Complete Profile</Button>
          </Field>
        </FieldGroup>
      </div>
    </div>
  )
}

export default CompleteProfile