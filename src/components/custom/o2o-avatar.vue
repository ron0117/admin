<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

defineOptions({ name: 'O2oAvatar' });

interface ResponsiveSize {
  /** 默认大小 */
  default: number | string;
  /** 小于 640px */
  xs?: number | string;
  /** 小于 768px */
  sm?: number | string;
  /** 小于 1024px */
  md?: number | string;
  /** 小于 1280px */
  lg?: number | string;
  /** 小于 1536px */
  xl?: number | string;
}

interface Props {
  /**
   * 头像大小
   * - 可以是数字（单位px）
   * - 可以是字符串（如 '100px', '10rem', '15vw'）
   * - 可以是响应式对象，根据屏幕尺寸自动调整
   */
  size?: number | string | ResponsiveSize;
  /** 头像 */
  avatar?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 72,
  avatar: ''
});

const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
});

const sizeStyle = computed(() => {
  let sizeValue: number | string;

  if (typeof props.size === 'object') {
    // 响应式大小对象
    const responsiveSize = props.size as ResponsiveSize;
    const width = screenWidth.value;

    if (width < 640 && responsiveSize.xs !== undefined) {
      sizeValue = responsiveSize.xs;
    } else if (width < 768 && responsiveSize.sm !== undefined) {
      sizeValue = responsiveSize.sm;
    } else if (width < 1024 && responsiveSize.md !== undefined) {
      sizeValue = responsiveSize.md;
    } else if (width < 1280 && responsiveSize.lg !== undefined) {
      sizeValue = responsiveSize.lg;
    } else if (width < 1536 && responsiveSize.xl !== undefined) {
      sizeValue = responsiveSize.xl;
    } else {
      sizeValue = responsiveSize.default;
    }
  } else {
    // 简单值
    sizeValue = props.size;
  }

  const finalSize = typeof sizeValue === 'number' ? `${sizeValue}px` : sizeValue;
  return {
    width: finalSize,
    height: finalSize
  };
});
</script>

<template>
  <div :style="sizeStyle" class="o2o-avatar overflow-hidden rd-1/2 transition-all duration-300">
    <img v-if="props.avatar" :src="props.avatar" class="size-full" />
    <img v-else src="@/assets/imgs/soybean.jpg" class="size-full" />
  </div>
</template>

<style scoped></style>
