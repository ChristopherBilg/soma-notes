// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import {
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
  MAX_FREE_TASK_CONTENT_LENGTH,
  MAX_FREE_TASK_COUNT,
  MAX_PREMIUM_TASK_CONTENT_LENGTH,
  MAX_PREMIUM_TASK_COUNT,
  MAX_PROFESSIONAL_TASK_CONTENT_LENGTH,
  MAX_PROFESSIONAL_TASK_COUNT,
} from "../helpers/constants.ts";
import { getFormattedDayDiff } from "../helpers/date.ts";
import { AuthUser, Subscription } from "./auth.ts";
import { Day, UUID } from "./common.ts";

export enum Frequency {
  OneTime = "OneTime",
  Daily = "Daily",
  Weekdays = "Weekdays",
  Weekends = "Weekends",
  Weekly = "Weekly",
  Biweekly = "Biweekly",
  Monthly = "Monthly",
  Bimonthly = "Bimonthly",
  Quarterly = "Quarterly",
  Biannually = "Biannually",
  Annually = "Annually",
}

export enum Category {
  Finance = "Finance",
  General = "General",
  Health = "Health",
  House = "House",
  Other = "Other",
  Pets = "Pets",
  School = "School",
  Vehicles = "Vehicles",
  Work = "Work",
}

export enum CategoryTextColor {
  Finance = "#F87171",
  General = "#FBBF24",
  Health = "#34D399",
  House = "#60A5FA",
  Other = "#818CF8",
  Pets = "#A78BFA",
  School = "#EC4899",
  Vehicles = "#F472B6",
  Work = "#F97316",
}

export type Task = {
  uuid: UUID;
  content: string;
  lastCompletedAt: Day;
  nextDueAt: Day;
  frequency: Frequency;
  category: Category;
  createdAt: number;
  updatedAt: number;
};

const NullTask: Task = {
  uuid: "",
  content: "",
  lastCompletedAt: "",
  nextDueAt: "",
  frequency: Frequency.Daily,
  category: Category.General,
  createdAt: 0,
  updatedAt: 0,
};

export type TasksStateType = {
  tasks: Signal<Task[]>;
  tasksNetworkRequestPending: Signal<boolean>;

  setupTasks: (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => Promise<void>;
  setTasks: (user: AuthUser, tasks: Task[]) => void;
  createTask: (user: AuthUser) => void;
  updateTask: (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      lastCompletedAt?: Day;
      nextDueAt?: Day;
      frequency?: Frequency;
      category?: Category;
    },
  ) => void;
  deleteTask: (user: AuthUser, uuid: UUID) => void;
  deleteAllTasks: (user: AuthUser) => void;
};

const debouncedSaveTasksToDenoKV = debounce(
  async (
    user: AuthUser,
    tasks: Task[],
    saveFailureCallbackFunc: () => void,
    requestStartCallbackFunc: () => void,
    requestEndCallbackFunc: () => void,
  ) => {
    requestStartCallbackFunc();

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) saveFailureCallbackFunc();

    requestEndCallbackFunc();
  },
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
);

export const getMaxTaskCount = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_TASK_COUNT;
    case Subscription.Premium:
      return MAX_PREMIUM_TASK_COUNT;
    case Subscription.Free:
      return MAX_FREE_TASK_COUNT;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

export const getMaxTaskLength = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_TASK_CONTENT_LENGTH;
    case Subscription.Premium:
      return MAX_PREMIUM_TASK_CONTENT_LENGTH;
    case Subscription.Free:
      return MAX_FREE_TASK_CONTENT_LENGTH;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

