import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/login.vue'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products/index.vue'
import CreateProduct from '@/pages/Products/create.vue'
import EditProduct from '@/pages/Products/edit.vue'

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
      children: [
        { path: 'products', name: 'Products', component: Products },
        { path: 'products-create', name: 'CreateProduct', component: CreateProduct },
        { path: 'products/:id/edit', name: 'EditProduct', component: EditProduct, props: true },
      ],
    },

    // Catch-all redirect
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

export default router
