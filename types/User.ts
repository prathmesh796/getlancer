export type User = {
    _id: string,
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    verificationToken: string,
    role: Role,
    createdAt: string,
    updatedAt: string,
    resetPasswordToken?: string,
    resetPasswordTokenExpiry?: Date
}

export type Role = "Client" | "Freelancer" | "Admin"

export type UserSession = {
    user: User,
    accessToken: string,
}

export type CprofileType = {
    user: string,
    companyName: string,
    website: string,
    location: string,
    bio: string,
    description: string,
    logo: profilePic,
    socialLinks: string[],
    postedJobs: User[],
    createdAt: string,
    updatedAt: string
}

export type FprofileType = {
    user: string,
    title: string,
    bio: string,
    description: string,
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
    name: string,
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