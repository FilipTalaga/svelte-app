module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.svelte'],
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['svelte3', '@typescript-eslint'],
    ignorePatterns: ['public/build/', '*.js'],
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    settings: {
        'svelte3/typescript': require('typescript'),
        'svelte3/ignore-styles': () => true,
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'prefer-const': ['error'],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '_',
                varsIgnorePattern: '_',
            },
        ],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
    },
};
