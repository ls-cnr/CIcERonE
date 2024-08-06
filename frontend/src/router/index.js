import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Dashboard from '../components/Dashboard.vue'
import Profile from '../components/Profile.vue'
import NewProject from '../components/NewProject.vue'
import ProjectView from '../components/ProjectView.vue'
import AcquireViewpoint from '../components/AcquireViewpoint.vue'
import EditProjectInfo from '../components/EditProjectInfo.vue'  // Importa il nuovo componente

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/new-project',
    name: 'NewProject',
    component: NewProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: ProjectView,
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id/acquire-viewpoint',
    name: 'AcquireViewpoint',
    component: AcquireViewpoint,
    meta: { requiresAuth: true }
  },
  {
    path: '/project/:id/edit',  // Nuova rotta per EditProjectInfo
    name: 'EditProjectInfo',
    component: EditProjectInfo,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
