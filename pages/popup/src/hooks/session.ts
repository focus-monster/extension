import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import { useMemo } from 'react';

export type Session = {
  id: number;
  userSocialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  banedSiteAccessLog: {
    name: string;
    count: number;
  }[];
  history: string[];
  focusStatus: string;
  image: string;
  evaluation: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

export function useSessions() {
  const { data: auth } = useAuth();

  const query = useQuery<Session[]>({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch(`/api/focus?socialId=${auth?.socialId}`);
      const data = await response.json();
      return data as Session[];
    },
  });

  const todaysSessions = useMemo(
    () =>
      query?.data?.filter(session => {
        return new Date().getTime() - new Date(session.createdDateTime).getTime() < 24 * 60 * 60 * 1000;
      }),
    [query.data],
  );

  const lastSession = todaysSessions?.at(-1);
  const currentFocusId = lastSession ? (lastSession?.focusStatus === 'FOCUSING' ? lastSession.id : null) : undefined;
  const isFocusing = useMemo(() => lastSession?.focusStatus === 'FOCUSING', [lastSession]);

  return { ...query, currentFocusId, isFocusing, todaysSessions, lastSession };
}
