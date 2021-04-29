<script lang="ts">
    import { Router, Link, Route } from 'svelte-routing';
    import Redirect from './components/Redirect.svelte';
    import { routes } from './routes';
</script>

<main>
    <Router>
        <nav>
            <Link to="/">Home</Link>
            <Link to="dashboard">Dashboard</Link>
        </nav>
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
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
