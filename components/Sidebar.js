'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/messages", label: "Messages" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <aside className="w-64 p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav className="space-y-2">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-gray-100 text-gray-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}