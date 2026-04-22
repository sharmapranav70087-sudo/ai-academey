import serverless from "serverless-http";

let handler;

export default async function (req, res) {
  if (!handler) {
    const { default: app } = await import("../backend/src/app.js");
    const { connectDB } = await import("../backend/src/config/db.js");

    await connectDB();

    handler = serverless(app);
  }

  return handler(req, res);
}
