"use client"
import { TasksType } from "@/app/store/features/user/userSlice";
import Banner from "@/components/banner";
import { baseUrl, port } from "@/lib/constants";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface UserData {
  _id: string;
  username: string;
  email: string;
  linkedinUrl: string;
  tasks: TasksType[];
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}:${port}/api/user/${user._id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json() as UserData;
        console.log('Fetched user data:', userData);

        if (!userData || !userData._id) {
          throw new Error("User data is invalid or missing");
        }

        setUserData(userData);

        
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  if(!user){
    router.push('/login');
  }
  const todoTasks = userData.tasks.filter((task) => task.status === "todo");
  const inProgressTasks = userData.tasks.filter((task) => task.status === "in progress");
  const completedTasks = userData.tasks.filter((task) => task.status === "completed");
  const canceledTasks = userData.tasks.filter((task) => task.status === "canceled");

  return (
    <div className="w-full h-full p-6">
      <Banner pathname={pathname} />
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        <div className="w-full lg:w-[350px] max-h-[150px] gap-4 border-[1px] rounded-md p-3 flex flex-col justify-between bg-rose-600">
          <h1 className="text-5xl text-slate-100 dark:text-slate-200">
            {todoTasks.length}
          </h1>
          <p className="text-xl text-slate-200 dark:text-slate-200">
            Todo Tasks
          </p>
        </div>
        <div className="w-full lg:w-[350px] max-h-[150px] gap-4 border-[1px] rounded-md p-3 flex flex-col justify-between bg-yellow-600">
          <h1 className="text-5xl text-slate-100 dark:text-slate-200">
            {inProgressTasks.length}
          </h1>
          <p className="text-xl text-slate-200 dark:text-slate-200">
            In Progress Tasks
          </p>
        </div>
        <div className="w-full lg:w-[350px] max-h-[150px] gap-4 border-[1px] rounded-md p-3 flex flex-col justify-between bg-emerald-600">
          <h1 className="text-5xl text-slate-100 dark:text-slate-200">
            {completedTasks.length}
          </h1>
          <p className="text-xl text-slate-200 dark:text-slate-200">
            Completed Tasks
          </p>
        </div>
        <div className="w-full lg:w-[350px] max-h-[150px] gap-4 border-[1px] rounded-md p-3 flex flex-col justify-between bg-slate-600">
          <h1 className="text-5xl text-slate-100 dark:text-slate-200">
            {canceledTasks.length}
          </h1>
          <p className="text-xl text-slate-200 dark:text-slate-200">
            Canceled Tasks
          </p>
        </div>
      </div>
    </div>
  );
}
