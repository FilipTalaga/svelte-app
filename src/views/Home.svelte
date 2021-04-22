<script lang="ts">
    import Button from '../components/Button.svelte';

    const me = 'Filip Talaga';
</script>

<h1>Hello {me}!</h1>
<Button />

<style>
    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>
