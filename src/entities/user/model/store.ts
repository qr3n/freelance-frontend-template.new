import { UserProfile } from '@shared/api';
import { atom } from 'jotai';

export const userAtom = atom<UserProfile | null>(null)