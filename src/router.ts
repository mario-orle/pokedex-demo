import { createRouter, createWebHashHistory } from 'vue-router'

import List from './components/List.vue'
import Detail from './components/Detail.vue'

const routes = [
  { path: '/', component: List },
  { path: '/:name', component: Detail },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
