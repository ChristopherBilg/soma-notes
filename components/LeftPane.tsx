interface LeftPaneProps {
  width: string;
}

export function LeftPane(props: LeftPaneProps) {
  return (
    <div
      class="p-2.5 bg-gray-300 rounded-l-lg"
      style={{ width: props.width }}
    >
      <h2>History</h2>
    </div>
  );
}
