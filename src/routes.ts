import Home from './views/Home.svelte';
import Dashboard from './views/Dashboard.svelte';
import NotFound from './views/NotFound.svelte';
import type { Route } from './types';

export const routes: Route[] = [
    { path: 'index.html', redirect: '/' },
    { path: '/', component: Home },
    { path: 'dashboard', component: Dashboard },
    { path: '*', component: NotFound },
];
