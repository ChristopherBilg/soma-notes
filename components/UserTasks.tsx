// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { UUID } from "../signal/common.ts";
import { Category, Frequency, getMaxTaskLength } from "../signal/tasks.ts";
import AnchorButton from "./AnchorButton.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import {
  AuthContext,
  TasksContext,
  UIContext,
} from "./context/CommonContext.tsx";

const UserTasks = () => {
  const { auth } = useContext(AuthContext);
  const {
    tasks,
    createTask,
    deleteTask,
    updateTask,
    tasksNetworkRequestPending,
  } = useContext(TasksContext);
  const { addToast } = useContext(UIContext);

  const handleCreateTaskButtonClick = () => {
    createTask(auth.value);
  };

  const handleDeleteTaskButtonClick = (uuid: UUID) => () => {
    addToast("Are you sure you want to delete this task?", {
      callback: () => {
        deleteTask(auth.value, uuid);
        addToast("Task deleted.");
      },
    });
  };

  const handleInput = (uuid: UUID) => (e: Event) => {
    if (!auth.value.userId) return;

    const target = e.target as HTMLInputElement;
    let content = target.value;

    const maxTaskContentLength = getMaxTaskLength(auth.value.subscription);
    if (content.length >= maxTaskContentLength) {
      addToast(
        `Task content is too long, max length is ${maxTaskContentLength} characters`,
      );
      content = content.substring(0, maxTaskContentLength);
    }

    updateTask(auth.value, uuid, { content });
  };

  const handleCategoryChange = (e: Event, uuid: UUID) => {
    if (!auth.value.userId) return;

    const target = e.target as HTMLSelectElement;
    const category = target.value as Category;

    updateTask(auth.value, uuid, { category });
  };

  const handleFrequencyChange = (e: Event, uuid: UUID) => {
    if (!auth.value.userId) return;

    const target = e.target as HTMLSelectElement;
    const frequency = target.value as Frequency;

    updateTask(auth.value, uuid, { frequency });
  };

  const handleDateChange = (e: Event, uuid: UUID) => {
    if (!auth.value.userId) return;

    const target = e.target as HTMLSelectElement;
    const newDate = target.value;

    updateTask(auth.value, uuid, { nextDueAt: newDate });
  };

  return (
    <div class="p-4 my-2 mx-auto w-full max-w-screen-xl">
      <NetworkRequestLoadingIcon hidden={!tasksNetworkRequestPending.value} />

      <div class="flex justify-between">
        <h1 class="text-2xl font-bold my-auto">
          Tasks: {tasks.value.length}
        </h1>

        <div class="my-auto">
          <AnchorButton
            title="Create Task [+]"
            onClick={handleCreateTaskButtonClick}
            rounded
            variant="success"
          />
        </div>
      </div>

      <div class="flex flex-col">
        {tasks.value
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((task) => (
            <div class="flex flex-col lg:flex-row justify-between my-2">
              <input
                class="border-2 border-gray-300 bg-transparent rounded-md px-2 py-1 my-auto resize-none"
                placeholder="Add a task"
                type="text"
                value={task.content}
                onInput={handleInput(task.uuid)}
                spellcheck={false}
              />

              <div class="flex flex-col justify-center">
                <label
                  for="category"
                  class="mx-auto text-lg font-bold"
                >
                  Category:
                </label>

                <select
                  name="category"
                  value={task.category}
                  onChange={(e) => handleCategoryChange(e, task.uuid)}
                >
                  {Object.values(Category).map((category) => (
                    <option value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div class="flex flex-col justify-center">
                <label
                  for="frequency"
                  class="mx-auto text-lg font-bold"
                >
                  Frequency:
                </label>

                <select
                  name="frequency"
                  value={task.frequency}
                  onChange={(e) => handleFrequencyChange(e, task.uuid)}
                >
                  {Object.values(Frequency).map((frequency) => (
                    <option value={frequency}>{frequency}</option>
                  ))}
                </select>
              </div>

              <div>
                <div class="flex justify-end my-auto self-center mb-1">
                  <label
                    for="last-completed-at"
                    class="mr-2 text-lg font-bold"
                  >
                    Last Completed At:
                  </label>

                  <input
                    name="last-completed-at"
                    type="date"
                    class="border border-gray-300 rounded-md px-2 py-1"
                    value={task.lastCompletedAt}
                    disabled
                  />
                </div>

                <div class="flex justify-end my-auto self-center">
                  <label
                    for="next-due-at"
                    class="mr-2 text-lg font-bold"
                  >
                    Next Due At:
                  </label>

                  <input
                    name="next-due-at"
                    type="date"
                    class="border border-gray-300 rounded-md px-2 py-1"
                    value={task.nextDueAt}
                    onChange={(e) => handleDateChange(e, task.uuid)}
                  />
                </div>
              </div>

              <div class="my-auto">
                <AnchorButton
                  title="Delete Task [-]"
                  onClick={handleDeleteTaskButtonClick(task.uuid)}
                  rounded
                  variant="danger"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserTasks;
