import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import List from './components/List.vue'
import Detail from './components/Detail.vue'

const routes = [
  { path: '/', component: List },
  { path: '/:id', component: Detail },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
