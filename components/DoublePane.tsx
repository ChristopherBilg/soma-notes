import { useContext, useState } from "preact/hooks";
import LeftPane from "./LeftPane.tsx";
import RightPane from "./RightPane.tsx";
import { UIContext } from "./Context.tsx";

interface DoublePaneProps {
  minLeftWidth: number;
  minRightWidth: number;
}

const DoublePane = ({ minLeftWidth, minRightWidth }: DoublePaneProps) => {
  const { leftPaneWidth, setLeftPaneWidth, rightPaneWidth, setRightPaneWidth } =
    useContext(UIContext);
  const [isDragging, setIsDragging] = useState(false);

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

    if (leftWidth < minLeftWidth || rightWidth < minRightWidth) {
      return;
    }

    setLeftPaneWidth(`${leftWidth}px`);
    setRightPaneWidth(`${rightWidth}px`);
  };

  return (
    <div
      class={`w-full flex ${isDragging ? "select-none" : "select-auto"}`}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      style={{ minHeight: "50vh" }}
    >
      <LeftPane width={leftPaneWidth.value} />

      <div
        class="cursor-ew-resize bg-black w-1"
        onMouseDown={handleDividerMouseDown}
      >
      </div>

      <RightPane width={rightPaneWidth.value} />
    </div>
  );
};

export default DoublePane;
