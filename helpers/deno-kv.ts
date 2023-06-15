import { Note } from "./../signal/notes.ts";

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  const kv = await openKv();
  const key = ["notes", userId];

  const notes = await kv.get(key);
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
