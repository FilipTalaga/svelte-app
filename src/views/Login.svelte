<script lang="ts">
    import { login } from '../stores/auth';
    import Input from '../components/ui/Input.svelte';
    import { navigate } from 'svelte-routing';
    import { getValues } from '../utils/form';
    import AsyncButton from '../components/ui/AsyncButton.svelte';

    const loginForm = [
        { name: 'email', value: '', type: 'email' },
        { name: 'password', value: '', type: 'password' },
    ];

    const loginJob = () => {
        const { email, password } = getValues(loginForm);
        return login(email, password);
    };

    const goToApp = () => navigate('/');

    const logError = (err: CustomEvent<unknown>) => console.log(err.detail);
</script>

<div>Login</div>

<form>
    {#each loginForm as field}
        <Input bind:value={field.value} name={field.name} type={field.type} />
    {/each}

    <AsyncButton job={loginJob} on:success={goToApp} on:error={logError}>Login</AsyncButton>
</form>