const TasksState = (): TasksStateType => {
  const tasks = signal<Task[]>([]);
  const tasksNetworkRequestPending = signal<boolean>(false);
  let saveFailureCallbackFunc_: () => void;

  const setTasksNetworkRequestPending =
    (isNetworkRequestPending: boolean) => () =>
      tasksNetworkRequestPending.value = isNetworkRequestPending;

  // Application State Persistence (load) and callbacks
  const setupTasks = async (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => {
    setTasksNetworkRequestPending(true)();

    saveFailureCallbackFunc_ = saveFailureCallbackFunc;

    const response = await fetch("/api/tasks", {
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
    });

    if (!response.ok) return loadFailureCallbackFunc();

    const loadedTasks: Task[] = await response.json();
    tasks.value = loadedTasks;

    setTasksNetworkRequestPending(false)();
  };

  const setTasks = (user: AuthUser, newTasks: Task[]) => {
    tasks.value = [
      ...tasks.value,
      ...newTasks.map((n) => ({
        ...n,
        content: n.content.substring(0, getMaxTaskLength(user.subscription)),
      })),
    ];

    // Application State Persistence (save)
    debouncedSaveTasksToDenoKV(
      user,
      tasks.value,
      saveFailureCallbackFunc_,
      setTasksNetworkRequestPending(true),
      setTasksNetworkRequestPending(false),
    );
  };

  const createTask = (user: AuthUser) => {
    if (tasks.value.length > getMaxTaskCount(user.subscription)) {
      return undefined;
    }

    const now = new Date().getTime();
    const uuid = crypto.randomUUID();

    const task: Task = {
      ...NullTask,
      uuid,
      lastCompletedAt: "",
      nextDueAt: getFormattedDayDiff(new Date(), 1),
      createdAt: now,
      updatedAt: now,
    };

    tasks.value = [...tasks.value, task];

    // Application State Persistence (save)
    debouncedSaveTasksToDenoKV(
      user,
      tasks.value,
      saveFailureCallbackFunc_,
      setTasksNetworkRequestPending(true),
      setTasksNetworkRequestPending(false),
    );
  };

  const updateTask = (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      lastCompletedAt?: Day;
      nextDueAt?: Day;
      frequency?: Frequency;
      category?: Category;
    },
  ) => {
    const existingTask = tasks.value.find((task: Task) => task.uuid === uuid);
    if (!existingTask) return;

    existingTask.updatedAt = new Date().getTime();
    if (options?.content !== undefined) {
      existingTask.content = options?.content.substring(
        0,
        getMaxTaskLength(user.subscription),
      );
    }
    if (options?.lastCompletedAt !== undefined) {
      existingTask.lastCompletedAt = options?.lastCompletedAt;
    }
    if (options?.nextDueAt !== undefined) {
      existingTask.nextDueAt = options?.nextDueAt;
    }
    if (options?.frequency !== undefined) {
      existingTask.frequency = options?.frequency;
    }
    if (options?.category !== undefined) {
      existingTask.category = options?.category;
    }

    tasks.value = tasks.value.map((task: Task) => {
      if (task.uuid === existingTask.uuid) return existingTask;

      return task;
    });

    // Application State Persistence (save)
    debouncedSaveTasksToDenoKV(
      user,
      tasks.value,
      saveFailureCallbackFunc_,
      setTasksNetworkRequestPending(true),
      setTasksNetworkRequestPending(false),
    );
  };

  const deleteTask = (user: AuthUser, uuid: UUID) => {
    tasks.value = tasks.value
      .filter((task: Task) => task.uuid !== uuid);

    // Application State Persistence (save)
    debouncedSaveTasksToDenoKV(
      user,
      tasks.value,
      saveFailureCallbackFunc_,
      setTasksNetworkRequestPending(true),
      setTasksNetworkRequestPending(false),
    );
  };

  const deleteAllTasks = (user: AuthUser) => {
    tasks.value = [];

    // Application State Persistence (save)
    debouncedSaveTasksToDenoKV(
      user,
      tasks.value,
      saveFailureCallbackFunc_,
      setTasksNetworkRequestPending(true),
      setTasksNetworkRequestPending(false),
    );
  };

  return {
    tasks,
    tasksNetworkRequestPending,

    setupTasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
  };
};

export default TasksState();
