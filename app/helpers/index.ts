import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/client";

export const urlFor = (source: any) => {
  const { projectId = "", dataset = "", ...clientConfig } = client.config();

  return imageUrlBuilder({ projectId, dataset, ...clientConfig }).image(source);
};
