import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarRoute = {
  title: string;
  path: string;
  icon: LucideIcon;
};
const SidebarRoute = ({ title, path, icon: Icon }: SidebarRoute) => {
  const pathname = usePathname();
  const isActive = pathname === `${path}` 
  return (
    <Link href={`${path}`} className="w-full">
      <Button
        className={cn(
          isActive && "text-white bg-orange-400 dark:bg-orange-400",
          "flex items-center w-full  dark:text-slate-200"
        )}
        variant={"outline"}
      >
        <Icon className="w-6 h-6 mr-2 " />
        <h1 className="mr-auto">{title}</h1>
      </Button>
    </Link>
  );
};

export default SidebarRoute;
