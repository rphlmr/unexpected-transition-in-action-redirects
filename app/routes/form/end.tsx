import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const name = session.get("name");

  // Here we want to prevent user from going back here after submitting the form.
  if (!name) throw redirect("/");

  return json({ name });
}

export default function FormEnd() {
  const loaderData = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Summary</h1>
      <h2>Your session data:</h2>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      <Form method="post">
        <button type="submit">I'm OK, process and redirect</button>
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

  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
