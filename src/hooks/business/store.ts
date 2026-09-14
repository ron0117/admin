import { computed } from 'vue';
import type { BoUserSelectOption } from '@/store/modules/system';
import { useSystemStore } from '@/store/modules/system';
import { useRole } from '@/hooks/business/role';
import { $t } from '@/locales';

/** `syncStoreOptionsWithProxies` 合并店家下拉后的结果 */
export type SyncBoStoreProxyLinkageResult =
  | { ok: false }
  | { ok: true; storeOptions: BoUserSelectOption[]; storeIds: string[] };

export type SyncBoStoreProxyLinkageArgs = {
  /** 已解析的代理商 boUserId（若表单有「全选」占位，由调用方先展开） */
  resolvedProxyIds: string[];
  currentStoreIds: string[];
};

/**
 * BO 店家与代理商下拉联动（组合逻辑）。
 *
 * - **Pinia `useSystemStore`**：只负责接口数据缓存与 `ensure*`，不关心表单 `proxyIds` / `storeIds` 形态。
 * - **本 Hook**：根据层级权限、`resolvedProxyIds` 决定拉「全量 find-store」还是合并「bound-list」，并裁剪 `storeIds`。
 * return {
 *    // 代理商多选下拉选项（不含「全选」占位；若需要请在页面内自行 prepend）
 *    proxySelectOptions: TCommon.SelectItem[];
 *    // 挂载时拉取代理商列表写入 systemStore（无权限则跳过）
 *    ensureBoProxySelectLoaded: () => Promise<void>;
 *    // 按已解析的 `resolvedProxyIds` 刷新店家选项，并返回裁剪后的 `storeIds`。
 *    syncStoreOptionsWithProxies: (args: SyncBoStoreProxyLinkageArgs) => Promise<SyncBoStoreProxyLinkageResult>;
 * }
 */
export const useBoStoreProxyLinkage = () => {
  const systemStore = useSystemStore();
  const { judgeStoreHierarhPrivilege } = useRole();

  /** 具备代理层级相关 UI（多选代理/店家）时为 true；店家账号为 false */
  const hasProxyStoreLinkageUi = computed(() => judgeStoreHierarhPrivilege());

  /** 代理商多选下拉选项（不含「全选」占位；若需要请在页面内自行 prepend） */
  const proxySelectOptions = computed(() =>
    systemStore.boProxySelectOptions.map(p => ({
      label: p.label,
      value: p.value
    }))
  );

  /** 挂载时拉取代理商列表写入 systemStore（无权限则跳过） */
  const ensureBoProxySelectLoaded = async () => {
    if (!hasProxyStoreLinkageUi.value) return;
    await systemStore.ensureBoProxySelectOptions();
  };

  /**
   * 按已解析的 `resolvedProxyIds` 刷新店家选项，并返回裁剪后的 `storeIds`。
   * 无 `hasProxyStoreLinkageUi` 时等价于拉全量 `find-store`（金流等页「仅店家账号」场景）。
   */
  const syncStoreOptionsWithProxies = async (
    args: SyncBoStoreProxyLinkageArgs
  ): Promise<SyncBoStoreProxyLinkageResult> => {
    const { resolvedProxyIds, currentStoreIds } = args;

    const trimToAllowed = (options: BoUserSelectOption[]) => {
      const allowed = new Set(options.map(o => String(o.value)));
      return currentStoreIds.filter(id => allowed.has(String(id)));
    };

    if (!hasProxyStoreLinkageUi.value) {
      const { options, error } = await systemStore.ensureBoUserStoreOptions();
      if (error) {
        window.$message?.error(error?.msg ?? '');
        return { ok: false };
      }
      return { ok: true, storeOptions: options, storeIds: trimToAllowed(options) };
    }

    const ids = resolvedProxyIds.filter(Boolean);
    if (ids.length === 0) {
      const { options, error } = await systemStore.ensureBoUserStoreOptions();
      if (error) {
        window.$message?.error(error?.msg ?? '');
        return { ok: false };
      }
      return { ok: true, storeOptions: options, storeIds: trimToAllowed(options) };
    }

    const results = await Promise.all(ids.map(pid => systemStore.ensureStoresUnderProxy(pid)));
    for (const { error } of results) {
      if (error) {
        window.$message?.error(error?.msg ?? $t('common.requestFailed'));
        return { ok: false };
      }
    }

    // 合并去重
    const merged = new Map<string, BoUserSelectOption>();
    for (const { options } of results) {
      for (const o of options) {
        if (!merged.has(o.value)) merged.set(o.value, o);
      }
    }
    // 排序
    const storeOptions = [...merged.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-Hans-CN'));
    return { ok: true, storeOptions, storeIds: trimToAllowed(storeOptions) };
  };

  return {
    proxySelectOptions,
    ensureBoProxySelectLoaded,
    syncStoreOptionsWithProxies
  };
};
