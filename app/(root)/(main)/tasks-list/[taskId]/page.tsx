"use client"
import { useEffect, useState } from "react";
import { baseUrl, port } from "@/lib/constants";
import Task from "./_components/Task";

const TaskIdPage = ({ params }: { params: { taskId: string } }) => {
  const [task, setTask] = useState(null);

  const fetchTask = async () => {
    try {
      const res = await fetch(`${baseUrl}:${port}/api/task/${params.taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }

      const data = await res.json();
      console.log(data)
      setTask(data);
    } catch (error:any) {
      console.error("Error fetching task:", error.message);
    }
  };  useEffect(() => {
    fetchTask();
  }, [params.taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 h-full w-full">
      <Task task={task} />
    </div>
  );
};

export default TaskIdPage;
