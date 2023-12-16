// Copyright 2023-Present Soma Notes
import { Signal, signal } from "@preact/signals";

export enum AuthProvider {
  Null = "null",
  GitHub = "github",
}

export enum Subscription {
  Free = "free",
  Premium = "premium",
  Professional = "professional",
}

export type AuthUser = {
  provider: AuthProvider;
  userId: string | null;
  userName: string | null;
  avatarUrl: string | null;
  subscription: Subscription;
};

export type AuthStateType = {
  auth: Signal<AuthUser>;
  setAuth: (newAuth: AuthUser) => void;
  clearAuth: () => void;
};

export const NullAuthUser: AuthUser = {
  provider: AuthProvider.Null,
  userId: null,
  userName: null,
  avatarUrl: null,
  subscription: Subscription.Free,
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
