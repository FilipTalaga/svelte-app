<script lang="ts">
    import { Route } from 'svelte-routing';
    import Redirect from './Redirect.svelte';

    export let from: string;
    export let to: string;
</script>

<Route path={from}>
    <Redirect {to} />
</Route>
