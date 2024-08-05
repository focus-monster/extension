import { BaseStorage, createStorage, StorageType } from './base';

type SocialId = string;

type FocusMonsterStorage = BaseStorage<SocialId>;

const storage = createStorage<SocialId>('focus-monster-social-id', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const socialIdStorage: FocusMonsterStorage = storage;
