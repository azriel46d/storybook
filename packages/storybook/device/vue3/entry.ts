/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Color, Label, View } from '@nativescript/core';
import { WebSocket } from '@valor/nativescript-websockets/websocket';
import { storiesMeta } from '../storyDiscovery';
import { StorybookWelcomeView } from '../StorybookWelcomeView';
//@ts-ignore
import {
  createApp,
  registerElement,
  defineComponent,
  h,
  markRaw,
} from 'nativescript-vue';

declare const NSC_STORYBOOK_WS_ADDRESS: string;

registerElement('StorybookWelcomeView', () => StorybookWelcomeView);

// replaced by webpack DefinePlugin.
const wsAddress = NSC_STORYBOOK_WS_ADDRESS;
const apiWebsocket = new WebSocket(`${wsAddress}/device`);

const StorybookStoryComponent = {
  props: ['currentComponent'],
  render() {
    return markRaw(
      h(this.currentComponent.component, {
        ...this.currentComponent.args,
      })
    );
  },
  errorCaptured(err, vm, info) {
    console.log('errorCaptured', err, vm, info);
    return true;
  },
};

const StorybookStory = defineComponent(StorybookStoryComponent);
createApp({
  data() {
    return {
      story: null,
      currentComponent: null,
    };
  },
  created() {
    apiWebsocket.addEventListener('message', (event: any) => {
      const data = JSON.parse(event.data);
      if (data.kind === 'storyChange') {
        this.story = data.story;
      }
    });
  },
  watch: {
    story(newStory) {
      if (!newStory) {
        return;
      }
      const { storyId, args } = newStory;
      console.log('switch to', storyId);
      if (!storiesMeta.has(storyId)) {
        console.warn('failed to switch story, story metadata not found?');
        return;
      }
      const story = storiesMeta.get(storyId);
      const _args = {
        ...story.args,
        ...args,
      };
      let component;
      if (story.factory) {
        component = story.factory(_args, story.meta);
      } else {
        component = story.component;
      }
      apiWebsocket.send(
        JSON.stringify({
          kind: 'storyUpdate',
          storyId: storyId,
          argTypes: story.meta.argTypes,
          initialArgs: story.args,
          args: _args,
        })
      );
      this.currentComponent = {
        id: story.id,
        component,
        args: _args,
      };
    },
  },
  computed: {
    storyKey() {
      return this.currentComponent
        ? [this.currentComponent.id, JSON.stringify(this.currentComponent.args)].join(',')
        : null;
    },
  },
  methods: {
    createStoryView(args) {
      try {
        console.log('HERHEHRER');
        const vm = createApp(StorybookStory, { currentComponent: this.currentComponent });
        const $mounted = vm.mount();
        const vNode = $mounted?.$.vnode;
        const view = vNode.el.nativeView;
        args.object.content = view;
      } catch (err) {
        console.error('Failed to render story:', err);
        const errorLabel = new Label();
        errorLabel.color = new Color('red');
        errorLabel.text = err.toString();
        args.object.content = errorLabel;
      }
    },
  },
  render() {
    return h('GridLayout', { rows: '*' }, [
      h('GridLayout', { backgroundColor: '#fefefe', padding: '16' }, [
        h('ContentView', { horizontalAlignment: 'left', verticalAlignment: 'top' }, [
          this.currentComponent
            ? h('ContentView', { key: this.storyKey }, [
                h(StorybookStory, { currentComponent: this.currentComponent }),
              ])
            : null,
        ]),
        !this.currentComponent ? h('StorybookWelcomeView') : null,
      ]),
    ]);
  },
}).start();
