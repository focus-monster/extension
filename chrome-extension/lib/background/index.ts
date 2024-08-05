// import { bannedSiteStorage, socialIdStorage } from '@extension/storage';

console.log('content script loaded 222');

const HOME = ['localhost', 'focusmonster.me', 'www.focusmonster.me'];

async function getTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function checkForHome(tab: chrome.tabs.Tab) {
  if (!tab || !tab.url) {
    console.log('No current url');
    return false;
  }
  const domain = new URL(tab.url).hostname;

  return HOME.includes(domain);
}

async function fetchStorageValue(tab: chrome.tabs.Tab, key: string) {
  const value = await chrome?.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => {
      return window.localStorage.getItem(key);
    },
  });
  if (!value) {
    console.error(`No value found for ${key}`);
  }
  return value[0].result;
}

async function main() {
  console.log('hi');
  try {
    const tab = await getTab();

    if (!checkForHome(tab)) {
      console.log('Not on home page');
      return;
    }
    console.log('On home page');
    const socialId = await fetchStorageValue(tab, 'socialId');
    if (!socialId) {
      noSocialId();
      return;
    }
    chrome.storage.local.set({ ['socialId']: socialId }, () => {});
    console.log('Social id set');

    const bannedSites = await fetchStorageValue(tab, 'bannedSites');
    if (!bannedSites) {
      noBannedSites();
      return;
    }
    const bannedSitesObj = JSON.parse(bannedSites) as { [key: string]: boolean };
    const bannedSitesArr = Object.entries(bannedSitesObj)
      .filter(([, value]) => value)
      .map(([key]) => key);

    chrome.storage.local.set({ ['bandSites']: JSON.stringify(bannedSitesArr) }, () => {});
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
