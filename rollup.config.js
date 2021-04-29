import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'dev', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

const template = ({ bundle }) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <meta name="description" content="Playground app build with Svelte" />
            <meta name="theme-color" content="#5bd1d7" />

            <title>Svelte app</title>

            <link rel="manifest" href="/manifest.json" />
            <link rel="icon" href="/assets/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
            <link rel="stylesheet" href="/global.css" />
            <link rel="stylesheet" href="/bundle.css" />

            <script>
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/service-worker.js');
                }
            </script>
            ${Object.keys(bundle).map(src => `<script defer src="${src}"></script>`)}
        </head>

        <body></body>
    </html>
`;

export default {
    input: 'src/main.ts',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        dir: 'dist',
        entryFileNames: `bundle${production ? '.[hash]' : ''}.js`,
    },
    plugins: [
        html({ template }),
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css(),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        // In dev mode, call `npm run dev` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `dist` directory and refresh the
        // browser on changes when not in production
        !production && livereload('dist'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),

        // Clear build directory to get rid of
        // possible sourcemap leftovers
        production && del({ targets: 'dist' }),

        copy({
            targets: [{ src: 'public/**/*', dest: 'dist' }],
            flatten: false,
        }),
    ],
    watch: {
        clearScreen: false,
    },
};
