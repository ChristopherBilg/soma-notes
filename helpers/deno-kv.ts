// Copyright 2023 Soma Notes
import { AuthProvider, AuthUser } from "../signal/auth.ts";
import { Note } from "./../signal/notes.ts";

type DenoKVNotesKey = ["notes", AuthProvider, string];

const getNotesKey = (
  provider: AuthProvider,
  userId: string,
): DenoKVNotesKey => {
  return ["notes", provider, String(userId)];
};

export const getNotesByUser = async (user: AuthUser): Promise<Note[]> => {
  // @ts-ignore Property openKv does indeed exist on type 'typeof Deno'
  const kv = await Deno.openKv();
  const key = getNotesKey(
    user.provider || AuthProvider.GitHub,
    user.userId || "",
  );

  const notes = await kv.get(key);
  kv.close();

  return notes.value || [];
};

export const setNotesByUser = async (user: AuthUser, notes: Note[]) => {
  // @ts-ignore Property openKv does indeed exist on type 'typeof Deno'
  const kv = await Deno.openKv();
  const key = getNotesKey(
    user.provider || AuthProvider.GitHub,
    user.userId || "",
  );

  await kv.set(key, notes);
  kv.close();
};
