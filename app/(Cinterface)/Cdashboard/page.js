import React from 'react'

export default function page() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6">FreelanceHub</h2>
                <nav className="space-y-2">

                    <div className='h-5 w-5'>
                        href="#"
                        className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
                        <span>Dashboard</span>
                    </div>

                    <div className='h-5 w-5'>
                        href="#"
                        className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg"
                        <span>Messages</span>
                    </div>

                    <div className="h-5 w-5">
                        href="#"
                        className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg"
                        {/* <Calendar className="h-5 w-5" /> */}
                        <span>Schedule</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <form className="relative">
                                <Search className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
                                <Input type="search" placeholder="Search..." className="pl-9 pr-4" />
                            </form>
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">John Doe</p>
                                            <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        <span>Messages</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Schedule</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Overview Section */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">7</div>
                                <p className="text-xs text-muted-foreground">3 pending approval</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">54</div>
                                <p className="text-xs text-muted-foreground">+19% from last year</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">9</div>
                                <p className="text-xs text-muted-foreground">+201 total messages</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Projects and Messages Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Active Projects */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Projects</CardTitle>
                                <CardDescription>You have 7 active projects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: "Website Redesign", client: "TechCorp", dueDate: "2023-10-15" },
                                        { name: "Mobile App Development", client: "StartupX", dueDate: "2023-11-30" },
                                        { name: "E-commerce Platform", client: "RetailGiant", dueDate: "2023-12-31" },
                                    ].map((project, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{project.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {project.client} · Due {project.dueDate}
                                                </p>
                                            </div>
                                            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Messages */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Messages</CardTitle>
                                <CardDescription>You have 9 unread messages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: "Alice Johnson", message: "Can we schedule a call to discuss the project?", time: "2h ago" },
                                        { name: "Bob Smith", message: "I've sent you the updated designs. Please review.", time: "5h ago" },
                                        { name: "Carol Williams", message: "The client has approved the proposal. We can start!", time: "1d ago" },
                                    ].map((msg, index) => (
                                        <div key={index} className="flex items-start">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{msg.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{msg.name}</p>
                                                <p className="text-sm text-muted-foreground">{msg.message}</p>
                                                <p className="text-xs text-muted-foreground">{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Deadlines */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription>Stay on top of your project timelines</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { project: "Website Redesign", deadline: "2023-10-15", status: "On Track" },
                                    { project: "Mobile App Development", deadline: "2023-11-30", status: "At Risk" },
                                    { project: "E-commerce Platform", deadline: "2023-12-31", status: "On Track" },
                                ].map((deadline, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{deadline.project}</p>
                                            <p className="text-sm text-muted-foreground">Due {deadline.deadline}</p>
                                        </div>
                                        <span className={`ml-auto text-sm ${deadline.status === "On Track" ? "text-green-500" : "text-yellow-500"
                                            }`}>
                                            {deadline.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div >
    )
}
