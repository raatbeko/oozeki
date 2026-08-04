import { createContext, useContext } from 'react';
import { strings, type UiStrings } from './data/ui-strings';

export const LocaleContext = createContext<UiStrings>(strings.ky);

/** Учурдагы тилдин интерфейс тексттери. */
export function useT(): UiStrings {
  return useContext(LocaleContext);
}
