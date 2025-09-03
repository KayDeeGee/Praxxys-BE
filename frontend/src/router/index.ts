import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/login.vue'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products/index.vue'
import CreateProduct from '@/pages/Products/create.vue'
import EditProduct from '@/pages/Products/edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/products',
      name: 'Products',
      component: Products,
    },
    {
      path: '/create-product',
      name: 'CreateProduct',
      component: CreateProduct,
    },
    {
      path: '/products/:id/edit',
      name: 'EditProduct',
      component: EditProduct,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

export default router
