/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/index.scss';
import { createVuetify } from 'vuetify'

// Table Lab

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VBtn: {
      class: 'text-none',
      rounded: 'lg',
      variant: 'elevated'
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
    },
    VCard: {
      rounded: 'xl',
      VCardTitle: {
        class: 'py-4'
      },
      VCardText: {
        class: 'px-4 py-0'
      },
      VCardActions: {
        class: 'pa-4'
      }
    },
    VContainer: {
      fluid: true
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1a73e8',
          error: '#E0374B',
          info: '#2351F3',
          success: '#28BD49',
          warning: '#F57F3D'
        },
      },
      dark: {
        colors: {
          background: '#010101',
          surface: '#242424',
          primary: '#F50000',
          error: '#E0374B',
          info: '#2351F3',
          success: '#28BD49',
          warning: '#F57F3D'
        },
      }
    },
  },
  components: {}
})
