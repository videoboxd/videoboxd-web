import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { data, Form, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { auth, UserLoginPayloadSchema } from "~/lib/auth";
import { commitSession, destroySession, getSession } from "~/lib/sessions";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Videoboxd" },
    { name: "description", content: "Continue to existing account." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/dashboard");
  }

  return data(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await destroySession(session) } }
  );
}

export async function action({ request }: Route.ClientActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserLoginPayloadSchema,
  });
  if (submission.status !== "success") return submission.reply();

  const user = await auth.login(submission.value);

  if (!user) {
    session.flash("error", "Invalid username/password");
    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  session.set("userId", user.id);
  session.set("accessToken", user.accessToken);
  session.set("refreshToken", user.refreshToken);

  return redirect("/dashboard", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function LoginRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { error } = loaderData;

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserLoginPayloadSchema });
    },
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      {error ? <div className="error">{error}</div> : null}

      <div className="w-full max-w-sm md:max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="flex">
              <Form
                method="post"
                id={form.id}
                onSubmit={form.onSubmit}
                className="p-6 md:p-8"
              >
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
                  <Button type="submit" className="w-full">
                    Login
                  </Button>

                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                      to={`/register`}
                      className="underline underline-offset-4"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
