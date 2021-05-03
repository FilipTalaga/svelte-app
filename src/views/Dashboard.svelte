<script lang="ts">
    import { logout, user } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
</script>

<div>Dashboard</div>
<h2>{$user?.email}</h2>

<AsyncButton job={logout}>Logout</AsyncButton>
