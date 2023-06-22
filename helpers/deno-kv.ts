import { Note } from "./../signal/notes.ts";

type AuthMethod = 'github';
type DenoKVNotesKey = ["notes", AuthMethod, string];

const getNotesKey = (authMethod: AuthMethod, userId: string): DenoKVNotesKey => {
  return ["notes", authMethod, userId];
};

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  const kv = await Deno.openKv();
  const key = getNotesKey("github", userId);

  const notes = await kv.get(key);
  kv.close();

  return notes.value || [];
};

export const setNotesByUserId = async (userId: string, notes: Note[]) => {
  const kv = await Deno.openKv();
  const key = getNotesKey("github", userId);

  let res;
  if (notes.length === 0) await kv.delete(key);
  else await kv.set(key, notes);
  kv.close();

  return res;
};
