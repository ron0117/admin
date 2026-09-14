import { $t, type GlobalLangType, GlobalLangs } from '@/locales';
/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T, T[keyof T]>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string | number, App.I18n.I18nKey>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

/**
 * 创建多语言字段的默认值
 *
 * @example
 *   ```ts
 *   // 创建空字符串的多语言对象
 *   const name = createI18nField('');
 *   // { 'zh-tw': '', 'zh-cn': '', 'en-us': '' }
 *
 *   // 创建对象的多语言配置
 *   const icon = createI18nField({ img: '' });
 *   // { 'zh-tw': { img: '' }, 'zh-cn': { img: '' }, 'en-us': { img: '' } }
 *   ```
 *
 * @param defaultValue 每个语言的默认值
 * @returns 包含所有语言的多语言对象
 */
export function createI18nField<T>(defaultValue: T): Record<GlobalLangType, T> {
  return Object.fromEntries(GlobalLangs.map((lang: GlobalLangType) => [lang, defaultValue])) as Record<
    GlobalLangType,
    T
  >;
}

/**
 * 多语言过滤限制默认语言
 * options: string | { 'zh-tw': string, 'en-us': string } | { zh-tw: { png: string, json: string, atlat: string, url?: string, svg?: string, spine: boolean } }
 */
export function filterOptionsByLocale(options: CommonType.i18nOptions) {
  const locale = GlobalLangs[0];
  if (typeof options === 'string') {
    return options;
  }
  if (typeof options === 'object' && options[locale]) {
    return options[locale];
  }
  return options;
}

/**
 * 根据游戏ID从游戏列表中查找游戏名称
 *
 * @example
 *   ```ts
 *   const games = [
 *     { id: 1, name: { 'zh-cn': '老虎机', 'en-us': 'Slot' } },
 *     { id: 2, name: { 'zh-cn': '扑克', 'en-us': 'Poker' } }
 *   ];
 *   const gameName = getGameNameById(1, games);
 *   // 返回当前语言的游戏名称，例如：'老虎机'
 *   ```
 *
 * @param gameId 游戏ID
 * @param games 游戏列表
 * @param defaultValue 未找到时的默认值，默认为 '-'
 * @returns 游戏名称（当前语言）或默认值
 */
export function getGameNameById(
  gameId: number | null | undefined,
  games: Array<{ id: number; name: Record<GlobalLangType, string> }> = [],
  defaultValue: string = '-'
): string {
  if (!gameId) {
    return defaultValue;
  }

  const game = games.find(item => item.id === gameId);
  if (!game) {
    return defaultValue;
  }

  return filterOptionsByLocale(game.name) as string;
}
