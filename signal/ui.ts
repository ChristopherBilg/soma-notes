// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import {
  DEFAULT_LEFT_PANE_WIDTH,
  TOAST_MAX_COUNT,
  TOAST_TIMEOUT_MILLIS,
  UI_UPDATE_DEBOUNCE_TIME_MILLIS,
} from "../helpers/constants.ts";
import { UUID } from "./common.ts";

type TextareaSelection = {
  selectedText: string;
  offsetTop: number;
  offsetLeft: number;
  uuid: UUID;
};

export type Toast = {
  uuid: UUID;
  message: string;
  timeout?: number;
  callback?: () => void;
};

export type UIStateType = {
  loadUIState: () => void;

  leftPaneWidth: Signal<string>;
  setLeftPaneWidth: (newLeftPaneWidth: string) => void;

  textareaSelection: Signal<TextareaSelection>;
  setTextareaSelection: (
    selectedText: string,
    offsetTop: number,
    offsetLeft: number,
    uuid: UUID,
  ) => void;

  toasts: Signal<Toast[]>;
  addToast: (message: string, options?: {
    timeout?: number;
    callback?: () => void;
  }) => void;
  removeToast: (uuid: UUID) => void;
};

const debouncedSaveUIStateToLocalStorage = debounce(
  (leftPaneWidth: string) => {
    localStorage.setItem("soma-notes-ui-left-pane-width", leftPaneWidth);
  },
  UI_UPDATE_DEBOUNCE_TIME_MILLIS,
);

const UIState = (): UIStateType => {
  const loadUIState = () => {
    const savedLeftPaneWidth = localStorage.getItem(
      "soma-notes-ui-left-pane-width",
    );

    if (savedLeftPaneWidth) setLeftPaneWidth(savedLeftPaneWidth);
  };

  const leftPaneWidth = signal<string>(DEFAULT_LEFT_PANE_WIDTH);
  const setLeftPaneWidth = (newLeftPaneWidth: string) => {
    leftPaneWidth.value = newLeftPaneWidth;

    debouncedSaveUIStateToLocalStorage(newLeftPaneWidth);
  };

  const textareaSelection = signal<TextareaSelection>({
    selectedText: "",
    offsetTop: 0,
    offsetLeft: 0,
    uuid: "",
  });
  const setTextareaSelection = (
    selectedText: string,
    offsetTop: number,
    offsetLeft: number,
    uuid: UUID,
  ) => {
    textareaSelection.value = {
      selectedText,
      offsetTop,
      offsetLeft,
      uuid,
    };
  };

  const toasts = signal<Toast[]>([]);
  const addToast = (
    message: string,
    options?: { timeout?: number; callback?: () => void },
  ) => {
    const newToast = {
      uuid: crypto.randomUUID(),
      message,
      timeout: options?.timeout ?? TOAST_TIMEOUT_MILLIS,
      callback: options?.callback,
    };

    if (toasts.value.length >= TOAST_MAX_COUNT) {
      toasts.value = toasts.value.slice(1);
    }

    setTimeout(() => {
      removeToast(newToast.uuid);
    }, newToast.timeout);

    toasts.value = [...toasts.value, newToast];
  };
  const removeToast = (uuid: UUID) => {
    toasts.value = toasts.value.filter((toast) => toast.uuid !== uuid);
  };

  return {
    loadUIState,

    leftPaneWidth,
    setLeftPaneWidth,

    textareaSelection,
    setTextareaSelection,

    toasts,
    addToast,
    removeToast,
  };
};

export default UIState();
