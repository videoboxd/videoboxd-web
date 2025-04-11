import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/contact";
import { Card } from "~/components/ui/card";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const contactFormData = {
    name: formData.get("name"),
    message: formData.get("message"),
  };

  console.log("Form submitted:", contactFormData);

  return { data: contactFormData };
}

export default function Contact({ actionData }: Route.ComponentProps) {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <Card className="p-4">
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <Label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </Label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </Form>

        <pre className="text-xs">{JSON.stringify(actionData, null, 2)}</pre>
      </Card>
    </div>
  );
}
