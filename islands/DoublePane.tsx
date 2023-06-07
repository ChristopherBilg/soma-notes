import { useState } from "preact/hooks";

interface DoublePaneProps {
  minLeftWidth: number;
  minRightWidth: number;
}

export default function Counter(props: DoublePaneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState("50%");
  const [rightPaneWidth, setRightPaneWidth] = useState("50%");

  const handleDividerMouseDown = () => {
    setIsDragging(true);
  };

  const handleContainerMouseUp = () => {
    setIsDragging(false);
  };

  const handleContainerMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return;
    }
    e.preventDefault();

    const container = document.getElementById("container");
    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const x = e.clientX - containerRect.left;
    const leftWidth = x;
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
    <div
      id="container"
      class={`w-full flex ${isDragging ? "select-none" : "select-auto"}`}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      style={{ height: "80vh" }} // TODO: Remove this later in favor of automatic height for content
    >
      <div
        id="left-pane"
        class="p-2.5 bg-gray-300 rounded-l-lg"
        style={{ width: leftPaneWidth }}
      >
        Left Pane
      </div>

      <div
        id="divider"
        class="cursor-ew-resize bg-black w-1"
        onMouseDown={handleDividerMouseDown}
      >
      </div>

      <div
        id="right-pane"
        class="p-2.5 bg-gray-200 rounded-r-lg"
        style={{ width: rightPaneWidth }}
      >
        Right Pane
      </div>
    </div>
  );
}
