<script lang="ts">
    import { Router, Link, Route } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import Dashboard from './views/Dashboard.svelte';

    if ('serviceWorker' in navigator) {
        void navigator.serviceWorker.register('../service-worker.js');
    }
</script>

<main>
    <Router>
        <nav>
            <Link to="/">Home</Link>
            <Link to="dashboard">Dashboard</Link>
        </nav>
        <div>
            <Route path="/" component={Home} />
            <Route path="dashboard" component={Dashboard} />
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
