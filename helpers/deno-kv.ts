import { Note } from "./../signal/notes.ts";

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  const kv = await Deno.openKv();
  const key = ["notes", userId];

  const notes = await kv.get(key);
  kv.close();

  return notes.value || [];
};

export const setNotesByUserId = async (userId: string, notes: Note[]) => {
  const kv = await Deno.openKv();
  const key = ["notes", userId];

  let res;
  if (notes.length === 0) await kv.delete(key);
  else await kv.set(key, notes);
  kv.close();

  return res;
};
