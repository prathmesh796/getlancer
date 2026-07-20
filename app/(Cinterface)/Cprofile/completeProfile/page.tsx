"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, CprofileType } from '@/types/User';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import Banner from '@/components/Banner';
import { useRouter } from 'next/navigation';

const CompleteProfile = () => {
    const { data: session } = useSession();
    const [clientProfile, setClientProfile] = useState<CprofileType | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("userId", session.user.id);
        formData.append("companyName", clientProfile.companyName || "");
        formData.append("bio", clientProfile.bio || "")
        formData.append("description", clientProfile.description || "");
        formData.append("location", clientProfile.location || "");
        formData.append("website", clientProfile.website || "");
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
            router.replace("/Cdash");
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
                    <Label htmlFor='companyName'>Company Name</Label>
                    <Input id='companyName' type="text" placeholder='Company Name' value={clientProfile?.companyName || ""} onChange={(e) => setClientProfile({ ...clientProfile, companyName: e.target.value })} />

                    <Label htmlFor='bio'>Bio</Label>
                    <Input id='bio' type="text" placeholder='Bio' value={clientProfile?.bio || ""} onChange={(e) => setClientProfile({ ...clientProfile, bio: e.target.value })} />

                    <Label htmlFor='location'>Location</Label>
                    <Input id='location' type="text" placeholder='Location' value={clientProfile?.location || ""} onChange={(e) => setClientProfile({ ...clientProfile, location: e.target.value })} />

                    <Label htmlFor='website'>Website</Label>
                    <Input id='website' type="text" placeholder='Website' value={clientProfile?.website || ""} onChange={(e) => setClientProfile({ ...clientProfile, website: e.target.value })} />

                    <Label htmlFor='about'>About</Label>
                    <Textarea id='about' placeholder='About' value={clientProfile?.description || ""} onChange={(e) => setClientProfile({ ...clientProfile, description: e.target.value })} />

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