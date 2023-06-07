import DoublePane from "../islands/DoublePane.tsx";

export default function Index() {
  return (
    <div class="p-4 mx-auto max-w-screen-lg">
      <h1 class="my-6 text-center">
        Welcome to{" "}
        <b>Soma Notes</b>. This is a simple, global, low-latency note keeping
        application.
      </h1>
      <DoublePane
        minLeftWidth={200}
        minRightWidth={200}
      />
    </div>
  );
}
