import type { Readable } from 'svelte/store';

export type RouteGuard = {
    canAccess: Readable<boolean>;
    redirectPath: string;
};
