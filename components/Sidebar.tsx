'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faCalendar, faFileAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/SidebarTrigger"
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

type NavLink = {
  href: string;
  label: string;
  icon: IconDefinition;
};

export default function Sidebar({ userId }: { userId?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const [activeTab, setActiveTab] = useState("")

  const isFreelancerInterface = pathname.includes('Finterface') || pathname.includes('Fdash') || pathname.includes('Fprofile') || pathname.includes('MyApplications');
  const isClientInterface = pathname.includes('Cinterface') || pathname.includes('Cdash') || pathname.includes('Cprofile') || pathname.includes('NewJob') || pathname.includes('JobApplications');

  const isSharedPage = pathname === '/messages' || pathname === '/schedule' || pathname.startsWith('/messages/') || pathname.startsWith('/schedule/');

  const freelancerLinks: NavLink[] = [
    { href: "/Fdash", label: "Dashboard", icon: faHome },
    { href: "/MyApplications", label: "My Applications", icon: faFileAlt },
    { href: `/messages/${userId}`, label: "Messages", icon: faEnvelope },
    { href: "/schedule", label: "Schedule", icon: faCalendar },
  ];

  const clientLinks: NavLink[] = [
    { href: "/Cdash", label: "Dashboard", icon: faHome },
    { href: "/NewJob", label: "Post New Job", icon: faBriefcase },
    { href: `/messages/${userId}`, label: "Messages", icon: faEnvelope },
    { href: "/schedule", label: "Schedule", icon: faCalendar },
  ];

  let links: NavLink[] = [];
  if (isClientInterface) {
    links = clientLinks;
  } else if (isFreelancerInterface || isSharedPage) {
    links = isSharedPage && userRole === "Client" ? clientLinks : freelancerLinks;
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen className="w-auto shrink-0 min-h-0">
        <ShadcnSidebar
          collapsible="icon"
          className="hidden h-auto shrink-0 md:flex"
        >
        <SidebarHeader className="p-6 pb-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center justify-between">
            <h2 className="bg-linear-to-r from-deep_blue to-marine_blue bg-clip-text text-2xl font-bold text-transparent dark:from-yellow dark:to-light_yellow group-data-[collapsible=icon]:hidden">
              Menu
            </h2>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {links.map(({ href, label, icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href + '/');

                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={label}
                        className={cn(
                          "h-auto px-4 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                          isActive
                            ? "border-l-4 border-yellow bg-linear-to-r from-yellow/20 to-light_yellow/20 font-semibold text-deep_blue dark:from-yellow/10 dark:to-light_yellow/10 dark:text-yellow group-data-[collapsible=icon]:border-l-0"
                            : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        <Link href={href} onClick={() => { setActiveTab(label) }}>
                          <FontAwesomeIcon icon={icon} className="size-5! shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                        </Link>

                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>

              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </ShadcnSidebar>
      <SidebarRail />
      
      </SidebarProvider>
    </TooltipProvider>
  );
}