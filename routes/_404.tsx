import { UnknownPageProps } from "$fresh/server.ts";

const Error404 = (props: UnknownPageProps) => {
  return <p>Error 404: Page not found - {props.url}</p>;
};

export default Error404;
