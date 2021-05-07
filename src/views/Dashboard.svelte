<script lang="ts">
    import { logout } from '../stores/auth';
    import AsyncButton from '../components/ui/AsyncButton.svelte';
    import { templates } from '../stores/data';
</script>

<div>Dashboard</div>
{#each $templates as template}
    <div>{template.name}</div>
{/each}
<AsyncButton job={logout}>Logout</AsyncButton>
