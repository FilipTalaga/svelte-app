<script lang="ts">
    import { Router, Link, Route } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import Dashboard from './views/Dashboard.svelte';
</script>

<main>
    <Router>
        <nav>
            <Link to="/">Home</Link>
            <Link to="dashboard">Dashboard</Link>
        </nav>
        <div>
            <Route path="/">
                <Home />
            </Route>
            <Route path="dashboard">
                <Dashboard />
            </Route>
        </div>
        <p>v11</p>
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
