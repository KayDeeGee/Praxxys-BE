import { createRouter, createWebHistory } from 'vue-router'
import { useApi } from '@/composables/useApi'

import Login from '@/pages/login.vue'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products/index.vue'
import CreateProduct from '@/pages/Products/create.vue'
import EditProduct from '@/pages/Products/edit.vue'
import Videos from '@/pages/Videos.vue'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes (default layout)
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'Home', component: Home },
        { path: 'login', name: 'Login', component: Login },
      ],
    },

    // Authenticated routes (with sidebar)
    {
      path: '/',
      component: AuthLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'products', name: 'Products', component: Products },
        { path: 'products-create', name: 'CreateProduct', component: CreateProduct },
        { path: 'products/:id/edit', name: 'EditProduct', component: EditProduct, props: true },
        { path: 'videos', name: 'Videos', component: Videos },
      ],
    },

    // Catch-all redirect
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth ?? false

  if (!requiresAuth) {
    return next()
  }

  try {
    const user = await useApi().fetchWithCsrf('/user')
    console.log('Logged in as:', user)

    next()
  } catch (err) {
    console.log('Not authenticated:', err)
    next('/login')
  }
})
export default router
