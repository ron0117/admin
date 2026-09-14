import type { App } from 'vue';
import ElementPlus, { ElCard, ElForm, ElTable, ElTableColumn } from 'element-plus';
import VXETable from 'vxe-table';
import VXETablePluginElement from 'vxe-table-plugin-element';
import 'vxe-table/lib/style.css';
import 'vxe-table-plugin-element/dist/style.css';
import '@/styles/scss/vxe-table.scss';

/** global table column align */
((ElTableColumn as any).props ??= {}).align = {
  type: String,
  default: 'center'
};
// 兼容旧写法：部分版本挂在 ElTable.TableColumn 上
try {
  ((ElTable as any).TableColumn.props ??= {}).align = {
    type: String,
    default: 'center'
  };
} catch {
  // ignore
}

/** global ElCard shadow */
((ElCard as any).props ??= {}).shadow = {
  type: String,
  default: 'never'
};

/** global ElForm require asterisk position */
((ElForm as any).props ??= {}).requireAsteriskPosition = {
  type: String,
  default: 'right'
};

/** 配置 vxe-table */
VXETable.use(VXETablePluginElement);

/** full import ElementPlus and VXETable */
export const setupUI = (app: App) => {
  app.use(ElementPlus);
  app.use(VXETable);
};
