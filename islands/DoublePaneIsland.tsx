// Copyright 2023-Present Soma Notes
import DoublePane from "../components/DoublePane.tsx";
import Toasts from "../components/Toasts.tsx";
import NContext from "../components/context/NContext.tsx";
import NContextSetup from "../components/context/NContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";
import { URLSearchParamsProvider } from "../hooks/use-url-search-params.tsx";

type DoublePaneIslandProps = {
  userData: UserDataResponse | undefined;
};

const DoublePaneIsland = ({ userData }: DoublePaneIslandProps) => (
  <NContext>
    <NContextSetup userData={userData} />
    <Toasts />

    <URLSearchParamsProvider>
      <DoublePane minLeftWidth={200} />
    </URLSearchParamsProvider>
  </NContext>
);

export default DoublePaneIsland;
