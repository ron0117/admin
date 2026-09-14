<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { useAuthStore } from '@/store/modules/auth';
import type { PermissionEvent } from '@/enum/permission';
import { PermissionEnum, PermissionListEnum } from '@/enum/permission';
import { $t as t } from '@/locales';

type TAuthItem = {
  type: PermissionEnum[keyof PermissionEnum];
  auth?: string;
};

type TProps = {
  title?: string;
  list?: Array<PermissionEnum[keyof PermissionEnum] | TAuthItem>;
};

type TEmit = {
  (event: PermissionEvent): void;
};

const authStore = useAuthStore();

const emit = defineEmits<TEmit>();

const props = withDefaults(defineProps<TProps>(), {
  title: t('common.action'),
  list: () => [PermissionEnum.view, PermissionEnum.edit, PermissionEnum.delete],
  perm: ''
});

const title = ref(props.title);

const handleClick = (event: PermissionEvent) => {
  if (event) {
    emit(event);
  }
};

const buttonList = computed(() => {
  return PermissionListEnum.filter(item => {
    return props.list
      .map(v => {
        if (typeof v === 'object' && authStore.hasAuth(v.auth)) {
          // 判断Auth逻辑
          return v.type;
        } else if (typeof v === 'string') {
          return v;
        }
        return '';
      })
      .includes(item.value);
  });
});
</script>

<template>
  <ElDropdown v-if="buttonList.length > 0">
    <ElButton type="primary" text>
      {{ title }}
      <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <div v-for="(item, index) in buttonList" :key="index">
          <ElDropdownItem @click="handleClick(item.event)">
            <slot :name="item.value">{{ item.name }}</slot>
          </ElDropdownItem>
        </div>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
:deep(.el-button:focus-visible) {
  outline: none;
}

:deep(.slot-dropdown-item) {
  padding: 7px 0;
  display: flex;
  justify-content: center;

  div,
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
}
</style>
