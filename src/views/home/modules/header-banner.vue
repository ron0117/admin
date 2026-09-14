<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

defineOptions({ name: 'HeaderBanner' });

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <ElCard class="card-wrapper">
    <ElRow :gutter="gap" class="px-8px">
      <div class="flex-y-center">
        <div class="size-72px shrink-0 overflow-hidden rd-1/2">
          <img src="@/assets/imgs/soybean.jpg" class="size-full" />
        </div>
        <div class="pl-12px">
          <h3 class="text-18px font-semibold">
            {{ $t('page.home.greeting', { userName: authStore.userInfo.name }) }}
          </h3>
        </div>
      </div>
    </ElRow>
  </ElCard>
</template>

<style scoped></style>
