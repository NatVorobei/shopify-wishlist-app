import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";

export async function loader() {
  return json({
    ok: true,
    message: "Hello from API",
  });
}

export async function action({ request }) {
  const method = request.method;

  switch (method) {
    case "POST":
      return json({ message: "Success", method: "POST" });
    case "PATCH":
      return json({ message: "Success", method: "PATCH" });
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
