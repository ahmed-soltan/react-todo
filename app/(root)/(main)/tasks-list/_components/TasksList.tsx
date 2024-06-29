"use client";

import { RootState } from "@/app/store";
import { TasksType } from "@/app/store/features/user/userSlice";
import Banner from "@/components/banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TasksListComponent = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router]);
  return (
    <>
      <Banner pathname={pathname} />
      <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
        {user.tasks.length > 0 ? (
          user.tasks.map((task: TasksType) => (
            <div
              key={task._id}
              className="w-full lg:w-[400px] h-[150px] gap-4 border-[1px] rounded-md p-3 flex flex-col justify-between bg-pink-100 dark:bg-pink-200 relative"
            >
              <Badge className="text-xs bg-slate-200 text-slate-800  hover:bg-slate-200 max-w-[90px] text-center">
                {moment(task.dueDate).fromNow()}
              </Badge>
              <h1 className="text-3xl text-slate-800  font-medium line-clamp-1">
                {task.title}
              </h1>
              <p className="text-base text-slate-800  font-medium line-clamp-1">
                {task.description}
              </p>
              <Link
                href={`${pathname}/${task._id}`}
                className="absolute top-[10px] right-[10px]"
              >
                <Button
                  variant={"link"}
                  className="rounded-full border border-slate-800 text-slate-800 dark:text-slate-800"
                >
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <div>You Don't Have Tasks</div>
        )}
      </div>
    </>
  );
};

export default TasksListComponent;
