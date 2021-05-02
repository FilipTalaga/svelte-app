<script lang="ts">
    import { login } from '../stores/auth';
    import Button from '../components/Button.svelte';
    import { navigate } from 'svelte-routing';

    const handleLogin = () => login('talaga.filip@gmail.com', '').then(() => navigate('/'));
</script>

<div>Login</div>

<Button on:click={handleLogin}>Login</Button>
