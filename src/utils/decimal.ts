import Decimal from 'decimal.js';

export type DecimalInput = Decimal.Value | null | undefined | '';

/** 将任意输入转为 Decimal，异常或空值回退为 0 */
export const toDecimal = (value: DecimalInput): Decimal => {
  if (value === undefined || value === null || value === '') return new Decimal(0);
  try {
    if (typeof value === 'string') return new Decimal(value.trim() || '0');
    return new Decimal(value);
  } catch {
    return new Decimal(0);
  }
};

/** 精确加法 */
export const decimalAdd = (left: DecimalInput, right: DecimalInput): Decimal => toDecimal(left).plus(toDecimal(right));

/** 精确减法 */
export const decimalSub = (left: DecimalInput, right: DecimalInput): Decimal => toDecimal(left).minus(toDecimal(right));

/** 精确乘法 */
export const decimalMul = (left: DecimalInput, right: DecimalInput): Decimal => toDecimal(left).mul(toDecimal(right));

/** 精确除法（除数为 0 返回 0） */
export const decimalDiv = (left: DecimalInput, right: DecimalInput): Decimal => {
  const denominator = toDecimal(right);
  if (denominator.isZero()) return new Decimal(0);
  return toDecimal(left).div(denominator);
};

/** 多值精确求和 */
export const decimalSum = (values: DecimalInput[]): Decimal =>
  values.reduce<Decimal>((acc, cur) => acc.plus(toDecimal(cur)), new Decimal(0));

/** 精确结果转 number（用于图表、表格数值字段） */
export const decimalToNumber = (value: DecimalInput): number => toDecimal(value).toNumber();

/** 精确结果转 string（默认自动裁剪末尾 0） */
export const decimalToString = (value: DecimalInput): string => toDecimal(value).toString();

/** 精确保留小数位，默认四舍五入 */
export const decimalToFixed = (value: DecimalInput, decimalPlaces = 2): string =>
  toDecimal(value).toFixed(decimalPlaces);

/** 转换加法 */
export const toAdd = (left: DecimalInput, right: DecimalInput): number => decimalToNumber(decimalAdd(left, right));

/** 转换减法 */
export const toSub = (left: DecimalInput, right: DecimalInput): number => decimalToNumber(decimalSub(left, right));

/** 转换乘法 */
export const toMul = (left: DecimalInput, right: DecimalInput): number => decimalToNumber(decimalMul(left, right));

/** 转换除法（除数为 0 返回 0） */
export const toDiv = (left: DecimalInput, right: DecimalInput): number => decimalToNumber(decimalDiv(left, right));
