import { derived } from 'svelte/store';
import { user } from '../stores/auth';
import type { RouteGuard } from '../types/core';

export const authGuard: RouteGuard = {
    canAccess: derived(user, $user => !!$user),
    redirectPath: 'login',
};
