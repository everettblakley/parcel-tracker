import { writable } from "svelte/store";

export const parcelData = writable(null);

export const menuHeight = writable(0);

export const loading = writable(false);