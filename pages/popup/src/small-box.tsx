import { useEffect, useState } from 'react';
import { Auth } from './auth-button';
import { Character } from './character';
import { FocusAction } from './focus-action';
import { Session, useSessions } from './hooks/session';
import { useAuth } from './hooks/auth';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '.';

export function SmallBox() {
  const { isFocusing } = useSessions();

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
  const [error, setError] = useState('');

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(lastSession));

  useEffect(() => {
    const ref = setInterval(() => setTimeLeft(() => calculateTimeLeft(lastSession)), 1000);
    return () => clearInterval(ref);
  }, [lastSession]);

  const { mutate } = useMutation({
    mutationKey: ['focus-end'],
    mutationFn: async () => {
      await fetch('https://focusmonster.me:8080/focus/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialId: lastSession?.userSocialId,
          focusId: lastSession?.id,
          banedSitesAccessLog: lastSession?.banedSiteAccessLog,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: error => {
      console.log('error', error.message, error.cause, error.name);
      setError(error.message);
    },
  });

  return (
    <>
      {error.length > 0 ? (
        <div className="bg-red-600 rounded-lg text-white absolute text-center top-4 px-4 py-2 z-50">{error}</div>
      ) : null}
      <div className="text-xl font-semibold text-green-600">UNTIL LEVEL UP</div>
      <div className="text-6xl font-bold">
        {timeLeft.hours} h {timeLeft.minutes} m
      </div>
      <div className="absolute left-14 bottom-0">
        <CharacterOverlay />
        <Character />
      </div>
      <div className="grow pr-10 pb-8 flex items-end w-full justify-end">
        <button
          onClick={() => {
            mutate();
          }}
          className="bg-neutral-400 text-white font-bold rounded-lg px-4 py-2 mt-4 text-lg hover:bg-neutral-500 transition-colors">
          Quit Focusing
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

    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    }
  }
  return { hours: 0, minutes: 0 };
}
