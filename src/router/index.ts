import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('../views/Admin/Users.vue'),
      meta: {
        title: 'User Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/create-user',
      name: 'CreateUser',
      component: () => import('../views/Admin/CreateUser.vue'),
      meta: {
        title: 'Create User',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/edit-user/:userId',
      name: 'EditUser',
      component: () => import('../views/Admin/EditUser.vue'),
      meta: {
        title: 'Edit User',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/products',
      name: 'AdminProducts',
      component: () => import('../views/Admin/Product/Products.vue'),
      meta: {
        title: 'Product Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/create-product',
      name: 'CreateProduct',
      component: () => import('../views/Admin/Product/CreateProduct.vue'),
      meta: {
        title: 'Create Product',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/edit-product/:productId',
      name: 'EditProduct',
      component: () => import('../views/Admin/Product/EditProduct.vue'),
      meta: {
        title: 'Edit Product',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/suppliers',
      name: 'AdminSuppliers',
      component: () => import('../views/Admin/Product/Suppliers.vue'),
      meta: {
        title: 'Supplier Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/categories',
      name: 'AdminCategories',
      component: () => import('../views/Admin/Product/Categories.vue'),
      meta: {
        title: 'Category Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/warehouses',
      name: 'AdminWarehouses',
      component: () => import('../views/Admin/Inventory/Warehouses.vue'),
      meta: {
        title: 'Warehouse Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/orders',
      name: 'AdminOrders',
      component: () => import('../views/Admin/Order/Orders.vue'),
      meta: {
        title: 'Order Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/order-detail/:orderId',
      name: 'AdminOrderDetail',
      component: () => import('../views/Admin/Order/OrderDetail.vue'),
      meta: {
        title: 'Order Detail',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/inventories',
      name: 'AdminInventories',
      component: () => import('../views/Admin/Inventory/Inventories.vue'),
      meta: {
        title: 'Warehouse Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/transactions',
      name: 'AdminTransactions',
      component: () => import('../views/Admin/Inventory/Transactions.vue'),
      meta: {
        title: 'Transaction Management',
        requiresAdmin: true,
      },
    },
    {
      path: '/error-403',
      name: '403 Error',
      component: () => import('../views/Errors/FourZeroThree.vue'),
      meta: {
        title: '403 Error',
      },
    },
    {
      path: '/error-500',
      name: '500 Error',
      component: () => import('../views/Errors/FiveHundred.vue'),
      meta: {
        title: '500 Error',
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `SCM-Link ${to.meta.title} | SCM-Link Admin Dashboard`
  next()
})
