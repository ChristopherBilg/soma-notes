// Copyright 2023-Present Soma Notes
import JournalSelectors from "../components/JournalSelectors.tsx";
import JournalViewer from "../components/JournalViewer.tsx";
import Toasts from "../components/Toasts.tsx";
import JContext from "../components/context/JContext.tsx";
import JContextSetup from "../components/context/JContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";
import { URLSearchParamsProvider } from "../hooks/use-url-search-params.tsx";

type JournalViewerIslandProps = {
  userData: UserDataResponse | undefined;
};

const JournalViewerIsland = (
  { userData }: JournalViewerIslandProps,
) => (
  <JContext>
    <JContextSetup userData={userData} />
    <Toasts />

    <div class="p-4 mx-auto max-w-screen-xl">
      <div class="flex flex-col justify-center items-center">
        <URLSearchParamsProvider>
          <JournalSelectors />

          <JournalViewer />
        </URLSearchParamsProvider>
      </div>
    </div>
  </JContext>
);

export default JournalViewerIsland;
