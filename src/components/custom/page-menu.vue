<script setup lang="ts">
import type { Component } from 'vue';
import { defineAsyncComponent, markRaw, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { TabsPaneContext } from 'element-plus';

defineOptions({ name: 'JQPageMenu' });

type TModule = {
  path: string;
  component?: Component | null;
  label: string;
  children?: TModule[];
  sort: number;
};

const route = useRoute();

/** 获取所有菜单模块 */
const modules = import.meta.glob<Component>(`@/views/**/menu.vue`);
const configs = import.meta.glob<{ default: { sort: number; name: string } }>(`@/views/**/config.ts`);
const currentModules = ref<TModule[]>([]);
const activeName = ref('');
const activeChildName = ref('');

const configPathReg = /\/views\/(.*)\/config\.ts$/;
const asyncComponentCache = new WeakMap<() => Promise<Component>, Component>();

function toAsyncComponent(loader?: () => Promise<Component>): Component | null {
  if (!loader) return null;
  const cached = asyncComponentCache.get(loader);
  if (cached) return cached;
  // 避免把 Component 放进响应式对象后被深度代理（Vue 会给出性能警告）
  const c = markRaw(defineAsyncComponent(loader));
  asyncComponentCache.set(loader, c);
  return c;
}

async function buildModules(routePath: string) {
  const configPaths = Object.keys(configs).filter(p => p.includes(routePath));

  const parents: TModule[] = [];
  const parentByPath = new Map<string, TModule>();
  const childrenByParent = new Map<string, TModule[]>();

  await Promise.all(
    configPaths.map(async configFilePath => {
      const match = configFilePath.match(configPathReg);
      if (!match) return;

      const modulePath = match[1];
      const arr = modulePath.split('/');

      const menuFilePath = configFilePath.replace('/config.ts', '/menu.vue');
      const configFile = configs[configFilePath];

      let sort = 999;
      let name = modulePath.split('/').join('.');
      if (configFile) {
        const config = await configFile();
        sort = config.default.sort;
        name = config.default.name;
      }

      const module: TModule = {
        path: modulePath,
        component: toAsyncComponent(modules[menuFilePath]),
        label: name,
        sort
      };

      // 三级菜单：test/menu2/tab1
      if (arr.length === 3) {
        parents.push(module);
        parentByPath.set(module.path, module);
        return;
      }

      // 四级菜单：test/menu2/tab3/child1 -> parent=test/menu2/tab3
      if (arr.length === 4) {
        const parentPath = `${arr[0]}/${arr[1]}/${arr[2]}`;
        const list = childrenByParent.get(parentPath);
        if (list) list.push(module);
        else childrenByParent.set(parentPath, [module]);
      }
    })
  );

  // 将子菜单挂到父菜单；若父菜单不存在则创建一个分组节点
  for (const [parentPath, childModules] of childrenByParent) {
    const parentModule = parentByPath.get(parentPath);
    if (parentModule) {
      parentModule.children = childModules;
    } else {
      parents.push({
        path: parentPath,
        label: parentPath.split('/').join('.'),
        children: childModules,
        sort: 999
      });
    }
  }

  // 排序（父、子都按 sort 升序）
  parents.sort((a, b) => a.sort - b.sort);
  parents.forEach(m => m.children?.sort((a, b) => a.sort - b.sort));

  return parents;
}

/**
 * 默认选中第一个子菜单
 * @param tab 点击的tab
 */
const handleTabClick = (tab: TabsPaneContext) => {
  const target = currentModules.value.find(module => module.path === tab.paneName);
  if (target && target.children?.length) {
    activeChildName.value = target.children?.[0]?.path || '';
  }
};

let buildId = 0;
watch(
  () => route.path,
  async routePath => {
    buildId += 1;
    const id = buildId;
    const modulesBuilt = await buildModules(routePath);
    if (id !== buildId) return;

    // 模板态：不过滤 privilege，展示全部 Tab
    currentModules.value = modulesBuilt;
    activeName.value = currentModules.value[0]?.path || '';
    activeChildName.value = currentModules.value[0]?.children?.[0]?.path || '';
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-0 flex flex-col flex-1 overflow-hidden lt-sm:overflow-auto">
    <ElTabs
      v-model="activeName"
      type="border-card"
      class="page-menu-tabs min-h-0 flex flex-col flex-1 overflow-hidden"
      @tab-click="handleTabClick"
    >
      <ElTabPane
        v-for="module in currentModules"
        :key="module.path"
        :label="module.label"
        :name="module.path"
        class="h-full min-h-0"
        lazy
      >
        <ElTabs
          v-if="module.children?.length"
          v-model="activeChildName"
          tab-position="left"
          class="page-menu-tabs-left h-full min-h-0 flex-1 overflow-hidden"
        >
          <ElTabPane
            v-for="child in module.children"
            :key="child.path"
            :label="child.label"
            :name="child.path"
            class="h-full min-h-0"
            lazy
          >
            <component :is="child.component" />
          </ElTabPane>
        </ElTabs>
        <component :is="module.component" v-else />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped lang="scss">
/** 与会员资料等页一致：让 Tab 内容区参与 flex 高度链，子页内表格才能出现内部滚动 */
.page-menu-tabs {
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-tabs__content) {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    .el-tab-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
  }
}

.page-menu-tabs-left {
  display: flex;
  flex-direction: row;
  min-height: 0;

  :deep(.el-tabs__header) {
    flex-shrink: 0;
  }

  :deep(.el-tabs__content) {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    .el-tab-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
  }
}
</style>
