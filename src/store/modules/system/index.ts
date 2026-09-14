// 系统模块：模板态仅保留空缓存骨架，不依赖业务 API
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { SimplifiedError } from '@/service/request/type';
import { SetupStoreId } from '@/enum';

/** 店家 / 代理商下拉统一选项结构 */
export type BoUserSelectOption = { label: string; value: string; name: string };

export const useSystemStore = defineStore(SetupStoreId.System, () => {
  const games = ref<unknown[]>([]);
  const setGames = (gamesList?: unknown[]) => {
    games.value = gamesList ?? [];
  };

  const brandList = ref<unknown[]>([]);
  const brandCacheLoaded = ref(false);
  const brandLoading = ref(false);

  const getBrandById = (_brandId: number | null | undefined) => null;
  const getBrandNameById = (_brandId: number | null | undefined): string => '';
  const brandSelectOptions = computed(() => [] as { value: number; label: string }[]);
  const fetchBrands = async () => {
    brandCacheLoaded.value = true;
    return brandList.value;
  };

  const boProxySelectOptions = ref<BoUserSelectOption[]>([]);
  const boProxyListLoaded = ref(false);

  const ensureBoUserStoreOptions = async (
    _params?: unknown,
    _force = false
  ): Promise<{ options: BoUserSelectOption[]; error: SimplifiedError | null }> => ({
    options: [],
    error: null
  });

  const ensureBoProxySelectOptions = async (
    _force = false
  ): Promise<{ options: BoUserSelectOption[]; error: SimplifiedError | null }> => {
    boProxyListLoaded.value = true;
    return { options: boProxySelectOptions.value, error: null };
  };

  const ensureStoresUnderProxy = async (
    _parentUserId?: string,
    _force = false
  ): Promise<{ options: BoUserSelectOption[]; error: SimplifiedError | null }> => ({
    options: [],
    error: null
  });

  const resetBoUserRelationCaches = () => {
    boProxySelectOptions.value = [];
    boProxyListLoaded.value = false;
  };

  return {
    games,
    setGames,
    brandList,
    brandCacheLoaded,
    brandLoading,
    brandSelectOptions,
    fetchBrands,
    getBrandById,
    getBrandNameById,
    boProxySelectOptions,
    boProxyListLoaded,
    ensureBoUserStoreOptions,
    ensureBoProxySelectOptions,
    ensureStoresUnderProxy,
    resetBoUserRelationCaches
  };
});
