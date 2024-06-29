"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import axios from "axios";
import {
  PencilRuler,
  User,
  Mail,
  CalendarIcon,
  BookMarked,
} from "lucide-react";
import { baseUrl, port } from "@/lib/constants";
import { Textarea } from "../ui/textarea";
import { useDispatch } from "react-redux";
import { updateTask } from "@/app/store/features/user/userSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const formSchema = z.object({
  taskTitle: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  taskDescription: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

type EditTaskModalProps = {
  title: string;
  description: string;
  id: string;
  dueDate: Date;
};

const EditTaskModal = ({
  title,
  description,
  id,
  dueDate,
}: EditTaskModalProps) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskTitle: title,
      taskDescription: description,
      dob: dueDate,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedDob = data.dob.toISOString();

    try {
      const res = await axios.patch(`${baseUrl}:${port}/api/task/${id}`, {
        title: data.taskTitle,
        description: data.taskDescription,
        dueDate: formattedDob,
      });
      console.log(res.data);

      dispatch(
        updateTask({
          taskId: id,
          updates: { title: data.taskTitle, description: data.taskDescription , dueDate: formattedDob },
        })
      );
      toast.success("Task updated successfully")
      
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.success("something went wrong, please try again")
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <PencilRuler className="w-4 h-4 mr-2" size={"sm"} /> Edit Task Details
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:text-slate-300 overflow-hidden w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Task</DialogTitle>
          <DialogDescription>Edit your Task Details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-start flex-col space-y-4">
              <FormField
                control={form.control}
                name="taskTitle"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <User className="w-4 h-4 mr-2" /> Task Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Task Title e.g. 'create todo list'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <Mail className="w-4 h-4 mr-2" /> Task Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter Task Description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <BookMarked className="w-4 h-4 mr-2" /> Task Due Date
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: any) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="w-full">
              <Button type="submit" className="mr-auto" disabled={isLoading}>
                Update Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
