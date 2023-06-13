import { Signal, signal } from "@preact/signals";

export interface Auth {
  userId: string | null;
  userName: string | null;
  avatarUrl: string | null;
}

export type AuthStateType = {
  auth: Signal<Auth>;
  setAuth: (newAuth: Auth) => void;
  clearAuth: () => void;
};

const NullAuth: Auth = {
  userId: null,
  userName: null,
  avatarUrl: null,
};

const AuthState = (): AuthStateType => {
  const auth = signal<Auth>(NullAuth);

  const setAuth = (newAuth: Auth) => {
    auth.value = newAuth;
  };

  const clearAuth = () => {
    auth.value = NullAuth;
  };

  return { auth, setAuth, clearAuth };
};

export default AuthState();
