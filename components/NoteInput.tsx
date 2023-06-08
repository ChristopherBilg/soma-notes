interface NoteInputProps {
  value: string;
  onInput: (value: string) => void;
}

export const NoteInput = (props: NoteInputProps) => {
  return (
    <input
      class="border-2 border-gray-400 rounded-md w-full"
      placeholder="New note"
      type="text"
      value={props.value}
      onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
    />
  );
};
