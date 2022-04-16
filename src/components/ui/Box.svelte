<script lang="ts">
    import { cx, css } from '@emotion/css';
    import { SIZES } from '../../assets/theme';

    /* Flexbox */
    export let display: 'flex' | 'block' | 'inline' | null = null;
    export let justifyContent:
        | 'stretch'
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
        | null = null;
    export let alignItems: 'stretch' | 'center' | 'flex-start' | 'flex-end' | null = null;
    export let alignContent:
        | 'stretch'
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
        | null = null;
    export let flex: number | null = null;
    export let flexDirection: 'row' | 'column' | null = null;

    /* Margin */
    export let mt: number | null = null;
    export let mb: number | null = null;
    export let ml: number | null = null;
    export let mr: number | null = null;
    export let mx: number | null = null;
    export let my: number | null = null;
    export let m: number | null = null;

    /* Padding */
    export let pt: number | null = null;
    export let pb: number | null = null;
    export let pl: number | null = null;
    export let pr: number | null = null;
    export let px: number | null = null;
    export let py: number | null = null;
    export let p: number | null = null;

    const styles = css`
        /* Flexbox */
        display: ${display};
        justify-content: ${justifyContent};
        align-items: ${alignItems};
        align-content: ${alignContent};
        flex: ${flex};
        flex-direction: ${flexDirection};

        /* Margin */
        margin-top: ${SIZES.spacing(mt || my)};
        margin-bottom: ${SIZES.spacing(mb || my)};
        margin-left: ${SIZES.spacing(ml || mx)};
        margin-right: ${SIZES.spacing(mr || mx)};
        margin: ${SIZES.spacing(m)};

        /* Padding */
        padding-top: ${SIZES.spacing(pt || py)};
        padding-bottom: ${SIZES.spacing(pb || py)};
        padding-left: ${SIZES.spacing(pl || px)};
        padding-right: ${SIZES.spacing(pr || px)};
        padding: ${SIZES.spacing(p)};
    `;
</script>

<div {...$$restProps} class={cx($$props.class, styles)}>
    <slot />
</div>
