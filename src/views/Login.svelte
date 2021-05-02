<script lang="ts">
    import { login } from '../stores/auth';
    import Button from '../components/Button.svelte';
</script>

<div>Login</div>

<Button on:click={() => login('talaga.filip@gmail.com', '')}>Login</Button>
