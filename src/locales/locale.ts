/** Locale source encoding: UTF-8 */
import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';
import zhTW from './langs/zh-tw';

const locales: Record<string, App.I18n.Schema> = {
  'zh-cn': zhCN,
  'en-us': enUS,
  'zh-tw': zhTW
};

export default locales;
