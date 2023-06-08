import { PageProps } from "$fresh/server.ts";

const Note = (props: PageProps) => {
  return <div>Note ID: {props.params.note}</div>;
};

export default Note;
