import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

import './plugins/acl'

Vue.config.productionTip = false
Vue.use(Vuelidate)

Vue.prototype.$getUniqueId = (len, prefix) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const UniqueId = []
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  for (let i = 0; i < len; i += 1) UniqueId[i] = chars[Math.random() * chars.length | 0]

  return `${prefix}-${UniqueId.join('')}`
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
