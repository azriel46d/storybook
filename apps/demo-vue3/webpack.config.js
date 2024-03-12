const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    // shared demo code
    config.resolve.alias.set(
      '@demo/shared',
      resolve(__dirname, '..', '..', 'tools', 'demo')
    );
  });
  webpack.chainWebpack(
    (config) => {
      config.resolve.alias.set('vue', 'nativescript-vue/dist/withCompiler.js');
    },
    { order: 2 }
  );

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return webpack.resolveConfig();
};
