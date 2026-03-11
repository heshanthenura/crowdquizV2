import { Serwist, type PrecacheEntry } from "serwist";

declare const self: typeof globalThis & {
  __SW_MANIFEST: Array<PrecacheEntry | string>;
};

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
});

sw.addEventListeners();
