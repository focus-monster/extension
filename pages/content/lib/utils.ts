import { HOME } from '.';

export function getTab() {
  const tabs = window.location.href;
  return tabs;
}
export function checkForHome(tab: string) {
  const domain = new URL(tab).hostname;
  return HOME.includes(domain);
}
export async function fetchStorageValue(key: string) {
  const value = window.localStorage.getItem(key);
  if (!value) {
    console.error(`No value found for ${key}`);
  }
  return value;
}

export function noBannedSites() {
  console.log('No banned sites found');
}

export function noSocialId() {
  console.log('No social id found');
}
