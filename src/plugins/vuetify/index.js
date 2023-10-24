import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import ja from 'vuetify/lib/locale/ja'
import preset from './default-preset/preset'

Vue.use(Vuetify)

export default new Vuetify({
  preset,
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
      variations: false,
    },
  },
  lang: {
    locales: { ja },
    current: 'ja',
  },
})
