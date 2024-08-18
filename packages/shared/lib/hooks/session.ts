import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useStorageSuspense } from './';
import { socialIdStorage } from '@extension/storage';

export type Session = {
  id: number;
  userSocialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  resultDuration: {
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
  level: number;
};

export function useSessions() {
  const socialId = useStorageSuspense(socialIdStorage);

  const query = useQuery<Session[]>({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch(`https://focusmonster.me:8080/focus?socialId=${socialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
