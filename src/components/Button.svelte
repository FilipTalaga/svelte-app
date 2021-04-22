<script lang="ts">
    let count = 0;

    const handleClick = () => {
        console.log('click');
        count += 1;
    };
</script>

<button on:click={handleClick}> Increment </button>
<p>Count: {count}</p>
