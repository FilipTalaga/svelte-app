<script lang="ts">
    export let disabled: boolean;
</script>

<button on:click {disabled}>
    <slot />
</button>
