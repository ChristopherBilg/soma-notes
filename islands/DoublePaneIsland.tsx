// Copyright 2023 Soma Notes
import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import DoublePane from "../components/DoublePane.tsx";
import { UserDataResponse } from "../helpers/auth/index.ts";

interface DoublePaneIslandProps {
  userData: UserDataResponse | undefined;
}

const DoublePaneIsland = ({ userData }: DoublePaneIslandProps) => (
  <Context>
    <ContextSetup userData={userData} />

    <DoublePane minLeftWidth={200} minRightWidth={200} />
  </Context>
);

export default DoublePaneIsland;
