// Copyright 2023-Present Soma Notes
import { ComponentChild, createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

type URLSearchParamsContextType = {
  searchParams: URLSearchParams;
  updateSearchParams: (key: string, value: string) => void;
};

const SearchParamsContext = createContext<
  URLSearchParamsContextType | undefined
>(undefined);

type URLSearchParamsProviderProps = {
  children: ComponentChild;
};

export const URLSearchParamsProvider = (
  { children }: URLSearchParamsProviderProps,
) => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location?.search),
  );

  useEffect(() => {
    if (!searchParams) return;

    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, "", url.toString());
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value) newSearchParams.set(key, value);
    else newSearchParams.delete(key);

    setSearchParams(newSearchParams);
  };

  return (
    <SearchParamsContext.Provider value={{ searchParams, updateSearchParams }}>
      {children}
    </SearchParamsContext.Provider>
  );
};

export const useURLSearchParams = (): URLSearchParamsContextType => {
  const context = useContext(SearchParamsContext);

  if (!context) {
    throw new Error(
      "useURLSearchParams must be used within a URLSearchParamsProvider",
    );
  }

  return context;
};
