// import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

import { bannedSiteStorage } from '@extension/storage';
import { syncDataWithHome } from './sync-data-with-home';

export const HOME = ['localhost', 'focusmonster.me', 'www.focusmonster.me'];

async function main() {
  await syncDataWithHome();
  const bannedSites = JSON.parse(await bannedSiteStorage.get()) as string[];

  if (!bannedSites) {
    console.log('no banned sites');
  }

  const currentTab = window.location.href;
  const domain = new URL(currentTab).hostname;

  if (
    bannedSites.some(site => {
      return domain.includes(site);
    })
  ) {
    console.log('banned site found');
  }
}

if (document.readyState !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
