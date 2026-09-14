declare namespace UI {
  type ThemeColor = 'danger' | 'primary' | 'info' | 'success' | 'warning';

  // 当外层泛型未显式指定/无法推断时，避免把行类型推成 never（会导致 tooltipFormatter 等字段的泛型不匹配）
  type DataTableBaseColumn<T> = Partial<import('element-plus').TableColumnCtx<T extends object ? T : any>>;

  type TableColumnCheck = import('@sa/hooks').TableColumnCheck;

  type SetTableColumnKey<C, T> = Omit<C, 'prop'> & { prop?: keyof T | (string & {}) };

  type TableColumnWithKey<T> = SetTableColumnKey<DataTableBaseColumn<T>, T>;

  type TableColumn<T> = DataTableBaseColumn<T>;

  /**
   * the type of table operation
   *
   * - add: add table item
   * - edit: edit table item
   */
  type TableOperateType = 'add' | 'edit' | 'view';
}

// ======================================== element-plus ========================================

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any;
  export default locale;
}

declare module 'element-plus/dist/locale/en.mjs' {
  const locale: any;
  export default locale;
}

declare module 'element-plus/dist/locale/zh-tw.mjs' {
  const locale: any;
  export default locale;
}
