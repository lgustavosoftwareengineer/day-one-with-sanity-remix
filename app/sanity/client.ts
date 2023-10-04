import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "qmjvg4p5",
  dataset: "production",
  apiVersion: "2023-08-01",
});
