<script lang="ts">
    import { Router, Link, Route } from 'svelte-routing';
    import Redirect from './components/Redirect.svelte';
    import Home from './views/Home.svelte';
    import Dashboard from './views/Dashboard.svelte';
    import NotFound from './views/NotFound.svelte';
</script>

<main>
    <Router>
        <nav>
            <Link to="/">Home</Link>
            <Link to="dashboard">Dashboard</Link>
        </nav>
        <div>
            <Route path="index.html">
                <Redirect to="/" />
            </Route>
            <Route path="/">
                <Home />
            </Route>
            <Route path="dashboard">
                <Dashboard />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </div>
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
