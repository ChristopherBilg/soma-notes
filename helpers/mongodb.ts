// Copyright 2023-Present Soma Notes
import { MongoClient, ObjectId } from "mongodb";
import { AuthProvider } from "../signal/auth.ts";
import { Journal } from "../signal/journals.ts";
import { Note } from "../signal/notes.ts";
import { Task } from "../signal/tasks.ts";

const getUri = (): string => {
  const usernameEnv = Deno.env.get("MONGODB_USERNAME");
  const passwordEnv = Deno.env.get("MONGODB_PASSWORD");
  const hostname = Deno.env.get("MONGODB_HOSTNAME");

  const authMechanism = "DEFAULT";

  if (!usernameEnv || !passwordEnv || !hostname) {
    throw new Error("Missing MongoDB environment variables");
  }

  const username = encodeURIComponent(usernameEnv);
  const password = encodeURIComponent(passwordEnv);

  return `mongodb+srv://${username}:${password}@${hostname}/?retryWrites=true&w=majority&authMechanism=${authMechanism}`;
};

export const getNotesByUserId = async (
  provider: AuthProvider,
  userId: string,
): Promise<Note[]> => {
  const client = new MongoClient(getUri());
  const notesCollection = client.db("soma-notes").collection("notes");
  const notes = await notesCollection.find({
    provider,
    userId,
  }).toArray();
  await client.close();

  return notes as unknown as Note[];
};

export const setNotesByUserId = async (
  provider: AuthProvider,
  userId: string,
  notes: Note[],
) => {
  // Manually add the "key" fields to each note
  const mongoNotes = notes.map((note) => ({
    provider,
    userId,
    _id: `${provider}-${userId}-${note.uuid}` as unknown as ObjectId,
    ...note,
  }));

  // Manually create the bulk write operations
  const mongoOps = mongoNotes.map((note) => {
    return {
      updateOne: {
        filter: { _id: note._id },
        update: { $set: note },
        upsert: true,
      },
    };
  });

  const client = new MongoClient(getUri());
  const notesCollection = client.db("soma-notes").collection("notes");
  await notesCollection.deleteMany({ provider, userId });
  if (mongoOps.length > 0) await notesCollection.bulkWrite(mongoOps);
  await client.close();
};

export const getJournalsByUserId = async (
  provider: AuthProvider,
  userId: string,
): Promise<Journal[]> => {
  const client = new MongoClient(getUri());
  const journalsCollection = client.db("soma-notes").collection("journals");
  const journals = await journalsCollection.find({
    provider,
    userId,
  }).toArray();
  await client.close();

  return journals as unknown as Journal[];
};

export const setJournalsByUserId = async (
  provider: AuthProvider,
  userId: string,
  journals: Journal[],
) => {
  // Manually add the "key" fields to each journal
  const mongoJournals = journals.map((journal) => ({
    provider,
    userId,
    _id: `${provider}-${userId}-${journal.uuid}` as unknown as ObjectId,
    ...journal,
  }));

  // Manually create the bulk write operations
  const mongoOps = mongoJournals.map((journal) => {
    return {
      updateOne: {
        filter: { _id: journal._id },
        update: { $set: journal },
        upsert: true,
      },
    };
  });

  const client = new MongoClient(getUri());
  const journalsCollection = client.db("soma-notes").collection("journals");
  await journalsCollection.deleteMany({ provider, userId });
  if (mongoOps.length > 0) await journalsCollection.bulkWrite(mongoOps);
  await client.close();
};

export const getTasksByUserId = async (
  provider: AuthProvider,
  userId: string,
): Promise<Task[]> => {
  const client = new MongoClient(getUri());
  const tasksCollection = client.db("soma-notes").collection("tasks");
  const tasks = await tasksCollection.find({
    provider,
    userId,
  }).toArray();
  await client.close();

  return tasks as unknown as Task[];
};

export const setTasksByUserId = async (
  provider: AuthProvider,
  userId: string,
  tasks: Task[],
) => {
  // Manually add the "key" fields to each task
  const mongoTasks = tasks.map((task) => ({
    provider,
    userId,
    _id: `${provider}-${userId}-${task.uuid}` as unknown as ObjectId,
    ...task,
  }));

  // Manually create the bulk write operations
  const mongoOps = mongoTasks.map((task) => {
    return {
      updateOne: {
        filter: { _id: task._id },
        update: { $set: task },
        upsert: true,
      },
    };
  });

  const client = new MongoClient(getUri());
  const tasksCollection = client.db("soma-notes").collection("tasks");
  await tasksCollection.deleteMany({ provider, userId });
  if (mongoOps.length > 0) await tasksCollection.bulkWrite(mongoOps);
  await client.close();
};
