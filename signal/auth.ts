// Copyright 2023 Soma Notes
import { Signal, signal } from "@preact/signals";

export enum AuthProvider {
  Google = "google",
  GitHub = "github",
}

export type AuthUser = {
  provider: AuthProvider | null;
  userId: string | null;
  userName: string | null;
};

export type AuthStateType = {
  auth: Signal<AuthUser>;
  setAuth: (newAuth: AuthUser) => void;
  clearAuth: () => void;
};

export const NullAuthUser: AuthUser = {
  provider: null,
  userId: null,
  userName: null,
};

const AuthState = (): AuthStateType => {
  const auth = signal<AuthUser>(NullAuthUser);

  const setAuth = (newAuth: AuthUser) => {
    auth.value = newAuth;
  };

  const clearAuth = () => {
    auth.value = NullAuthUser;
  };

  return { auth, setAuth, clearAuth };
};

export default AuthState();
