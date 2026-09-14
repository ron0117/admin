---
trigger: check-permission
description: 检查权限配置
---

# check-permission - 检查权限配置

检查页面或组件的权限配置是否正确。

## 触发条件

用户需要检查权限时，例如：
- "检查这个页面的权限配置"
- "这个按钮为什么没有显示"
- "帮我看看权限设置对不对"

## 检查项目

### 1. 路由权限配置
检查 `src/roleConfig.ts` 中是否配置了对应路径：
```typescript
{
  label: '页面名称',
  path: '/member/basic',  // 路径是否正确
  pathType: 'menu',
  buttons: [...]  // 按钮权限是否配置
}
```

### 2. 页面权限使用
检查页面中是否正确使用了权限 hook：
```typescript
import { useRole } from '@/hooks/business/role';

const { shouldShowComponent, hasButtonPrivilege } = useRole();
const PAGE_PATH = '/member/basic';

// read 权限
<组件 v-if="shouldShowComponent('read')" />

// write 权限
<组件 v-if="shouldShowComponent('write')" />

// 按钮权限
<按钮 v-if="hasButtonPrivilege('/member/basic:delete')" />
```

### 3. 用户权限检查
检查当前用户是否拥有该权限：
```typescript
// 在浏览器控制台执行
const privileges = localStorage.getItem('privileges');
console.log(JSON.parse(privileges));
```

### 4. 权限类型说明
| 权限类型 | 说明 | 显示内容 |
|---------|------|---------|
| none | 无权限 | 全部不显示 |
| read | 只读权限 | 显示查看类组件 |
| write | 读写权限 | 显示全部组件 + 操作按钮 |

## 输出

1. 列出检查结果
2. 指出缺失的配置
3. 提供修复建议
