import { Note } from "./../signal/notes.ts";

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  const kv = await Deno.openKv();
  const notes = await kv.get(["notes", userId]);
  kv.close();

  return notes.value || [];
};

export const setNotesByUserId = async (userId: string, notes: Note[]) => {
  const kv = await Deno.openKv();
  const key = ["notes", userId];

  const res = await kv.atomic()
    .check({ key })
    .set(key, notes)
    .commit();
  kv.close();

  return res;
};
