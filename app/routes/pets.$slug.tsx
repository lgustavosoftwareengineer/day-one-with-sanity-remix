import { PortableText } from "@portabletext/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { urlFor } from "~/helpers";
import { client } from "~/sanity/client";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // Notice the $slug variable
  const query = `*[
        _type == "animal" &&
        species != "human" &&
        defined(owner) &&
        slug.current == $slug
      ][0]{
      ...,
      "slug": slug.current,
      "owner": owner->
    }`;

  // "params" variable is shaped { slug: 'pet-name' }
  // This is used for the $slug variable in the query
  const pet = await client.fetch(query, params);

  if (!pet) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ pet });
};

export default function Pet() {
  const { pet = {} } = useLoaderData<typeof loader>();

  const { name, good, species, owner, image, content } = pet;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {image ? (
        <img
          src={urlFor(image.asset._ref)
            .image(image.asset._ref)
            .height(80)
            .width(80)
            .fit("max")
            .auto("format")
            .url()}
          alt={name}
        />
      ) : null}
      {name && species ? (
        <h1>
          {name} is {good ? `a good ${species}` : `a ${species}`}
        </h1>
      ) : null}
      {owner?.name ? <p className="lead">Belongs to {owner.name}</p> : null}
      {content && content?.length > 0 ? <PortableText value={content} /> : null}
    </div>
  );
}
