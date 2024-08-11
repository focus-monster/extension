// import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

import { syncDataWithHome } from './sync-data-with-home';

export const HOME = ['localhost', 'focusmonster.me', 'www.focusmonster.me'];

async function main() {
  await syncDataWithHome();
}

if (document.readyState !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
