import type { Readable } from 'svelte/store';
import type SvelteComponentDev from '*.svelte';

export type RouteGuard = {
    canAccess: Readable<boolean>;
    redirectPath: string;
};

export type Route = {
    path: string;
    component?: typeof SvelteComponentDev;
    redirect?: string;
};
