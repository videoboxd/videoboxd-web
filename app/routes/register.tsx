import { Card, CardContent } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export default function RegisterRoute() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      Create Videoboxd Account
                    </h1>
                    <p className="text-balance text-muted-foreground">
                      Let's get started. Fill in the details below to create
                      your account.
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
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
                    Register
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Login
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
