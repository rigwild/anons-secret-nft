import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './Home.vue'
import AnonSolo from './AnonSolo.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      props: route => ({ sortBy: route.query.sortBy || 'id', filterTrait: route.query.filterTrait || '' })
    },
    { path: '/anon/:anonId', component: AnonSolo, props: true }
  ]
})

createApp(App).use(router).mount('#app')
