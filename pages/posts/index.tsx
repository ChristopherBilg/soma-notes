import { h, Fragment, useEffect, useState } from "https://esm.sh/preact";
import { useDeno } from "https://deno.land/x/aleph/mod.ts";

export default function Posts() {
  const posts = useDeno(async () => {
    const res = await fetch("/api/posts");
    const posts = await res.json();
    return posts;
  });

  return (
    <Fragment>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
