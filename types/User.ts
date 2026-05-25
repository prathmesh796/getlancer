export type User = {
    _id: string,
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    role: Role,
    createdAt: string,
    updatedAt: string,
    resetPasswordToken?: string,
    resetPasswordExpiry?: string
}

export type Role = "client" | "freelancer" | "admin"

export type UserSession = {
    user: User,
    accessToken: string,
}

export type CprofileType = {
    user: User,
    companyName: string,
    website: string,
    location: string,
    bio: string,
    description: string,
    createdAt: string,
    updatedAt: string,
    logo: {
        name: string,
        url: string,
        type: string,
        key: string
    },
    socialLinks: {
        platform: string,
        link: string
    }[],
    postedJobs: User[
    ]
}

export type FprofileType = {
    user: User,
    title: string,
    bio: string,
    skills: string[],
    hourlyRate: number,
    experience: object[],
    location: string,
    profilePic: {
        name: string,
        url: string,
        type: string,
        key: string
    },
    socialLinks: {
        platform: string,
        link: string
    }[]
    projects: object[],
    Jobs: User[],
    createdAt: string,
    updatedAt: string
}
