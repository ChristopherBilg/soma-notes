// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { getDateFromFormattedDay, getFormattedDay } from "../helpers/date.ts";
import { Day, UUID } from "../signal/common.ts";
import { CategoryTextColor, Frequency } from "../signal/tasks.ts";
import AnchorButton from "./AnchorButton.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import { AuthContext, TasksContext } from "./context/CommonContext.tsx";

const TasksViewer = () => {
  const { auth } = useContext(AuthContext);
  const { tasks, updateTask, deleteTask, tasksNetworkRequestPending } =
    useContext(
      TasksContext,
    );

  const tasksCompletedToday = tasks.value.filter((task) => {
    const today = getFormattedDay(new Date());
    const taskDay = task.lastCompletedAt;

    return today === taskDay;
  });

  const todaysTasks = tasks.value
    .filter((task) => {
      const today = getFormattedDay(new Date());
      const taskDay = task.nextDueAt;

      return today >= taskDay;
    })
    .sort((a, b) => {
      const taskA = a.content.toLowerCase();
      const taskB = b.content.toLowerCase();

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });

  const upcomingTasks = tasks.value
    .filter((task) => {
      const currentDate = new Date();

      const today = getFormattedDay(currentDate);
      const oneWeekFromToday = getFormattedDay(
        new Date(currentDate.setDate(currentDate.getDate() + 7)),
      );
      const taskDay = task.nextDueAt;

      return today !== taskDay && taskDay <= oneWeekFromToday &&
        taskDay > today;
    })
    .sort((a, b) => {
      const taskA = a.nextDueAt;
      const taskB = b.nextDueAt;

      return taskA < taskB ? -1 : taskA > taskB ? 1 : 0;
    });

  const handleCompleteTask =
    (uuid: UUID, nextDueAt: Day, frequency: Frequency) => () => {
      const lastCompletedAt = getFormattedDay(new Date());

      let newNextDueAt: Day;
      let exhaustiveCheck: never;
      switch (frequency) {
        case Frequency.OneTime:
          deleteTask(auth.value, uuid);
          break;
        case Frequency.Daily:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setDate(
                getDateFromFormattedDay(nextDueAt).getDate() + 1,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Weekdays: {
          const nextDueAtDate = getDateFromFormattedDay(nextDueAt);
          const nextDueAtDay = nextDueAtDate.getDay();

          let daysUntilWeekday: number;
          switch (nextDueAtDay) {
            // Sunday
            case 0:
              daysUntilWeekday = 1;
              break;
            // Monday
            case 1:
              daysUntilWeekday = 1;
              break;
            // Tuesday
            case 2:
              daysUntilWeekday = 1;
              break;
            // Wednesday
            case 3:
              daysUntilWeekday = 1;
              break;
            // Thursday
            case 4:
              daysUntilWeekday = 1;
              break;
            // Friday
            case 5:
              daysUntilWeekday = 3;
              break;
            // Saturday
            case 6:
              daysUntilWeekday = 2;
              break;
            default:
              daysUntilWeekday = 1;
              break;
          }

          newNextDueAt = getFormattedDay(
            new Date(
              nextDueAtDate.setDate(
                nextDueAtDate.getDate() + daysUntilWeekday,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        }
        case Frequency.Weekends: {
          const nextDueAtDate = getDateFromFormattedDay(nextDueAt);
          const nextDueAtDay = nextDueAtDate.getDay();

          let daysUntilWeekend: number;
          switch (nextDueAtDay) {
            // Sunday
            case 0:
              daysUntilWeekend = 6;
              break;
            // Monday
            case 1:
              daysUntilWeekend = 5;
              break;
            // Tuesday
            case 2:
              daysUntilWeekend = 4;
              break;
            // Wednesday
            case 3:
              daysUntilWeekend = 3;
              break;
            // Thursday
            case 4:
              daysUntilWeekend = 2;
              break;
            // Friday
            case 5:
              daysUntilWeekend = 1;
              break;
            // Saturday
            case 6:
              daysUntilWeekend = 1;
              break;
            default:
              daysUntilWeekend = 1;
              break;
          }

          newNextDueAt = getFormattedDay(
            new Date(
              nextDueAtDate.setDate(
                nextDueAtDate.getDate() + daysUntilWeekend,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        }
        case Frequency.Weekly:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setDate(
                getDateFromFormattedDay(nextDueAt).getDate() + 7,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Biweekly:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setDate(
                getDateFromFormattedDay(nextDueAt).getDate() + 14,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Monthly:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setMonth(
                getDateFromFormattedDay(nextDueAt).getMonth() + 1,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Bimonthly:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setMonth(
                getDateFromFormattedDay(nextDueAt).getMonth() + 2,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Quarterly:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setMonth(
                getDateFromFormattedDay(nextDueAt).getMonth() + 3,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Biannually:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setMonth(
                getDateFromFormattedDay(nextDueAt).getMonth() + 6,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        case Frequency.Annually:
          newNextDueAt = getFormattedDay(
            new Date(
              getDateFromFormattedDay(
                nextDueAt,
              ).setFullYear(
                getDateFromFormattedDay(nextDueAt).getFullYear() + 1,
              ),
            ),
          );

          updateTask(auth.value, uuid, {
            lastCompletedAt,
            nextDueAt: newNextDueAt,
          });
          break;
        default:
          exhaustiveCheck = frequency;
          console.error(`Unhandled frequency: ${exhaustiveCheck}`);
          break;
      }
    };

  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <NetworkRequestLoadingIcon hidden={!tasksNetworkRequestPending.value} />

      <h1 class="my-6 text-center text-xl font-bold">
        Today's Tasks
      </h1>

      {todaysTasks.length === 0
        ? (
          <p class="text-center">
            No tasks due today.
          </p>
        )
        : todaysTasks.map((task) => (
          <aside class="flex justify-between items-center p-2 m-2 border rounded">
            <p
              class={`
                text-lg mr-2
                ${
                task.nextDueAt !== getFormattedDay(new Date())
                  ? "text-red-500"
                  : ""
              }
              `}
            >
              <span style={{ color: CategoryTextColor[task.category] }}>
                ({task.category})
              </span>{" "}
              <b>({task.frequency})</b> {task.content}
            </p>

            <div class="flex">
              {task.nextDueAt !== getFormattedDay(new Date()) && (
                <p class="self-center mr-2 text-sm">{task.nextDueAt}</p>
              )}

              <AnchorButton
                title="Complete"
                onClick={handleCompleteTask(
                  task.uuid,
                  task.nextDueAt,
                  task.frequency,
                )}
                variant="success"
                rounded
              />
            </div>
          </aside>
        ))}

      <h1 class="my-6 text-center text-xl font-bold">
        Tasks Completed Today
      </h1>

      {tasksCompletedToday.length === 0
        ? (
          <p class="text-center">
            No tasks completed today.
          </p>
        )
        : tasksCompletedToday.map((task) => (
          <aside class="flex justify-between items-center p-2 m-2 border rounded">
            <p class="text-lg text-gray-500 mr-2">
              <span style={{ color: CategoryTextColor[task.category] }}>
                ({task.category})
              </span>{" "}
              <b>({task.frequency})</b> {task.content}
            </p>

            <p class="text-sm min-w-max">
              {task.lastCompletedAt}
            </p>
          </aside>
        ))}

      <h1 class="my-6 text-center text-xl font-bold">
        Upcoming Tasks
      </h1>

      {upcomingTasks.length === 0
        ? (
          <p class="text-center">
            No upcoming tasks.
          </p>
        )
        : upcomingTasks.map((task) => (
          <aside class="flex justify-between items-center p-2 m-2 border rounded">
            <p class="text-lg mr-2">
              <span style={{ color: CategoryTextColor[task.category] }}>
                ({task.category})
              </span>{" "}
              <b>({task.frequency})</b> {task.content}
            </p>

            <p class="text-sm min-w-max">
              {task.nextDueAt}
            </p>
          </aside>
        ))}
    </div>
  );
};

export default TasksViewer;
