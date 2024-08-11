import { useStorageSuspense } from '@extension/shared';
import { bannedSiteStorage } from '../../../packages/storage';

export default function App() {
  const bannedSites = JSON.parse(useStorageSuspense(bannedSiteStorage)) as string[];
  const currentTab = new URL(window.location.href).hostname;
  console.log(currentTab);

  if (!bannedSites) {
    console.log('no banned sites');
  }

  if (
    bannedSites.some(site => {
      return currentTab.includes(site);
    })
  ) {
    chrome.action.openPopup();
    return (
      <div className="absolute inset-0 z-[9999999] isolate bg-blue-400/50 backdrop-blur-lg grid place-content-center"></div>
    );
  }
  return <></>;
}
