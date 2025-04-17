import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { data, Form, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { auth, UserRegisterPayloadSchema } from "~/lib/auth";
import type { Route } from "./+types/register";
import { commitSession, destroySession, getSession } from "~/lib/sessions";
import { HTTPError } from "ky";
import { AlertCircle } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Videoboxd" },
    { name: "description", content: "Explore interesting videos." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await destroySession(session) } }
  );
}

export async function action({ request }: Route.ClientActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserRegisterPayloadSchema,
  });
  if (submission.status !== "success") return submission.reply();

  try {
    const response = await auth.register(submission.value);

    return redirect("/login");
  } catch (error: unknown) {
    let message = "Register failed";

    // handle error HTTP dari ky
    if (error instanceof HTTPError) {
      const res = await error.response.json();
      message = res.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    session.flash("error", message);

    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function RegisterRoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { error } = loaderData;

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    // lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserRegisterPayloadSchema });
    },
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      {error && (
        <div className="w-full max-w-sm md:max-w-sm md:-mt-7 mb-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Register Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="w-full max-w-sm md:max-w-sm">
        <div className="flex flex-col gap-2">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0">
              <Form
                method="post"
                id={form.id}
                onSubmit={form.onSubmit}
                className="p-6 md:p-8"
              >
                <div className="flex flex-col gap-3">
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
                    <p className="text-red-400 text-xs">
                      {fields.email.errors}
                    </p>
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
                    <p className="text-red-400 text-xs">
                      {fields.password.errors}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullName"
                      type="name"
                      placeholder="Example User"
                    />
                    <p className="text-red-400 text-xs">
                      {fields.fullName.errors}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="example"
                    />
                    <p className="text-red-400 text-xs">
                      {fields.username.errors}
                    </p>
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
