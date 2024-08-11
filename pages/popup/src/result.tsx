import { type Session } from '@extension/shared';
import { FC, PropsWithChildren, createContext, useContext, useState } from 'react';

type ResultContextType = {
  result: Session | null;
  setResult: (data: Session | null) => void;
};

export const resultContext = createContext<ResultContextType>({
  result: null,
  setResult: () => {},
});

export const useResult = () => {
  const { result, setResult } = useContext(resultContext);

  return { result, setResult };
};

export const ResultProvider: FC<PropsWithChildren> = ({ children }) => {
  const [result, setResult] = useState<Session | null>(null);

  return <resultContext.Provider value={{ result, setResult }}>{children}</resultContext.Provider>;
};
