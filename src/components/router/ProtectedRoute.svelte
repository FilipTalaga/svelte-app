<script lang="ts">
    import { Route } from 'svelte-routing';
    import Redirect from './Redirect.svelte';
    import type { RouteGuard } from '../../types/router';

    export let path: string;
    export let guard: RouteGuard;

    $: canAccess = guard.canAccess;
</script>

<Route {path} let:params let:location>
    {#if $canAccess}
        <slot {params} {location} />
    {:else}
        <Redirect to={guard.redirectPath} />
    {/if}
</Route>
