// constants/procs.ts

export type ProcType =
  | 'red'
  | 'yellow'
  | 'blue'
  | 'white'
  | 'green';

export interface Proc {
  id: string;
  name: string;
  type: ProcType;
  weaponSkill?: string;
  unlockLevel?: number;
  quest?: string;
  notes?: string;
}

export const PROC_COLORS: Record<ProcType, string> = {
  red: '#d9534f',
  yellow: '#f0ad4e',
  blue: '#0275d8',
  white: '#f7f7f7',
  green: '#5cb85c',
};
