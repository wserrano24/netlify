import "../src/assets/sass/main.scss";
import { createApp } from "vue";
import { createHead } from '@unhead/vue'
import router from "./router";
import { createPinia } from 'pinia'
import App from "./App.vue";
import { useDomainVariables } from "./composables/useDomainVariables";
import VueGoogleMaps from '@fawmi/vue-google-maps';
import * as maskaPkg from 'maska';
import VueGtag from 'vue-gtag';
import { TrackGTMEvent } from "@/composables/useGTMtrackEvent";

const env = useDomainVariables();
const head = createHead()
const pinia = createPinia()
const app = createApp(App);
const { maska } = maskaPkg;

app.use(router);
app.use(pinia)

app.use(head);

app.use(VueGoogleMaps, {
    load: {
      autobindAllEvents: true,
      key: env.variables.value.GOOGLE_MAPS_API,
      libraries: 'places',
      language: 'en',
    },
    vue: {
      compilerOptions: {
        isCustomElement: true,
      },
    },
  });

  app.use(VueGtag, {
    config: {
      id: env.variables.value.GTM_ID,
    }
  })

  app.directive('maska', {
    updated: maska,
  });

  app.directive('GTMTrackEvent', {
    mounted(el: Element, binding) {
      el.addEventListener('click', function handleClick(event: Event) {
        TrackGTMEvent(binding.value);
      })
    }
  });
  
app.mount("#app");