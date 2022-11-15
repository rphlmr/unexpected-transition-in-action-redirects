import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  return json({ name: session.get("name") });
}

export default function FormIndex() {
  const { name } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Start</h1>
      <Form method="post">
        <input type="text" name="name" defaultValue={name} autoComplete="off" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  session.set("name", name);

  return redirect("/form/end", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
