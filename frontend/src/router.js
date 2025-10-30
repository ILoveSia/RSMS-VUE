import { createRouter, createWebHistory } from 'vue-router'
import OrganizationList from './views/OrganizationList.vue'
import PositionList from './views/PositionList.vue'

const routes = [
  { path: '/', redirect: '/organizations' },
  { path: '/organizations', component: OrganizationList },
  { path: '/positions', component: PositionList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
