import { useEffect, useState } from "react";
import { Form, Link, useNavigate } from "react-router";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { auth, UserLoginPayloadSchema } from "~/lib/auth";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Videoboxd" },
    { name: "description", content: "Continue to existing account." },
  ];
}

export async function loader() {
  return null;
}

export async function action({ request }: Route.ClientActionArgs) {
  return null;
}

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserLoginPayloadSchema });
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth.getUser();
      if (authenticated) return navigate("/");
    };

    checkAuth();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const submission = parseWithZod(formData, {
      schema: UserLoginPayloadSchema,
    });

    if (submission.status !== "success") {
      return;
    }

    setIsLoading(true);
    const success = await auth.login(submission.value);
    setIsLoading(false);

    if (success) {
      alert("Login Successfully");
      navigate("/");
    } else {
      alert("Username or password is wrong");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Enter your username and password to login.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="name"
                      placeholder="example123"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="###"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {!isLoading ? (
                      "Login"
                    ) : (
                      <>
                        <span className="animate-spin">.</span>
                        <span>Loading..</span>
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to={`/register`}
                      className="underline underline-offset-4"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </Form>
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
