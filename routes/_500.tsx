import { ErrorPageProps } from "$fresh/server.ts";

const Error500 = ({ error, pattern, url }: ErrorPageProps) => (
  <div>
    <h1>Error 500: Internal server error</h1>
    <p>{error as string}</p>
    <p>{pattern}</p>
    <p>{url}</p>
  </div>
);

export default Error500;
