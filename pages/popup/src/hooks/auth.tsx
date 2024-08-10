import { useStorageSuspense } from '@extension/shared';
import { socialIdStorage } from '@extension/storage';
import { useQuery } from '@tanstack/react-query';

export type Auth = {
  id: number;
  nickname: string;
  email: string;
  socialId: string | null;
  job: string | null;
  successCount: number;
  anonymous: boolean;
  verified: boolean;
  token: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  focusStatus: string;
  level: number;
};

export function useAuth() {
  const socialId = useStorageSuspense(socialIdStorage);
  const query = useQuery<Auth>({
    queryKey: ['auth'],
    queryFn: async () => {
      console.log('socialId', socialId);
      if (socialId.length === 0) {
        return undefined;
      }
      const response = await fetch(`https://focusmonster.me:8080/users/${socialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    },
  });

  return { ...query };
}
