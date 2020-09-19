import { writable } from "svelte/store";

export const parcelData = writable(undefined);

export const loading = writable(false);

export const menuHeight = writable(0);