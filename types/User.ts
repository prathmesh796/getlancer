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

export type Role = "Client" | "Freelancer" | "Admin"

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
    logo: profilePic,
    socialLinks: string[],
    postedJobs: User[]
}

export type FprofileType = {
    user: User,
    title: string,
    bio: string,
    skills: string[],
    hourlyRate: number,
    experience: experience[],
    location: string,
    profilePic: profilePic,
    socialLinks: string[]
    projects: projects[],
    Jobs: User[],
    createdAt: string,
    updatedAt: string
}


export type projects = {
    title: string,
    description: string,
    link: string,
    tags: string[]
}

export type profilePic = {
    name: string,
    url: string,
    type: string,
    key: string
}

export type experience = {
    title: string,
    company: string,
    startDate: Date,
    endDate: Date,
    description: string
}