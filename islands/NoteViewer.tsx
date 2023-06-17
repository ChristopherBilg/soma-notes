import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import NoteView from "../components/NoteView.tsx";
import { UserDataResponse } from "../helpers/github-auth.ts";

interface NoteViewerProps {
  params: Record<string, string>;
  userData: UserDataResponse | undefined;
}

const NoteViewer = ({ params, userData }: NoteViewerProps) => (
  <Context>
    <ContextSetup userData={userData} />

    <NoteView params={params} />
  </Context>
);

export default NoteViewer;
