/** Locale source encoding: UTF-8 */
import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import messages from './locale';

/**
 * 定义全局的使用的语言类型
 */
export type GlobalLangType = 'zh-cn' | 'en-us' | 'zh-tw';
export const GlobalLangs: GlobalLangType[] = ['zh-cn', 'zh-tw', 'en-us'];

const i18n = createI18n({
  locale: localStg.get('lang') || 'zh-cn',
  fallbackLocale: 'zh-cn',
  messages,
  legacy: false
});

/**
 * Setup plugin i18n
 *
 * @param app
 */
export function setupI18n(app: App) {
  app.use(i18n);
}

export const $t = i18n.global.t as App.I18n.$T;

export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
}
