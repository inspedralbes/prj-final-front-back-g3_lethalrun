import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('VueCropper', VueCropper);
});
