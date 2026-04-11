// Single import point for the gear database.
// Usage: import { ALL_GEAR, filterByJobAndSlot, compareItems } from '@/data/gear';

export type {
  GearSlot,
  WeaponType,
  JobCode,
  UpgradeTier,
  GearTier,
  SuperiorLevel,
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
export { REFORGED } from './reforged';
export { INSTRUMENTS } from './instruments';
export { ODYSSEY } from './odyssey';
export { PRIME_WEAPONS } from './prime';
export { AMBUSCADE_WEAPONS } from './ambuscade';
export { JOB_PROFILES } from './jobs';
export type { JobProfile } from './jobs';
export { JOB_WEIGHT_OVERRIDES } from './compareProfiles';

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
  generateExplanation,
  getItemById,
  getItemByName,
  allSlots,
  allWeaponTypes,
} from './helpers';
