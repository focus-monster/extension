import { useStorageSuspense } from '@extension/shared';
import { bannedSiteStorage, focusStorage, socialIdStorage } from '@extension/storage';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { queryClient } from '.';
import { useError } from './error';

export function FocusAction() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const socialId = useStorageSuspense(socialIdStorage);
  const bannedSites = useStorageSuspense(bannedSiteStorage);

  const { setError } = useError();
  const { mutate } = useMutation({
    mutationKey: ['focus'],
    mutationFn: async () => {
      await fetch('https://focusmonster.me:8080/focus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialId: socialId,
          duration: { hours, minutes },
          task: '',
          bannedSites: bannedSites,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      focusStorage.set('true');
    },
    onError: error => {
      setError(error.message);
    },
  });

  return (
    <div className="flex flex-row gap-4 text-lg items-center font-semibold">
      <div>Set Duration:</div>
      <div>
        <input
          className="border-2 w-16 rounded-lg p-2"
          type="number"
          min="0"
          max="4"
          name="hours"
          id="hours"
          value={hours}
          onBlur={e => {
            if (Number(e.target.value) > 4) {
              setHours(4);
            }
            if (Number(e.target.value) < 0) {
              setHours(0);
            }
          }}
          onChange={e => {
            setHours(Number(e.target.value));
          }}
        />{' '}
        h
      </div>
      <div>
        <input
          className="border-2 w-16 rounded-lg p-2"
          type="number"
          min="0"
          max="60"
          name="minutes"
          id="minutes"
          step="5"
          value={minutes}
          onBlurCapture={e => {
            if (Number(e.target.value) > 60) {
              setMinutes(59);
            }
            if (Number(e.target.value) < 0) {
              setMinutes(0);
            }
          }}
          onChange={e => {
            if (e.target.value === '0') {
              setMinutes(55);
              if (hours === 0) {
                return;
              }
              setHours(hours - 1);
              return;
            }
            if (e.target.value === '60') {
              if (hours === 4) {
                return;
              }
              setHours(hours + 1);
              setMinutes(0);
              return;
            }

            setMinutes(Number(e.target.value));
          }}
        />{' '}
        m
      </div>
      <button
        onClick={() => {
          mutate();
        }}
        className="bg-black text-white px-4 py-1 rounded-lg">
        Focus Now
      </button>
    </div>
  );
}
