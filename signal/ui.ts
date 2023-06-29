import { Signal, signal } from "@preact/signals";

export type UIStateType = {
  searchField: Signal<string>;
  setSearchField: (newSearchField: string) => void;

  leftPaneWidth: Signal<string>;
  setLeftPaneWidth: (newLeftPaneWidth: string) => void;
  rightPaneWidth: Signal<string>;
  setRightPaneWidth: (newRightPaneWidth: string) => void;
};

const UIState = (): UIStateType => {
  const searchField = signal<string>("");

  const setSearchField = (newSearchField: string) => {
    searchField.value = newSearchField;
  };

  const leftPaneWidth = signal<string>("40%");
  const setLeftPaneWidth = (newLeftPaneWidth: string) => {
    leftPaneWidth.value = newLeftPaneWidth;
  };

  const rightPaneWidth = signal<string>("60%");
  const setRightPaneWidth = (newRightPaneWidth: string) => {
    rightPaneWidth.value = newRightPaneWidth;
  };

  return {
    searchField,
    setSearchField,
    leftPaneWidth,
    setLeftPaneWidth,
    rightPaneWidth,
    setRightPaneWidth,
  };
};

export default UIState();
