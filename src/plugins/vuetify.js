import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import fr from 'vuetify/es5/locale/fr'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple.darken3,
        secondary: colors.deepPurple.lighten1,
        tertiary: colors.deepPurple.lighten5
      }
    }
  },
  icons: {
    iconfont: 'md'
  },
  lang: {
    locales: { fr },
    current: 'fr'
  }
})
