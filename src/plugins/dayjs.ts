import dayjs, { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { setDayjsLocale } from '../locales/dayjs';

export function setupDayjs() {
  extend(localeData);
  extend(utc);
  extend(timezone);

  // 默认时区：东八区（上海）
  dayjs.tz.setDefault('Asia/Shanghai');

  setDayjsLocale();
}
