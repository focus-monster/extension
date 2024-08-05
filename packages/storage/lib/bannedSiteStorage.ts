import { BaseStorage, createStorage, StorageType } from './base';

type BannedSite = string;

type FocusMonsterStorage = BaseStorage<BannedSite>;

const storage = createStorage<BannedSite>('focus-monster-banned-sites', JSON.stringify([]), {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const bannedSiteStorage: FocusMonsterStorage = storage;
