import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/logout";
import { destroySession, getSession } from "~/lib/sessions.server";
import { Button } from "~/components/ui/button";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export default function LogoutRoute() {
  return (
    <>
      <p>Are you sure you want to log out?</p>

      <Form method="post">
        <Button>Logout</Button>
      </Form>

      <Link to="/">Cancel</Link>
    </>
  );
}
