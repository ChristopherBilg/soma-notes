import { AuthUser, NullAuthUser } from "../../signal/auth.ts";

// Copyright 2023 Soma Notes
export type UserDataResponse = {
  ok: boolean;
  error: string | null;
  user: AuthUser;
};

export const NullUserDataResponse: UserDataResponse = {
  ok: false,
  error: null,
  user: NullAuthUser,
};
