<script lang="ts">
    import { login } from '../stores/auth';
    import Button from '../components/ui/Button.svelte';
    import Input from '../components/ui/Input.svelte';
    import { navigate } from 'svelte-routing';
    import { getValues } from '../utils/form';

    const loginForm = [
        { name: 'email', value: '', type: 'email' },
        { name: 'password', value: '', type: 'password' },
    ];

    const submit = () => {
        const { email, password } = getValues(loginForm);
        login(email, password).then(() => navigate('/'));
    };
</script>

<div>Login</div>

<form on:submit|preventDefault={submit}>
    {#each loginForm as field}
        <Input bind:value={field.value} name={field.name} type={field.type} />
    {/each}

    <Button type="submit">Login</Button>
</form>
