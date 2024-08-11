import { useStorageSuspense } from '@extension/shared';
import { bannedSiteStorage, focusStorage } from '../../../packages/storage';

export default function App() {
  const bannedSites = JSON.parse(useStorageSuspense(bannedSiteStorage)) as string[];
  const isFocus = JSON.parse(useStorageSuspense(focusStorage)) as boolean;
  const currentTab = new URL(window.location.href).hostname;

  if (!bannedSites) {
    console.log('no banned sites');
  }

  if (
    isFocus &&
    bannedSites.some(site => {
      return currentTab.includes(site);
    })
  ) {
    return (
      <div className="fixed top-0 inset-0 z-[9999999] isolate bg-blue-400/50 backdrop-blur-lg grid place-content-center">
        <div
          className="flex flex-col items-center"
          style={{
            backgroundImage: 'url(/box-sm.png)',
            backgroundSize: 'cover',
            width: '610px',
            height: '270px',
          }}></div>
      </div>
    );
  }
  return <></>;
}
