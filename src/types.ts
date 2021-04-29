import type SvelteComponentDev from '*.svelte';

export type Route = {
    path: string;
    component?: typeof SvelteComponentDev;
    redirect?: string;
};
