const { Vue3Framework } = require("@nativescript/storybook");

module.exports = {
  stories: ["../src/**/*.stories.@(js|ts)"],
  addons: [
    "@storybook/addon-controls",
    "@nativescript/storybook",
    // ...
  ],
  framework: Vue3Framework,
};
