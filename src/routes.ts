import Login from './views/Login.svelte';
import Dashboard from './views/Dashboard.svelte';
import NotFound from './views/NotFound.svelte';
import type { Route } from './types';

export const routes: Route[] = [
    { path: '/', redirect: 'dashboard' },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard },
    { path: '*', component: NotFound },
];
