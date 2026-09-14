import { createApp } from 'vue';
import './plugins/assets';
import {
  // setupAppVersionNotification,
  setupDayjs,
  setupDirectives,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
  setupUI
} from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupUI(app);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupDirectives(app);
  // 版本更新通知
  // setupAppVersionNotification();

  app.mount('#app');
}

setupApp();
