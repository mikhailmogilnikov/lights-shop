import { writable } from 'svelte/store';

export const cartSheetStore = writable(false);

export const openCartSheet = () => cartSheetStore.set(true);

export const closeCartSheet = () => cartSheetStore.set(false);
