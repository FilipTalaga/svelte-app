<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Redirect from './components/Redirect.svelte';
    import { routes } from './routes';
    import { authReady } from './stores/auth';
</script>

<main>
    {#if $authReady}
        <Router>
            {#each routes as route}
                <Route path={route.path}>
                    {#if route.redirect}
                        <Redirect to={route.redirect} />
                    {/if}
                    {#if route.component}
                        <svelte:component this={route.component} />
                    {/if}
                </Route>
            {/each}
        </Router>
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1rem;
        margin: 0 auto;
    }
</style>
