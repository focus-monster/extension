import { useQuery } from '@tanstack/react-query';
import { Session } from './Popup';
import { useStorageSuspense } from '@extension/shared';
import { socialIdStorage } from '@extension/storage';

export function Character() {
  const socialId = useStorageSuspense(socialIdStorage);
  const { data } = useQuery<Session>({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch(`https://focusmonster.me:8080/users/${socialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    },
  });

  return (
    <div className="flex flex-col items-center grow justify-end pb-4 pt-2 w-40">
      <img src={CharacterImageString(data?.level)} className="w-24 aspect-auto" alt="" />
    </div>
  );
}
function CharacterImageString(level?: number) {
  if (!level) return '/0.png';
  if (level === 0) return '/0.png';
  if (level === 1) return '/1.png';
  if (level <= 5) return '/5.png';
  if (level <= 15) return '/15.png';
  if (level <= 30) return '/30.png';
  if (level <= 50) return '/50.png';
  if (level <= 70) return '/70.png';
  if (level <= 100) return '/100.png';
  if (level <= 150) return '/150.png';
  if (level <= 180) return '/180.png';
  return '/200.png';
}
