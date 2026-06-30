import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { FiSidebar } from "react-icons/fi";

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return <Button className="bg-transparent hover:bg-transparent" onClick={toggleSidebar}><FiSidebar className="dark:text-white text-black size-5!" /></Button>
}