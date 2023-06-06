import Counter from "../islands/Counter.tsx";

export default function Index() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <p class="my-6">
        Welcome to{" "}
        <b>Soma Notes</b>. This is a simple, global, low-latency note keeping
        application.
      </p>
      <Counter start={0} />
    </div>
  );
}
