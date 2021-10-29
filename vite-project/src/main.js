import { createApp } from 'vue'
import App from './App.vue'
import VueLazyLoad from 'vue3-lazyload'
import VirtualList from '@supertiger/vue-3-virtual-scroll-list'

createApp(App)
  .use(VirtualList)
  .use(VueLazyLoad, {
    loading: '/anon-card-image-placeholder.svg',
    log: false
  })
  .mount('#app')
