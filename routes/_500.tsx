import { AppProps } from "$fresh/server.ts";

export default function Error500({ Component }: AppProps) {
  return <p>Error 500: Internal server error</p>;
}
