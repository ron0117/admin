export type ProxyModelKindView = {
  selected: string;
  source: 'database' | 'env';
  catalog: string[];
  fetchedAt: string | null;
  fetchError: string | null;
};

export type AdminProxyModels = {
  text: ProxyModelKindView;
  image: ProxyModelKindView;
};

export function proxyModelStale(catalog: readonly string[], value: string): boolean {
  const id = value.trim();
  return Boolean(id) && !catalog.includes(id);
}

/** 目录为空，或当前值不在目录中时，允许手填。 */
export function allowManualProxyModel(catalog: readonly string[], value: string): boolean {
  return catalog.length === 0 || !catalog.includes(value.trim());
}

export function proxyModelIdError(value: string, label: string): string | null {
  const id = value.trim();
  if (!id || id.length > 200 || /\s/.test(id)) {
    return `${label}需为 1–200 个字符，且不能包含空白。`;
  }
  return null;
}
