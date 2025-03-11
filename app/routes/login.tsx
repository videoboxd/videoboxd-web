import type { Route } from "./+types/home";
import { Link, redirect } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { auth, UserLoginPayloadSchema } from "~/lib/auth";
import type { ZodObject, ZodString, ZodTypeAny } from "zod";
import { parseWithZod } from "@conform-to/zod";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader() {
  console.log("xyzThis is data loader: LOGIN");
  //   return {};
}

export async function action({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserLoginPayloadSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const response = await auth.login(submission.value);
  if (!response) {
    console.log("Login failed");
    return;
  }

  return redirect("/");
}

export default function LoginRoute() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your username and password to sign in.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="name"
                      placeholder="example123"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="###"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://img.freepik.com/free-vector/silver-blurred-background_1034-253.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
