"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addUser } from "@/app/store/features/user/userSlice";
import toast from "react-hot-toast";
import { baseUrl, port } from "@/lib/constants";


const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const LoginModal = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`${baseUrl}:${port}/api/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      const result = await res.json();
      console.log(result);
      dispatch(addUser(result));
      toast.success("Logged in successfully");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Something went wrong, please try again");
    }
  };
  

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black dark:text-white dark:bg-slate-600/30 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign In</DialogTitle>
          <DialogDescription>
            Sign in to Your Account to Start Adding Tasks
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-start flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <Mail className="w-4 h-4 mr-2" /> Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Your Email e.g. 'john@example.com'"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <Lock className="w-4 h-4 mr-2" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a Password e.g. 'john123'"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="flex items-center gap-1 text-sm">
                Don't Have an Account?
              <Link href={'/register'} className="underline text-blue-600">
                  Create Account
              </Link>
              </p>
            </div>
            <DialogFooter className="w-full">
              <Button type="submit" className="mr-auto" disabled={isLoading}>
                Sign In
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
