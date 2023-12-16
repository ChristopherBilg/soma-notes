// Copyright 2023-Present Soma Notes
import NoteViewer from "../components/NoteViewer.tsx";
import Toasts from "../components/Toasts.tsx";
import NContext from "../components/context/NContext.tsx";
import NContextSetup from "../components/context/NContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";

type NoteViewerPageIslandProps = {
  params: Record<string, string>;
  userData: UserDataResponse | undefined;
};

const NoteViewerPageIsland = (
  { params, userData }: NoteViewerPageIslandProps,
) => (
  <NContext>
    <NContextSetup userData={userData} />
    <Toasts />

    <NoteViewer params={params} />
  </NContext>
);

export default NoteViewerPageIsland;
