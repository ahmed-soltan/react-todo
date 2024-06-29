"use client";

import {
  ArrowLeftFromLine,
  ListIcon,
  PanelsTopLeftIcon,
  PlusCircle,
} from "lucide-react";
import { ModeToggle } from "./theme-mode";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";

import { Separator } from "./ui/separator";
import SidebarRoute from "./sidebar-route";
import { RootState } from "@/app/store";
import { deleteUser } from "@/app/store/features/user/userSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  console.log(user);

  const routes = [
    {
      title: "Overview",
      path: "/",
      icon: PanelsTopLeftIcon,
    },
    {
      title: "Tasks List",
      path: "/tasks-list",
      icon: ListIcon,
    },
    {
      title: "Add Task",
      path: "/add-task",
      icon: PlusCircle,
    },
  ];

  const handleSignOut = () => {
    dispatch(deleteUser());
    router.push("/login");
  };

  return (
    <div
      className="flex flex-col items-start justify-between gap-3 w-full
     h-full p-3 bg-slate-100 dark:bg-slate-500/10"
    >
      <div className="flex flex-col items-start w-full gap-8">
        <div>
          <h1 className="text-3xl text-slate-900 dark:text-slate-100 font-semibold">
            <span className="text-orange-400">Task</span>
            mate
          </h1>
          <p className="text-slate-700 dark:text-slate-400 text-sm">
            Focus, Priortize, Execute.
          </p>
        </div>
        {user && user.username && user.email && (
          <div className="flex items-center border-[1.5px] rounded-md w-full gap-3 p-3">
            {/*aspect-ratio*/}
            <div className="w-7 h-7 rounded-full bg-orange-500 relative">
              <Image
                src={user.profilePhoto}
                alt="profile photo"
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex items-start flex-col">
              <h1 className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {user.username}
              </h1>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col items-start gap-2 w-full">
          <h1 className="text-xl text-slate-600 dark:text-slate-100">Menu</h1>
          <Separator className="dark:bg-slate-500" />
          {routes.map((route) => (
            <SidebarRoute
              key={route.title}
              path={route.path}
              title={route.title}
              icon={route.icon}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start gap-3">
        <ModeToggle />
        <Button
          variant={"outline"}
          className="flex items-center dark:bg-transparent"
          size={"sm"}
          onClick={handleSignOut}
        >
          <ArrowLeftFromLine className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
