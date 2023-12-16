// Copyright 2023-Present Soma Notes
import AnchorButton from "./AnchorButton.tsx";

type NavigationButtonsProps = {
  primary:
    | "notes"
    | "journals"
    | "tasks"
    | "settings"
    | "statistics"
    | "task-settings";
};

const NavigationButtons = ({ primary }: NavigationButtonsProps) => {
  return (
    <>
      <div class="flex justify-center m-4">
        <AnchorButton
          href="/notes"
          title="Notes"
          variant={primary === "notes" ? "primary" : undefined}
          roundedLeft
        />

        <AnchorButton
          href="/journals"
          title="Journals"
          variant={primary === "journals" ? "primary" : undefined}
        />

        <AnchorButton
          href="/tasks"
          title="Tasks"
          variant={primary === "tasks" ? "primary" : undefined}
        />

        <AnchorButton
          href="/user/settings"
          title="Settings"
          variant={primary === "settings" ? "primary" : undefined}
        />

        <AnchorButton
          href="/api/signout"
          title="Signout"
          variant="danger"
          roundedRight
        />
      </div>

      <div class="flex justify-center m-4">
        <AnchorButton
          href="/user/statistics"
          title="Statistics"
          variant={primary === "statistics" ? "primary" : undefined}
          roundedLeft
        />

        <AnchorButton
          href="/user/tasks"
          title="Task Settings"
          variant={primary === "task-settings" ? "primary" : undefined}
          roundedRight
        />
      </div>
    </>
  );
};

export default NavigationButtons;
