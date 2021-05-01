<script lang="ts">
    import Button from '../components/Button.svelte';

    const me = 'Filip Talaga';
</script>

<h1>Hello {me}!</h1>
<Button />

<style lang="scss">
    $color: #ff3e00;

    h1 {
        color: $color;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
</style>
