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
    applications: Array<Application>,
}

export type Application = {
    _id: string,
    jobId: string,
    freelancerId: string,
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
    accepted = "accepted",
    rejected = "rejected"
}