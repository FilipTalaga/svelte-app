<script lang="ts">
    import { logout, user } from '../stores/auth';
    import Button from '../components/Button.svelte';
</script>

<div>Dashboard</div>
<h2>{$user.email}</h2>

<Button on:click={logout}>Logout</Button>
