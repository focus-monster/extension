import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { SmallBox } from './small-box';
import { useAuth } from './hooks/auth';

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
  const { data } = useAuth();

  return <SmallBox />;
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
