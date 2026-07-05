export type Job = {
    _id: string,
    title: string,
    description: string,
    company: string,
    bounty: string,
    location: string,
    datePosted: Date,
    skills: string[],
    status: jobStatus,
    assignedTo: string,
    applications: Array<Application>,
}

export type Application = {
    _id: string,
    jobId: string,
    freelancerId: string,
    freelancerName: string,
    freelancerEmail: string,
    freelancerProfileUrl: string,
    proposal: string,
    status: applicationStatus
    appliedAt: Date,
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