import '@src/Popup.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

const Popup = () => {
  return (
    <div>
      <SocialId />
      <BannedSites />
    </div>
  );
};

function SocialId() {
  const socialId = useStorageSuspense(socialIdStorage);
  return <div>{socialId}</div>;
}

function BannedSites() {
  const bannedSites = useStorageSuspense(bannedSiteStorage);
  return <div>{bannedSites}</div>;
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
