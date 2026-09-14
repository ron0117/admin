/** 数字千分位展示；空值或非法数字返回 `-` */
export const formatThousands = (val: unknown): string => {
  if (val === undefined || val === null || val === '') return '-';
  const num = Number(val);
  if (!Number.isFinite(num)) return '-';
  return num.toLocaleString();
};
