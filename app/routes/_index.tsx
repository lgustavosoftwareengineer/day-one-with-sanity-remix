import { PortableText } from "@portabletext/react";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { urlFor } from "~/helpers";

import { client } from "~/sanity/client";
import type { Animal } from "~/types";

export const loader = async () => {
  const query = `*[
        _type == "animal" &&
        species != "human" &&
        defined(owner)
      ]{
      ...,
      slug,
      "owner": owner->name
    }`;

  const pets = await client.fetch<Animal[]>(query);

  if (!pets) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ pets });
};

export default function Pets() {
  const { pets = [] } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {pets.map((pet) => {
        return <Pet {...pet} key={pet._id} />;
      })}
    </div>
  );
}

function Pet({
  slug = { current: "" },
  name,
  species,
  owner,
  image,
  content,
}: Animal) {
  console.log({ image });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderBottom: "2px solid #00000029",
      }}
    >
      {image ? (
        <div
          style={{
            alignSelf: "center",
          }}
        >
          <img
            style={{
              border: "2px solid black",
              borderRadius: 100,
            }}
            src={urlFor(image.asset._ref)
              .image(image.asset._ref)
              .height(200)
              .width(200)
              .fit("max")
              .auto("format")
              .url()}
            alt={name}
          />
        </div>
      ) : null}
      <div style={{ flexDirection: "column", padding: "10px" }}>
        <Link to={`pets/${slug.current}`}>{name}</Link>
        <p>Species: {species}</p>
        {owner?.name ? <p className="lead">Belongs to {owner.name}</p> : null}
        {content && content?.length > 0 ? (
          <PortableText value={content} />
        ) : null}
      </div>
    </div>
  );
}
