<script lang="ts">
    import { login } from '../stores/auth';
    import Button from '../components/Button.svelte';
    import { navigate } from 'svelte-routing';

    let email = '';
    let password = '';

    const handleLogin = () => login(email, password).then(() => navigate('/'));
</script>

<div>Login</div>

<input bind:value={email} type="email" />
<input bind:value={password} type="password" />

<Button on:click={handleLogin} disabled={!email || !password}>Login</Button>
