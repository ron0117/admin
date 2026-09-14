/** Locale source encoding: UTF-8 */
import { locale } from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-tw';
import { localStg } from '@/utils/storage';

/**
 * Set dayjs locale
 *
 * @param lang
 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-cn') {
  const localMap = {
    'zh-cn': 'zh-cn',
    'en-us': 'en',
    'zh-tw': 'zh-tw'
  } satisfies Record<App.I18n.LangType, string>;

  const l = lang || localStg.get('lang') || 'zh-cn';

  locale(localMap[l]);
}
