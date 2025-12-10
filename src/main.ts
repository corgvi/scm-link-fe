import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as auth from '@/services/auth'

const app = createApp(App)
app.use(router)
app.mount('#app')

// On app start: validate token, try refresh if expired
;(async () => {
  try {
    const token = auth.getToken()
    if (token) {
      const intros = await auth.introspect(token)
      if (!(intros?.code === 1000 && intros.result?.valid)) {
        const rt = auth.getRefreshToken()
        if (rt) {
          try {
            await auth.refreshTokenRequest(rt)
            console.info('Token refreshed on startup')
          } catch (e) {
            console.warn('Refresh failed on startup', e)
            auth.setToken(null)
            auth.setRefreshToken(null)
            auth.setUserInfo(null)
          }
        } else {
          auth.setToken(null)
          auth.setUserInfo(null)
        }
      }
    }
  } catch (e) {
    console.warn('Auth startup check failed', e)
  }
})()
