"use client";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import axios from "axios";
import { PencilRuler, User, Mail, Pen, BookMarked, CalendarIcon } from "lucide-react";
import { baseUrl, port } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "@/app/store/features/user/userSlice";
import { RootState } from "@/app/store";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const AddTask = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dob: new Date(),
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formattedDob = data.dob.toISOString();
    try {
      const res = await axios.post(`${baseUrl}:${port}/api/task`, {
        title: data.title,
        description: data.description,
        userId: user._id,
        dueDate: formattedDob
      });
      console.log(res.data);
      dispatch(addTask(res.data));
      toast.success("Task Created Successfully")
      router.refresh();
      router.push("/tasks-list");
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong, please try again")
    }
   
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Form {...form}>
        <form
          className="space-y-8 border rounded-md w-full lg:w-[600px] p-5 bg-slate-50 dark:bg-slate-900"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-start flex-col space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                    <Pen className="w-4 h-4 mr-2" /> Task Title
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
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                    <BookMarked className="w-4 h-4 mr-2" /> Task Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter Task Description" />
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
                          disabled={(date:any) =>
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
          <Button type="submit" className="mr-auto" disabled={isLoading}>
            Create Task
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTask;
