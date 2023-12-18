/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import 'animate.css';


// Components
import App from './App.vue';

import { createApp } from 'vue';
// Plugins
import { registerPlugins } from '@/plugins';

import router from '@/router'
import './permission.js';

const app = createApp(App)

registerPlugins(app)


if (import.meta.env.MODE === 'staging') {
  // Sentry.init({
  //   environment: "production",
  //   app,
  //   dsn: "https://218041b3c0a9f63a55cd1449b303c58d@o4504053360951296.ingest.sentry.io/4506142489182208",
  //   integrations: [
  //     new Sentry.BrowserTracing({
  //       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //       tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //     }),
  //     new Sentry.Replay(),
  //   ],
  //   // Performance Monitoring
  //   tracesSampleRate: 1.0, // Capture 100% of the transactions
  //   // Session Replay
  //   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  //   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // });
}

app.use(router)

router
  .isReady()
  .then(() => {
    app.mount('#app')
  })

