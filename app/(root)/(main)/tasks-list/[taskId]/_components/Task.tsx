"use client";

import { TasksType, updateTask } from "@/app/store/features/user/userSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowLeft, Check, Pen, PencilRuler } from "lucide-react";
import { baseUrl, port } from "@/lib/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Link from "next/link";
import EditTaskModal from "@/components/models/edit-task-model";

const status = [
  { value: "todo", label: "Todo" },
  { value: "in progress", label: "In Progress" },
  { value: "completed", label: "Complete" },
  { value: "canceled", label: "Cancel" },
];

const Task = ({ task }: { task: TasksType }) => {
  const [myTask, setMyTask] = useState<TasksType>(task);
  const dispatch = useDispatch();
  const router = useRouter();
  const changeTaskStatus = async (status: string) => {
    try {
      const res = await fetch(`${baseUrl}:${port}/api/task/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      const data: TasksType = await res.json();

      console.log(data);
      setMyTask(data);

      dispatch(updateTask({ taskId: task._id, updates: { status } }));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-5 w-full">
      <div className="flex items-center justify-between flex-wrap w-full">
        <h1 className="text-slate-800 dark:text-slate-200 text-2xl font-medium">
          Task Details
        </h1>
      </div>
      <Separator className="dark:bg-slate-500" />
      <div className="flex flex-col items-start gap-3 ">
        <Link href={"/tasks-list"}>
          <Button variant={"link"} className="p-0" size={"sm"}>
            {" "}
            <ArrowLeft className="w-4 h-4 mr-2" /> View other Tasks
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              myTask.status === "completed" &&
                "bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-500",
              myTask.status === "in progress" &&
                "bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-500",
              myTask.status === "todo" && "bg-orange-500 dark:bg-orange-500 hover:bg-orange-400",
              myTask.status === "canceled" && "bg-rose-600 dark:bg-rose-600 hover:bg-rose-500",
              "text-white"
            )}
          >
            {myTask.status}
          </Badge>
          <Badge className={"bg-slate-800"}>
            {moment(myTask.createdAt).fromNow()}
          </Badge>
        </div>
        <h1 className="text-slate-800 dark:text-slate-200 text-xl font-medium">
          {myTask.title}
        </h1>
        <p className="text-slate-700 dark:text-slate-200 text-sm">
          {myTask.description}
        </p>
        <p className="text-slate-700 dark:text-slate-200 text-base">
          Due Date : {"  "}
          <Badge className={"bg-slate-200 text-slate-800  hover:bg-slate-200"}>
            {moment(myTask.dueDate).fromNow()}
          </Badge>
        </p>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"secondary"} size={"sm"}>
                <ArrowDown className="w-4 h-4 mr-2" />
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Task Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {status.map((taskStatus) => (
                <DropdownMenuItem
                  key={taskStatus.value}
                  onClick={() => changeTaskStatus(taskStatus.value)}
                  className={cn(
                    taskStatus.value === myTask.status && "bg-slate-200 dark:bg-slate-700"
                  )}
                >
                  {taskStatus.value === myTask.status && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {taskStatus.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <EditTaskModal
            title={myTask.title}
            description={myTask.description}
            id={myTask._id}
            dueDate={new Date(myTask.dueDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default Task;
