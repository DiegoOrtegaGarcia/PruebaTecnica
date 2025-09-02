/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHistory } from 'vue-router/auto'
// eslint-disable-next-line import/no-duplicates
import { routes } from 'vue-router/auto-routes'
import { isAuthenticated } from '@/helpers/tokenHelpers' // Asegúrate de que esta función exista (usa tu helper de token)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  // Lista de rutas públicas (siempre accesibles)
  const publicRoutes = ['/login', '/register']

  // Verifica si la ruta actual requiere autenticación
  const isAuthRequired = !publicRoutes.includes(to.path)

  if (isAuthRequired && !isAuthenticated()) {
    // Redirige al login si no está autenticado
    next('/login?redirect=' + encodeURIComponent(to.fullPath))
  } else if (!isAuthRequired && isAuthenticated()) {
    // Si ya está autenticado y trata de acceder a login/register, redirige a inicio
    next('/')
  } else {
    // Permite la navegación
    next()
  }
})

// Workaround para el error de Vite (tu código existente)
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
