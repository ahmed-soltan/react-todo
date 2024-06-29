import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

const Navbar = () => {
  return (
    <div className="px-4 py-2 border-b border-slate-300 shadow-md">
      <Sheet>
        <SheetTrigger>
          <Menu className="w-7 h-7"/>
        </SheetTrigger>
        <SheetContent side={"left"}>
        <Sidebar/>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
