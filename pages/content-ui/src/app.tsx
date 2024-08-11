import { useStorageSuspense, useAuth, type Session, useSessions } from '@extension/shared';
import { bannedSiteLogStorage, bannedSiteStorage, focusStorage } from '@extension/storage';
import { useEffect, useState } from 'react';
import { Auth, Character, FocusAction } from '@extension/ui';
import { useMutation } from '@tanstack/react-query';

export default function App() {
  const bannedSites = JSON.parse(useStorageSuspense(bannedSiteStorage)) as string[];
  const isFocus = JSON.parse(useStorageSuspense(focusStorage)) as boolean;
  const bannedSiteLog = JSON.parse(useStorageSuspense(bannedSiteLogStorage)) as {
    [key: string]: number;
  };
  const currentTab = new URL(window.location.href).hostname;

  if (!bannedSites) {
    console.log('no banned sites');
  }

  console.log('isFocus', isFocus);

  if (
    isFocus &&
    bannedSites.some(site => {
      return currentTab.includes(site);
    })
  ) {
    const bannedSite = bannedSites.find(site => currentTab.includes(site))!;

    bannedSiteLogStorage.set(
      JSON.stringify({ ...bannedSiteLog, [bannedSite]: bannedSiteLog[bannedSite] ? bannedSiteLog[bannedSite] + 1 : 1 }),
    );
    return (
      <div className="fixed top-0 inset-0 z-[9999999] isolate bg-blue-400/50 backdrop-blur-lg grid place-content-center"></div>
    );
  }
  return <></>;
}

export function SmallBox() {
  const { isFocusing, isLoading } = useSessions();

  useEffect(() => {
    focusStorage.set(JSON.stringify(isFocusing));
  }, [isFocusing]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{
        backgroundImage: 'url(/box-sm.png)',
        backgroundSize: 'cover',
        width: '610px',
        height: '270px',
      }}>
      <div className="w-full flex justify-end py-3.5 text-lg px-10">
        <Auth />
      </div>
      <div className="w-full flex flex-col items-center grow pt-4 overflow-hidden">
        {isFocusing ? (
          <>
            <Focusing />
          </>
        ) : (
          <>
            <FocusAction />
            <Character />
          </>
        )}
      </div>
    </div>
  );
}

function Focusing() {
  const { lastSession } = useSessions();

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(lastSession));

  useEffect(() => {
    const ref = setInterval(() => setTimeLeft(calculateTimeLeft(lastSession)), 1000);
    setTimeLeft(calculateTimeLeft(lastSession));
    return () => clearInterval(ref);
  }, [lastSession]);

  const { setError } = useError();

  const bannedSitesLog = JSON.parse(useStorageSuspense(bannedSiteStorage)) as { [key: string]: number };

  const { mutate } = useMutation({
    mutationKey: ['focus-end'],
    mutationFn: async (result: 'succeed' | 'fail') => {
      const res = await fetch('https://focusmonster.me:8080/focus/' + result, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialId: lastSession?.userSocialId,
          focusId: lastSession?.id,
          banedSitesAccessLog: Object.entries(bannedSitesLog).map(([name, count]) => ({ name, count })),
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: error => {
      console.log('error', error);
      setError(error.message);
    },
  });

  const isTimeEnded = timeLeft.hours < 0;

  function handleClick() {
    if (isTimeEnded) {
      mutate('succeed');
    } else {
      mutate('fail');
    }
  }

  return (
    <>
      <div className="text-xl font-semibold text-green-600">UNTIL LEVEL UP</div>
      <div className="text-6xl font-bold">
        {Math.abs(timeLeft.hours + (isTimeEnded ? 1 : 0))} h {Math.abs(timeLeft.minutes)} m
      </div>
      <div className="absolute left-14 bottom-0">
        <CharacterOverlay />
        <Character />
      </div>
      <div className="grow pr-10 pb-8 flex items-end w-full justify-end">
        <button
          onClick={handleClick}
          className={
            'text-white font-bold rounded-lg px-4 py-2 mt-4 text-lg transition-colors ' +
            (isTimeEnded ? 'bg-neutral-900 hover:bg-neutral-700' : 'bg-neutral-400 hover:bg-neutral-500')
          }>
          {isTimeEnded ? 'Finish Focusing' : 'Quit Focusing'}
        </button>
      </div>
    </>
  );
}

function CharacterOverlay() {
  const { data: auth } = useAuth();

  if ((auth?.level ?? 0) < 70) {
    return (
      <div
        className="w-fit px-4 py-2 absolute -left-8 -top-6"
        style={{
          backgroundImage: 'url(/word-bubble.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div className="font-bold text-base -rotate-6">Lv.{auth?.level ?? '?'}</div>
      </div>
    );
  }
  return (
    <div className="absolute w-28 aspect-auto">
      <img src="/overlay.png" alt="" />
    </div>
  );
}

function calculateTimeLeft(lastSession?: Session) {
  if (lastSession) {
    const duration = lastSession.duration.hours * 60 * 60 * 1000 + lastSession.duration.minutes * 60 * 1000;
    const elapsedTime =
      new Date().getTime() -
      new Date(lastSession.createdDateTime).getTime() +
      new Date(lastSession.createdDateTime).getTimezoneOffset() * 60 * 1000;

    const timeDiff = duration - elapsedTime;

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.ceil((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  }
  return { hours: 0, minutes: 0 };
}
