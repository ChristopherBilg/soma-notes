import { UnknownPageProps } from "$fresh/server.ts";

const Error404 = ({ route, url }: UnknownPageProps) => (
  <div>
    <h1>Error 404: Page not found</h1>
    <p>{route}</p>
    <p>{url}</p>
  </div>
);

export default Error404;
