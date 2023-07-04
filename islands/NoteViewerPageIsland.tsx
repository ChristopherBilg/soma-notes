// Copyright 2023 Soma Notes
import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import NoteViewer from "../components/NoteViewer.tsx";
import { UserDataResponse } from "../helpers/auth/index.ts";

type NoteViewerPageIslandProps = {
  params: Record<string, string>;
  userData: UserDataResponse | undefined;
};

const NoteViewerPageIsland = (
  { params, userData }: NoteViewerPageIslandProps,
) => (
  <Context>
    <ContextSetup userData={userData} />

    <NoteViewer params={params} />
  </Context>
);

export default NoteViewerPageIsland;
