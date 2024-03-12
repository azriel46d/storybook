const webpack = require('@nativescript/webpack');
const { VueLoaderPlugin } = require('nativescript-vue/node_modules/vue-loader');
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

      /**
       * Only in this demo, since plugin at route has nativescript-vue-template-compiler , so that it is skipped.
       */
      config.module.rules
        .get('vue')
        .uses.get('vue-loader')
        .loader(require.resolve('nativescript-vue/node_modules/vue-loader'))
        .tap((options) => {
          let { compiler, ...opts } = options;
          return {
            ...opts,
          };
        });
    },
    { order: 2 }
  );

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return webpack.resolveConfig();
};
