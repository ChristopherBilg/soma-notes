// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import {
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
  MAX_FREE_JOURNAL_CONTENT_LENGTH,
  MAX_FREE_JOURNAL_COUNT,
  MAX_PREMIUM_JOURNAL_CONTENT_LENGTH,
  MAX_PREMIUM_JOURNAL_COUNT,
  MAX_PROFESSIONAL_JOURNAL_CONTENT_LENGTH,
  MAX_PROFESSIONAL_JOURNAL_COUNT,
} from "../helpers/constants.ts";
import { AuthUser, Subscription } from "./auth.ts";
import { Day, UUID } from "./common.ts";

export type Journal = {
  uuid: UUID;
  date: Day;
  content: string;
  createdAt: number;
  updatedAt: number;
};

const NullJournal: Journal = {
  uuid: "",
  date: "",
  content: "",
  createdAt: 0,
  updatedAt: 0,
};

const NEW_JOURNAL_CONTENT = `\
Life

- [ ] TODO

Work

- TODO\
`;

export type JournalsStateType = {
  journals: Signal<Journal[]>;
  journalsNetworkRequestPending: Signal<boolean>;

  setupJournals: (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => Promise<void>;
  setJournals: (user: AuthUser, journals: Journal[]) => void;
  createJournal: (
    user: AuthUser,
    date: Day,
  ) => void;
  updateJournal: (
    user: AuthUser,
    date: Day,
    options?: {
      content?: string;
    },
  ) => void;
  deleteJournal: (user: AuthUser, date: Day) => void;
  deleteAllJournals: (user: AuthUser) => void;
};

const debouncedSaveJournalsToDenoKV = debounce(
  async (
    user: AuthUser,
    journals: Journal[],
    saveFailureCallbackFunc: () => void,
    requestStartCallbackFunc: () => void,
    requestEndCallbackFunc: () => void,
  ) => {
    requestStartCallbackFunc();

    const response = await fetch("/api/journals", {
      method: "POST",
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
      body: JSON.stringify(journals),
    });

    if (!response.ok) saveFailureCallbackFunc();

    requestEndCallbackFunc();
  },
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
);

export const getMaxJournalCount = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_JOURNAL_COUNT;
    case Subscription.Premium:
      return MAX_PREMIUM_JOURNAL_COUNT;
    case Subscription.Free:
      return MAX_FREE_JOURNAL_COUNT;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

export const getMaxJournalLength = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_JOURNAL_CONTENT_LENGTH;
    case Subscription.Premium:
      return MAX_PREMIUM_JOURNAL_CONTENT_LENGTH;
    case Subscription.Free:
      return MAX_FREE_JOURNAL_CONTENT_LENGTH;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

const JournalsState = (): JournalsStateType => {
  const journals = signal<Journal[]>([]);
  const journalsNetworkRequestPending = signal<boolean>(false);
  let saveFailureCallbackFunc_: () => void;

  const setJournalsNetworkRequestPending =
    (isNetworkRequestPending: boolean) => () =>
      journalsNetworkRequestPending.value = isNetworkRequestPending;

  // Application State Persistence (load) and callbacks
  const setupJournals = async (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => {
    setJournalsNetworkRequestPending(true)();

    saveFailureCallbackFunc_ = saveFailureCallbackFunc;

    const response = await fetch("/api/journals", {
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
    });

    if (!response.ok) return loadFailureCallbackFunc();

    const loadedJournals: Journal[] = await response.json();
    journals.value = loadedJournals;

    setJournalsNetworkRequestPending(false)();
  };

  const setJournals = (user: AuthUser, newJournals: Journal[]) => {
    journals.value = [
      ...journals.value,
      ...newJournals.map((n) => ({
        ...n,
        content: n.content.substring(0, getMaxJournalLength(user.subscription)),
      })),
    ];

    // Application State Persistence (save)
    debouncedSaveJournalsToDenoKV(
      user,
      journals.value,
      saveFailureCallbackFunc_,
      setJournalsNetworkRequestPending(true),
      setJournalsNetworkRequestPending(false),
    );
  };

  const createJournal = (user: AuthUser, date: Day) => {
    if (journals.value.length > getMaxJournalCount(user.subscription)) {
      return undefined;
    }

    const now = new Date().getTime();
    const uuid = crypto.randomUUID();

    const journal: Journal = {
      ...NullJournal,
      uuid,
      date,
      content: NEW_JOURNAL_CONTENT,
      createdAt: now,
      updatedAt: now,
    };

    journals.value = [...journals.value, journal];

    // Application State Persistence (save)
    debouncedSaveJournalsToDenoKV(
      user,
      journals.value,
      saveFailureCallbackFunc_,
      setJournalsNetworkRequestPending(true),
      setJournalsNetworkRequestPending(false),
    );
  };

  const updateJournal = (
    user: AuthUser,
    date: Day,
    options?: {
      content?: string;
    },
  ) => {
    const existingJournal = journals.value.find((journal: Journal) =>
      journal.date === date
    );
    if (!existingJournal) return;

    existingJournal.updatedAt = new Date().getTime();
    if (options?.content !== undefined) {
      existingJournal.content = options?.content.substring(
        0,
        getMaxJournalLength(user.subscription),
      );
    }

    journals.value = journals.value.map((journal: Journal) => {
      if (journal.date === existingJournal.date) return existingJournal;

      return journal;
    });

    // Application State Persistence (save)
    debouncedSaveJournalsToDenoKV(
      user,
      journals.value,
      saveFailureCallbackFunc_,
      setJournalsNetworkRequestPending(true),
      setJournalsNetworkRequestPending(false),
    );
  };

  const deleteJournal = (user: AuthUser, date: Day) => {
    journals.value = journals.value
      .filter((journal: Journal) => journal.date !== date);

    // Application State Persistence (save)
    debouncedSaveJournalsToDenoKV(
      user,
      journals.value,
      saveFailureCallbackFunc_,
      setJournalsNetworkRequestPending(true),
      setJournalsNetworkRequestPending(false),
    );
  };

  const deleteAllJournals = (user: AuthUser) => {
    journals.value = [];

    // Application State Persistence (save)
    debouncedSaveJournalsToDenoKV(
      user,
      journals.value,
      saveFailureCallbackFunc_,
      setJournalsNetworkRequestPending(true),
      setJournalsNetworkRequestPending(false),
    );
  };

  return {
    journals,
    journalsNetworkRequestPending,

    setupJournals,
    setJournals,
    createJournal,
    updateJournal,
    deleteJournal,
    deleteAllJournals,
  };
};

export default JournalsState();
