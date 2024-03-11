import { frameworkPackages } from '@storybook/core-common';
import { resolve } from 'path';
import { middleware } from './src/middleware';

const AngularFramework = resolve(__dirname, './src/angular');
frameworkPackages[AngularFramework] = 'nativescript';

const VueFramework = resolve(__dirname, './src/vue');
frameworkPackages[VueFramework] = 'nativescript';

const Vue3Framework = resolve(__dirname, './src/vue3');
frameworkPackages[Vue3Framework] = 'nativescript';

export { middleware, AngularFramework, VueFramework, Vue3Framework };
export default {
  middleware,
};

// import './src/register';
// export { middleware } from './src/middleware';
