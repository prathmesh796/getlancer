export type Job = {
    _id: string,
    title: string,
    description: string,
    company: string,
    bounty: string,
    location: string,
    skills: string[],
    status: jobStatus,
    assignedTo: string,
    applications: Array<Application>,
    createdAt: Date,
    updatedAt: Date
}

export type Application = {
    _id: string,
    jobId: string,
    jobName: string,
    freelancerId: string,
    freelancerName: string,
    freelancerEmail: string,
    freelancerProfileUrl: string,
    proposal: string,
    status: applicationStatus,
    createdAt: Date,
    updatedAt: Date
}

enum jobStatus {
    open = "open",
    assigned = "assigned",
    completed = "completed"
}

enum applicationStatus {
    pending = "pending",
    assigned = "assigned",
    hold = "hold",
    revoked = "revoked",
    rejected = "rejected"
}