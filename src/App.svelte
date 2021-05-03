<script lang="ts">
    import Router from './components/router/Router.svelte';
    import { authReady } from './stores/auth';
</script>

{#if $authReady}
    <Router />
{/if}
