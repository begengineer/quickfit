import { ja } from './ja';
import { en } from './en';

export const translations = {
  ja,
  en,
};

export type Locale = keyof typeof translations;

export { ja, en };
