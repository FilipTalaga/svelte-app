<script lang="ts">
    import { Route } from 'svelte-routing';
    import Redirect from './Redirect.svelte';
    import type { RouteGuard } from '../types/core';

    export let path: string;
    export let guard: RouteGuard;

    $: canAccess = guard.canAccess;
</script>

<Route {path}>
    {#if $canAccess}
        <slot />
    {:else}
        <Redirect to={guard.redirectPath} />
    {/if}
</Route>
