import { Signal, signal } from "@preact/signals";

export type UIStateType = {
  searchField: Signal<string>;
  setSearchField: (newSearchField: string) => void;
};

const UIState = (): UIStateType => {
  const searchField = signal<string>("");

  const setSearchField = (newSearchField: string) => {
    searchField.value = newSearchField;
  };

  return { searchField, setSearchField };
};

export default UIState();
