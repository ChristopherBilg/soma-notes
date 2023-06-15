import { ErrorPageProps } from "$fresh/server.ts";

const Error500 = (props: ErrorPageProps) => {
  return (
    <p>Error 500: Internal server error - {(props.error as Error).message}</p>
  );
};

export default Error500;
