<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import { authReady } from '../stores/auth';
    import Login from '../views/Login.svelte';
    import Dashboard from '../views/Dashboard.svelte';
    import NotFound from '../views/NotFound.svelte';
    import ProtectedRoute from './ProtectedRoute.svelte';
    import RedirectRoute from './RedirectRoute.svelte';
    import { authGuard } from '../utils/authGuard';
</script>

{#if $authReady}
    <Router>
        <RedirectRoute from="/" to="dashboard" />
        <Route path="login" component={Login} />
        <ProtectedRoute path="dashboard" component={Dashboard} guard={authGuard} />
        <Route path="*" component={NotFound} />
    </Router>
{/if}
