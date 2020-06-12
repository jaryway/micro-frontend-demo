const isMicro = process.env.MICRO === 'true';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: {
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'ie >= 9',
            'iOS >= 8',
            'Android >= 4',
          ],
        },
      },
    ],
    ['react-app'],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', {}],

    '@babel/plugin-syntax-dynamic-import',
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: !isMicro }, 'ant'],
    ['import', { libraryName: 'fregata', libraryDirectory: 'es', style: true }, 'fregata'],

    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
};
