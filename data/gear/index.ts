// Single import point for the gear database.
// Usage: import { ALL_GEAR, filterByJobAndSlot, compareItems } from '@/data/gear';

export type {
  GearSlot,
  WeaponType,
  JobCode,
  UpgradeTier,
  GearCategory,
  ItemSource,
  WeaponStats,
  GearStats,
  GearItem,
  StatDiff,
  CompareMode,
} from './types';

export { WEAPONS } from './weapons';
export { SHIELDS } from './shields';
export { ARMOR } from './armor';
export { ACCESSORIES } from './accessories';

export {
  ALL_GEAR,
  filterByJob,
  filterBySlot,
  filterByJobAndSlot,
  filterByCategory,
  filterByWeaponType,
  filterBySource,
  endgameOnly,
  searchGear,
  compareItems,
  scoreItem,
  getBestGear,
  getItemById,
  getItemByName,
  allSlots,
  allWeaponTypes,
} from './helpers';
