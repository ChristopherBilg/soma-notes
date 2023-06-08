export interface Note {
  uuid: string;
  content: string;
  parent: string | null;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}
