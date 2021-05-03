<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    import Login from '../../views/Login.svelte';
    import Dashboard from '../../views/Dashboard.svelte';
    import NotFound from '../../views/NotFound.svelte';
    import ProtectedRoute from './ProtectedRoute.svelte';
    import RedirectRoute from './RedirectRoute.svelte';
    import { authGuard } from '../../utils/authGuard';
</script>

<Router>
    <RedirectRoute from="/" to="dashboard" />
    <Route path="login">
        <Login />
    </Route>
    <ProtectedRoute path="dashboard" guard={authGuard}>
        <Dashboard />
    </ProtectedRoute>
    <Route path="*">
        <NotFound />
    </Route>
</Router>
