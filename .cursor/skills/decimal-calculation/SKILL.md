---
name: decimal-calculation
description: 金额、汇总、比例等精度计算统一使用 @/utils/decimal，避免浮点误差。
---

# Decimal 精度计算规范

涉及 `+ - * /` 且用于金额、报表、导出、占比时，使用 `@/utils/decimal`。

## 常用 API

- `toDecimal` / `decimalAdd` / `decimalSub` / `decimalMul` / `decimalDiv` / `decimalSum`
- `decimalToNumber` / `decimalToString` / `decimalToFixed`
- 快捷：`toAdd` / `toSub` / `toMul` / `toDiv`

## 推荐

```ts
import { decimalAdd, decimalToNumber, toAdd } from '@/utils/decimal';

row.input = decimalToNumber(decimalAdd(row.input, current.input));
row.output = toAdd(row.output, current.output);
```

## 禁止

```ts
const total = Number(revenue) - Number(balance);
sum += Number(item.amount);
```

## 检查

页面与导出是否同一套计算；循环累加是否用 decimal 方法。
