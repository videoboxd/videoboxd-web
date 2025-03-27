import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form, Link, redirect } from "react-router";
import { auth, UserRegisterPayloadSchema } from "~/lib/auth";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader() {
  return null;
}

export async function action({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserRegisterPayloadSchema,
  });

  if (submission.status !== "success") return submission.reply();

  const response = await auth.register(submission.value);
  if (!response) {
    return { error: "Registration failed. Please try again." };
  }

  return redirect("/login");
}

export default function RegisterRoute({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserRegisterPayloadSchema });
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth.getUser();
      if (authenticated) return navigate("/");
    };

    checkAuth();
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form
                method="post"
                id={form.id}
                onSubmit={form.onSubmit}
                className="p-6 md:p-8"
              >
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    <p className="text-red-400">{fields.email.errors}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="******"
                      autoComplete="off"
                    />
                    <p className="text-red-400">{fields.password.errors}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullName"
                      type="name"
                      placeholder="Sandhika Galih"
                    />
                    <p className="text-red-400">{fields.fullName.errors}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="sandhika"
                    />
                    <p className="text-red-400">{fields.username.errors}</p>
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
