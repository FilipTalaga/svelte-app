<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Observable, forkJoin, timer, of } from 'rxjs';
    import { catchError, map, finalize } from 'rxjs/operators';

    export let job: (...params: []) => Observable<unknown>;
    export let disabled = false;

    const dispatch = createEventDispatcher();
    const minDelay = 400;

    let isLoading = false;

    const handleClick = () => {
        isLoading = true;

        forkJoin([
            job().pipe(
                map(content => ({ type: 'success', content })),
                catchError((content: unknown) => of({ type: 'error', content }))
            ),
            timer(minDelay),
        ])
            .pipe(
                map(([res]) => res),
                finalize(() => (isLoading = false))
            )
            .subscribe(res => dispatch(res.type, res.content));
    };
</script>

<div class="root">
    <svg class="svg" class:loading={isLoading}>
        <circle cx="50%" cy="50%" r="22" />
    </svg>
    <button
        class:loading={isLoading}
        class="button"
        on:click={handleClick}
        disabled={isLoading || disabled}
    />
    <p class="label" class:loading={isLoading}>
        <slot />
    </p>
</div>

<style lang="scss">
    /* Consts */
    $transition-time: 200ms;
    $instant-start: cubic-bezier(0, 0.5, 0.5, 1);
    $delayed-start: cubic-bezier(0.5, 0, 1, 0.5);
    $button-color: var(--color-primary);
    $text-color: #fff;
    $size: 48px;
    $border: 4px;

    /* Animation */
    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }

    .root {
        width: 100%;
        display: grid;
        justify-items: center;

        & > * {
            grid-row: 1;
            grid-column: 1;
            cursor: pointer;
            user-select: none;
        }
    }

    .button {
        padding: 0;
        width: 100%;
        height: $size;
        outline: none;
        border: $border solid;
        border-radius: $size / 2;
        background: $button-color;
        border-color: $button-color;

        /* Leave */
        transition: width $transition-time $instant-start,
            background-color $transition-time $instant-start,
            border-color $transition-time $instant-start;

        &.loading {
            width: $size;
            color: transparent;
            border-color: transparent;
            background-color: transparent;

            /* Enter */
            transition: width $transition-time $instant-start,
                background-color $transition-time $delayed-start,
                border-color $transition-time $delayed-start;
        }

        &:disabled {
            pointer-events: none;
            opacity: 0.5;
        }
    }

    .svg {
        opacity: 0;
        width: $size;
        height: $size;
        pointer-events: none;
        animation: spin $transition-time * 4 linear infinite;

        /* Leave */
        transition: opacity $transition-time $instant-start;

        & circle {
            stroke-width: $border;
            fill: transparent;
            stroke: $button-color;
            stroke-dasharray: 35px;
        }

        &.loading {
            opacity: 1;

            /* Enter */
            transition: opacity $transition-time $delayed-start;
        }
    }

    .label {
        opacity: 1;
        line-height: 1;
        font-weight: 300;
        align-self: center;
        color: $text-color;
        pointer-events: none;

        /* Leave */
        transition: opacity $transition-time $delayed-start;

        &.loading {
            opacity: 0;

            /* Enter */
            transition: opacity $transition-time $instant-start;
        }
    }
</style>
