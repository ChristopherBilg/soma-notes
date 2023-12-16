// Copyright 2023-Present Soma Notes
import { useContext, useState } from "preact/hooks";
import { DEFAULT_LEFT_PANE_WIDTH } from "../helpers/constants.ts";
import { debouncedAdjustNoteTextareaHeight } from "../helpers/ui.ts";
import LeftPane from "./LeftPane.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import RightPane from "./RightPane.tsx";
import { NotesContext, UIContext } from "./context/CommonContext.tsx";

type DoublePaneProps = {
  minLeftWidth: number;
};

const DoublePane = ({ minLeftWidth }: DoublePaneProps) => {
  const { leftPaneWidth, setLeftPaneWidth } = useContext(UIContext);
  const { notesNetworkRequestPending } = useContext(NotesContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleDividerDblClick = () => {
    setLeftPaneWidth(DEFAULT_LEFT_PANE_WIDTH);
    debouncedAdjustNoteTextareaHeight();
  };
  const handleDividerMouseDown = () => setIsDragging(true);
  const handleContainerMouseUp = () => setIsDragging(false);
  const handleContainerMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = e.currentTarget as HTMLElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const leftWidth = e.clientX - containerRect.left;

    if (leftWidth < minLeftWidth) return;

    setLeftPaneWidth(`${leftWidth}px`);
    debouncedAdjustNoteTextareaHeight();
  };

  return (
    <div
      class={`
        w-full flex
        ${isDragging ? "select-none" : "select-auto"}
      `}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
    >
      <NetworkRequestLoadingIcon hidden={!notesNetworkRequestPending.value} />

      <LeftPane width={leftPaneWidth.value} />

      <div
        class="cursor-move bg-black px-px"
        onMouseDown={handleDividerMouseDown}
        onDblClick={handleDividerDblClick}
      >
      </div>

      <RightPane />
    </div>
  );
};

export default DoublePane;
