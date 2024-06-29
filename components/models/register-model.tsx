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
import { Link as LinkIcon, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { baseUrl, port } from "@/lib/constants";
import toast from "react-hot-toast";


const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  linkedinUrl: z.string().url(),
});

const RegisterModal = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      linkedinUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post(`${baseUrl}:${port}/api/register`, data);
      console.log(res.data);
      router.push("/login");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed, please try again");
      } else if (error.request) {
        console.log(error.request);
        toast.error("No response from server, please try again");
      } else {
        console.log('Error', error.message);
        toast.error("An error occurred, please try again");
      }
      console.log(error.config);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black dark:bg-slate-600/30 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign Up</DialogTitle>
          <DialogDescription>
            Create Your Account to Start Adding Tasks
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-start flex-col space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <User className="w-4 h-4 mr-2" /> username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Your username e.g. 'john deo'"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        type="email"
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
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2" /> Linkedin Profile url
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Your Linkedin Profile url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="flex items-center gap-1 text-sm">
                Already Have an Account?
                <Link href={"/login"} className="underline text-blue-600">
                  Sign In
                </Link>
              </p>
            </div>
            <DialogFooter className="w-full">
              <Button type="submit" className="mr-auto" disabled={isLoading}>
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
