<script lang="ts">
    import { Route } from 'svelte-routing';
    import type { SvelteComponent } from 'svelte';
    import Redirect from './Redirect.svelte';
    import type { RouteGuard } from '../types/core';

    export let path: string;
    export let component: typeof SvelteComponent;
    export let guard: RouteGuard;

    $: canAccess = guard.canAccess;
</script>

<Route {path}>
    {#if $canAccess}
        <svelte:component this={component} />
    {:else}
        <Redirect to={guard.redirectPath} />
    {/if}
</Route>
