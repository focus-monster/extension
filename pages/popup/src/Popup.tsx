import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type Session = {
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
  nickname: string;
};

const Popup = () => {
  return <SmallBox />;
};

export function Auth() {
  const socialId = useStorageSuspense(socialIdStorage);
  const { data, isLoading } = useQuery<Session>({
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

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!data) {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href="https://focusmonster.me"
        className=" font-semibold hover:underline underline-offset-2">
        Go to Homepage 🏠
      </a>
    );
  }

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href="https://focusmonster.me"
      className=" font-semibold hover:underline underline-offset-2">{`${data.nickname}'s home 🏠`}</a>
  );
}

function SmallBox() {
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
      <div className="w-full flex flex-col items-center grow py-6">
        <FocusAction />
      </div>
    </div>
  );
}

function FocusAction() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  return (
    <div className="flex flex-row gap-4 text-lg items-center font-semibold">
      <div>Set Duration:</div>
      <div>
        <input
          className="border-2 w-10"
          type="number"
          min="0"
          name="hours"
          id="hours"
          value={hours}
          onChange={e => {
            setHours(Number(e.target.value));
          }}
        />{' '}
        h
      </div>
      <div>
        <input
          className="border-2 w-10"
          type="number"
          min="0"
          name="minutes"
          id="minutes"
          value={minutes}
          onChange={e => {
            setMinutes(Number(e.target.value));
          }}
        />{' '}
        m
      </div>
      <button className="bg-black text-white px-4 py-1 rounded-lg">Focus Now</button>
    </div>
  );
}

export function SocialId() {
  const socialId = useStorageSuspense(socialIdStorage);
  return <div>{socialId}</div>;
}

export function BannedSites() {
  const bannedSites = useStorageSuspense(bannedSiteStorage);
  return <div>{bannedSites}</div>;
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
