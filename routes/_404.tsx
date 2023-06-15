import { UnknownPageProps } from "$fresh/server.ts";

interface Error404Props {
  url: string;
}

const Error404 = ({ url }: UnknownPageProps) => {
  return <p>Error 404: Page not found - {url}</p>;
};

export default Error404;
