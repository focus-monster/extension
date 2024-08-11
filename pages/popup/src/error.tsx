import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

type ErrorContextType = {
  error: string | null;
  setError: (error: string | null) => void;
};

export const errorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const useError = () => {
  const { error, setError } = useContext(errorContext);

  return { error, setError };
};

export const ErrorProvider: FC<PropsWithChildren> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  return <errorContext.Provider value={{ error, setError }}>{children}</errorContext.Provider>;
};
