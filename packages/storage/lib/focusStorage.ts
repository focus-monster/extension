import { BaseStorage, createStorage, StorageType } from './base';

type focusStorage = string;

type FocusMonsterStorage = BaseStorage<focusStorage>;

const storage = createStorage<focusStorage>('focus-monster-focus', JSON.stringify(false), {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const focusStorage: FocusMonsterStorage = storage;
