import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './Home.vue'
import AnonSolo from './AnonSolo.vue'
import Exhibited from './Exhibited.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      props: route => ({ sortBy: route.query.sortBy || 'id', filterTrait: route.query.filterTrait || '' })
    },
    { path: '/anon/:anonId', component: AnonSolo, props: true },
    { path: '/exhibited', component: Exhibited }
  ]
})

createApp(App).use(router).mount('#app')
