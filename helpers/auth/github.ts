// Copyright 2023 Soma Notes
import { AuthProvider } from "../../signal/auth.ts";
import { NullUserDataResponse, UserDataResponse } from "./index.ts";

export const getGitHubUserData = async (
  accessToken: string,
): Promise<UserDataResponse> => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  if (!response.ok) {
    return {
      ...NullUserDataResponse,
      error: await response.text(),
    };
  }

  const userData = await response.json();
  if (!userData) {
    return {
      ...NullUserDataResponse,
      error: "User data not found in response.",
    };
  }

  return {
    ...NullUserDataResponse,
    ok: true,
    user: {
      provider: userData.provider as AuthProvider,
      userId: userData.id as string,
      userName: userData.login as string,
    },
  };
};
