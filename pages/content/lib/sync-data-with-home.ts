import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { getTab, checkForHome, fetchStorageValue, noSocialId, noBannedSites } from './utils';

export async function syncDataWithHome() {
  try {
    const tab = getTab();
    const isHome = checkForHome(tab);

    if (!isHome) {
      console.log('Not on home page');
      return;
    }
    const socialId = await fetchStorageValue('socialId');
    if (!socialId) {
      noSocialId();
      return;
    }
    socialIdStorage.set(socialId);

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
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message, error.stack);
    }
  }
}
