// Copyright (c) 2018-present, xmini, Inc. All rights reserved.

module.exports = {
  presets: [
    // [
    //   '@babel/preset-env',
    //   {
    //     modules: 'cjs',
    //   },
    // ],
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // 'es2015',
    // '@babel/preset-stage-2',
    // '@babel/preset-typescript',
  ],
  plugins: [
    // '@babel/runtime',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
      },
    ],
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-classes',
    // https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
    '@babel/plugin-proposal-export-default-from',
    // https://babeljs.io/docs/en/babel-helper-module-imports
    // '@babel/helper-module-imports',
    '@babel/plugin-syntax-dynamic-import',
    // https://www.npmjs.com/package/babel-plugin-add-module-exports
    'add-module-exports',
  ],
  env: {
    // production: {
    //   plugins: ['transform-es2015-modules-commonjs'],
    // },
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
};
