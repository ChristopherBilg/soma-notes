export default async function handler() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  return new Response(JSON.stringify(posts), {
    headers: { "content-type": "application/json" },
  });
}
