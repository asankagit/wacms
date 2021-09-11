const { generateTemplateFiles } = require('generate-template-files');

const config = require('../package.json');

generateTemplateFiles([
    {
        option: 'Create C/C++ template',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/c_wasm/',
        },
        stringReplacers: [{ question: 'Insert model name', slot: '__function__' }, { question: 'Insert model name', slot: '__model__' }],
        output: {
            path: './wafunctions/__function__(lowerCase)',
            pathAndFileNameDefaultCase: '(kebabCase)',
            overwrite: true,
        },
    },
    {
        option: 'Create Rust template',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/rust_wasm/',
        },
        stringReplacers: ['__store__', { question: 'Insert model name', slot: '__model__' }],
        output: {
            path: './wafunctions/__store__(lowerCase)',
            pathAndFileNameDefaultCase: '(kebabCase)',
            overwrite: true,
        },
    },
    // {
    //     option: 'Create Redux Store',
    //     defaultCase: '(pascalCase)',
    //     entry: {
    //         folderPath: './tools/templates/react/redux-store/',
    //     },
    //     stringReplacers: ['__store__', { question: 'Insert model name', slot: '__model__' }],
    //     output: {
    //         path: './src/stores/__store__(lowerCase)',
    //         pathAndFileNameDefaultCase: '(kebabCase)',
    //         overwrite: true,
    //     },
    // },
    // {
    //     option: 'Create Reduce Action',
    //     defaultCase: '(pascalCase)',
    //     entry: {
    //         folderPath: './tools/templates/react/redux-store/__store__Action.ts',
    //     },
    //     stringReplacers: ['__store__', '__model__'],
    //     dynamicReplacers: [
    //         { slot: '__version__', slotValue: config.version },
    //         { slot: '__description__', slotValue: config.description },
    //     ],
    //     output: {
    //         path: './src/stores/__store__/__store__(lowerCase)/__store__(pascalCase)Action.ts',
    //         pathAndFileNameDefaultCase: '(kebabCase)',
    //     },
    //     onComplete: (results) => {
    //         console.log(`results`, results);
    //     },
    // },
]);