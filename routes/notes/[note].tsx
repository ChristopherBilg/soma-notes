import { PageProps } from "$fresh/server.ts";

export default function Note(props: PageProps) {
  return <div>Note ID: {props.params.note}</div>;
}
