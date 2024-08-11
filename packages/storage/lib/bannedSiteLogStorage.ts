import { BaseStorage, createStorage, StorageType } from './base';

type BannedSiteLog = string;

type FocusMonsterStorage = BaseStorage<BannedSiteLog>;

const storage = createStorage<BannedSiteLog>('focus-monster-banned-site-log', JSON.stringify([]), {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const bannedSiteLogStorage: FocusMonsterStorage = storage;
