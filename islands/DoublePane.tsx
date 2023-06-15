import { useState } from "preact/hooks";
import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import LeftPane from "../components/LeftPane.tsx";
import RightPane from "../components/RightPane.tsx";
import { UserDataResponse } from "../helpers/github-auth.ts";

interface DoublePaneProps {
  minLeftWidth: number;
  minRightWidth: number;
  userData: UserDataResponse | undefined;
}

const DoublePane = (
  { minLeftWidth, minRightWidth, userData }: DoublePaneProps,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState("40%");
  const [rightPaneWidth, setRightPaneWidth] = useState("60%");

  const handleDividerMouseDown = () => setIsDragging(true);
  const handleContainerMouseUp = () => setIsDragging(false);
  const handleContainerMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = e.currentTarget as HTMLElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const leftWidth = e.clientX - containerRect.left;
    const rightWidth = containerRect.width - leftWidth;

    if (
      leftWidth < minLeftWidth || rightWidth < minRightWidth
    ) {
      return;
    }

    setLeftPaneWidth(`${leftWidth}px`);
    setRightPaneWidth(`${rightWidth}px`);
  };

  return (
    <Context>
      <ContextSetup userData={userData} />

      <div
        class={`w-full flex ${isDragging ? "select-none" : "select-auto"}`}
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleContainerMouseUp}
        style={{ minHeight: "50vh" }}
      >
        <LeftPane width={leftPaneWidth} />

        <div
          class="cursor-ew-resize bg-black w-1"
          onMouseDown={handleDividerMouseDown}
        >
        </div>

        <RightPane width={rightPaneWidth} />
      </div>
    </Context>
  );
};

export default DoublePane;
