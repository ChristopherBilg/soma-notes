import { useState } from "preact/hooks";
import { LeftPane } from "../components/LeftPane.tsx";
import { RightPane } from "../components/RightPane.tsx";
import { Note } from "../helpers/notes.ts";

interface DoublePaneProps {
  minLeftWidth: number;
  minRightWidth: number;
}

export default function Counter(props: DoublePaneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState("40%");
  const [rightPaneWidth, setRightPaneWidth] = useState("60%");

  const [notes, setNotes] = useState<Note[]>([]);

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
    <div
      class={`w-full flex ${isDragging ? "select-none" : "select-auto"}`}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      style={{ minHeight: "85vh" }}
    >
      <LeftPane width={leftPaneWidth} notes={notes} />

      <div
        class="cursor-ew-resize bg-black w-1"
        onMouseDown={handleDividerMouseDown}
      >
      </div>

      <RightPane width={rightPaneWidth} notes={notes} />
    </div>
  );
}
