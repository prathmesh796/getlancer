'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faCalendar, faFileAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar(params) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = params.userId; // replace with session user ID
  const userRole = session?.user?.role;

  // Determine if user is in Freelancer or Client interface
  const isFreelancerInterface = pathname.includes('Finterface') || pathname.includes('Fdash') || pathname.includes('Fprofile') || pathname.includes('MyApplications');
  const isClientInterface = pathname.includes('Cinterface') || pathname.includes('Cdash') || pathname.includes('Cprofile') || pathname.includes('NewJob') || pathname.includes('JobApplications');

  // For shared pages (messages, schedule), check if we're coming from a specific interface
  // If neither is detected, default to showing freelancer interface
  const isSharedPage = pathname === '/messages' || pathname === '/schedule' || pathname.startsWith('/messages/') || pathname.startsWith('/schedule/');

  const freelancerLinks = [
    { href: "/Fdash", label: "Dashboard", icon: faHome },
    { href: "/MyApplications", label: "My Applications", icon: faFileAlt },
    { href: `/messages/${userId}`, label: "Messages", icon: faEnvelope },
    { href: "/schedule", label: "Schedule", icon: faCalendar },
  ];

  const clientLinks = [
    { href: "/Cdash", label: "Dashboard", icon: faHome },
    { href: "/NewJob", label: "Post New Job", icon: faBriefcase },
    { href: `/messages/${userId}`, label: "Messages", icon: faEnvelope },
    { href: "/schedule", label: "Schedule", icon: faCalendar },
  ];

  // Determine which links to show
  let links = [];
  if (isClientInterface) {
    links = clientLinks;
  } else if (isFreelancerInterface || isSharedPage) {
    // For shared pages, use the logged-in user's role.
    // Otherwise (freelancer interface pages), use freelancer menu.
    links = isSharedPage && userRole === "Client" ? clientLinks : freelancerLinks;
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">
        Menu
      </h2>
      <nav className="space-y-2">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-yellow/20 to-light_yellow/20 dark:from-yellow/10 dark:to-light_yellow/10 text-deep_blue dark:text-yellow font-semibold border-l-4 border-yellow"
                : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
            >
              <FontAwesomeIcon icon={icon} className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
