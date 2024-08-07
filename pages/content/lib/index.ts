// import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

console.log('content script loaded 222');

const HOME = ['localhost', 'focusmonster.me', 'www.focusmonster.me'];

function getTab() {
  const tabs = window.location.href;
  return tabs;
}

function checkForHome(tab: string) {
  const domain = new URL(tab).hostname;
  return HOME.includes(domain);
}

async function fetchStorageValue(key: string) {
  const value = window.localStorage.getItem(key);
  if (!value) {
    console.error(`No value found for ${key}`);
  }
  return value;
}

async function main() {
  try {
    const tab = getTab();
    const isHome = checkForHome(tab);

    if (!isHome) {
      console.log('Not on home page');
      return;
    }
    console.log('On home page');
    const socialId = await fetchStorageValue('socialId');
    if (!socialId) {
      noSocialId();
      return;
    }
    socialIdStorage.set(socialId);
    console.log('Social id set');

    const bannedSites = await fetchStorageValue('bannedSites');
    if (!bannedSites) {
      noBannedSites();
      return;
    }
    const bannedSitesObj = JSON.parse(bannedSites) as { [key: string]: boolean };
    const bannedSitesArr = Object.entries(bannedSitesObj)
      .filter(([, value]) => value)
      .map(([key]) => key);

    bannedSiteStorage.set(JSON.stringify(bannedSitesArr));
    console.log('Banned sites set');
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message, error.stack);
    }
  }
}

function noBannedSites() {
  console.log('No banned sites found');
}

function noSocialId() {
  console.log('No social id found');
}

if (document.readyState !== 'loading') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
