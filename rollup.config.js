import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;
const outputDir = 'dist';

export default {
    input: 'src/main.ts',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        dir: outputDir,
        entryFileNames: production ? '[hash].js' : 'bundle.js',
    },
    plugins: [
        /* Compiles typescript code */
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        /* Generates index.html from predefined template and injects bundle scripts */
        html({
            template: ({ bundle }) =>
                fs.readFileSync('public/index.html', { encoding: 'utf-8' }).replace(
                    /<!-- scripts to inject -->/,
                    Object.keys(bundle).map(src => `<script defer src="${src}"></script>`)
                ),
        }),

        /* Compiles svelete components */
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),

        /* Parses scss, and extracts styles to separate file for performance */
        scss({
            output: `${outputDir}/bundle.css`,
            prefix: `@import "./global.scss";`,
            outputStyle: 'compressed',
        }),

        /* Locates modules using the Node resolution algorithm, for using third party modules in node_modules */
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),

        /* Converts CommonJS modules to ES6, so they can be included in a Rollup bundle */
        commonjs(),

        !production && [
            /* Starts http server in output directory and hosts it locally */
            serve({
                contentBase: outputDir,
                port: 5000,
                open: true,
            }),

            /* Watches output directory and refreshes browser on changes */
            livereload({ delay: 100, watch: outputDir }),
        ],

        production && [
            /* Clear output directory to get rid of dev files */
            del({ targets: outputDir }),

            /* Clear output directory to get rid of dev files */
            copy({
                targets: [{ src: 'public/**/*', dest: outputDir }],
                flatten: false,
            }),

            /* Minify bundle */
            terser(),
        ],
    ].flat(),
    watch: {
        clearScreen: false,
    },
};
