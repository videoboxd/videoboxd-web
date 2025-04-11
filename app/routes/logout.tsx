import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/logout";
import { destroySession, getSession } from "~/lib/sessions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export async function loader({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.get("userId")) {
    return redirect("/login");
  }

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export default function LogoutRoute() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex items-center min-h-svh max-w-screen-xl">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Logout</CardTitle>
            <CardDescription>
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Form method="post">
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </Form>
            {/* <Form method="post"> */}
            {/* <Button>
              <Link to="/">Cancel</Link>
            </Button> */}
            {/* </Form> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
