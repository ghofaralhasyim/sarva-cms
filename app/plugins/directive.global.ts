import { defineNuxtPlugin } from '#app';
import { registerGlobalDirectives } from '~/composables/useDirectives';

export default defineNuxtPlugin((nuxtApp) => {
  registerGlobalDirectives(nuxtApp.vueApp); 
});
