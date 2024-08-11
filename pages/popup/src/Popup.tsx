import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { SmallBox } from './small-box';
import { useError } from './error';

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
  nickname: string;
  level: number;
};

const Popup = () => {
  const { error } = useError();
  return (
    <>
      {error?.length && error.length > 0 ? (
        <div className=" left-1/2 -translate-x-1/2 bg-red-600 rounded-lg text-white absolute text-center top-4 px-4 py-2 z-50">
          {error}
        </div>
      ) : null}
      <SmallBox />
    </>
  );
};

export function SocialId() {
  const socialId = useStorageSuspense(socialIdStorage);
  return <div>{socialId}</div>;
}

export function BannedSites() {
  const bannedSites = useStorageSuspense(bannedSiteStorage);
  return <div>{bannedSites}</div>;
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
