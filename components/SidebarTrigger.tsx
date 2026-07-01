import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { FiSidebar } from "react-icons/fi";
import { cn } from "@/lib/utils";

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar()

  return <Button className={cn("bg-transparent hover:bg-transparent", className)} onClick={toggleSidebar}><FiSidebar className="dark:text-white text-black size-5!" /></Button>
}