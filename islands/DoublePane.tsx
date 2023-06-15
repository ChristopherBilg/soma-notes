import { useState } from "preact/hooks";
import LeftPane from "../components/LeftPane.tsx";
import RightPane from "../components/RightPane.tsx";
import Context from "../signal/context.tsx";

interface DoublePaneProps {
  minLeftWidth: number;
  minRightWidth: number;
}

const DoublePane = (props: DoublePaneProps) => {
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
      leftWidth < props.minLeftWidth || rightWidth < props.minRightWidth
    ) {
      return;
    }

    setLeftPaneWidth(`${leftWidth}px`);
    setRightPaneWidth(`${rightWidth}px`);
  };

  return (
    <Context>
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
