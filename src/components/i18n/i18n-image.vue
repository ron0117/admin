<script setup lang="ts">
import { computed, ref } from 'vue';
import type { UploadProps } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Delete, Plus, Upload as UploadIcon, ZoomIn } from '@element-plus/icons-vue';
import { fetchUploadFile } from '@/service/api';
import type { SimplifiedError } from '@/service/request';
import { createI18nField } from '@/utils/common';
import { $t, GlobalLangs } from '@/locales';
import type { GlobalLangType } from '@/locales';

interface Props {
  /** 多语言图片配置值 */
  modelValue?: Record<GlobalLangType, string | CommonType.I18nResourceConfig>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 文件大小限制（MB），0表示不限制 */
  maxSize?: number;
  /** 是否启用大小限制 */
  enableSizeLimit?: boolean;
  /** 支持的文件类型 */
  accept?: string;
  /** 图片宽度（可选） */
  width?: number | undefined;
  /** 图片高度（可选） */
  height?: number | undefined;
}

interface Emits {
  (e: 'update:modelValue', value: Record<GlobalLangType, string | CommonType.I18nResourceConfig>): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => createI18nField<string | CommonType.I18nResourceConfig>({ img: '' }),
  disabled: false,
  maxSize: 5,
  enableSizeLimit: true,
  accept: 'image/*',
  width: undefined,
  height: undefined
});

const emit = defineEmits<Emits>();

/** 语言标签映射 */
const langLabelMap: Record<GlobalLangType, string> = {
  'zh-cn': $t('common.lang.zh-cn'),
  'zh-tw': $t('common.lang.zh-tw'),
  'en-us': $t('common.lang.en-us')
};

/** 标签页配置 - 从全局语言配置动态生成 */
const tabs = computed(() =>
  GlobalLangs.map((lang: GlobalLangType) => ({
    name: lang,
    label: langLabelMap[lang] || lang
  }))
);

/** 当前激活的标签 */
const activeTab = ref<string>(GlobalLangs[0]);

/** 判断是否启用Spine - 根据modelValue中的spine参数判断 */
const isSpineMode = computed(() => {
  const firstLangValue = props.modelValue?.[GlobalLangs[0]];
  return (
    typeof firstLangValue === 'object' &&
    firstLangValue !== null &&
    'spine' in firstLangValue &&
    firstLangValue.spine === true
  );
});

/** Spine开关 */
const spineEnabled = computed({
  get: () => isSpineMode.value,
  set: (val: boolean) => {
    // 切换spine状态时，转换数据格式
    const newValue = createI18nField<string | CommonType.I18nResourceConfig>(
      val ? { png: '', json: '', atlas: '', img: '', svg: '', spine: true } : { img: '' }
    );
    emit('update:modelValue', newValue);
  }
});

/** 获取当前语言的配置 */
function getCurrentConfig(): string | CommonType.I18nResourceConfig {
  return (
    props.modelValue?.[activeTab.value as GlobalLangType] ||
    (isSpineMode.value ? { png: '', json: '', atlas: '', img: '', svg: '', spine: true } : { img: '' })
  );
}

/** 更新当前语言的配置 */
function updateCurrentConfig(value: string | CommonType.I18nResourceConfig) {
  const newValue = { ...props.modelValue };
  newValue[activeTab.value as GlobalLangType] = value;
  emit('update:modelValue', newValue);
}

/** 简单模式：图片 img 字段 */
const simpleImg = computed({
  get: () => {
    const config = getCurrentConfig();
    return typeof config === 'object' && 'img' in config ? config.img || '' : '';
  },
  set: (val: string) => {
    updateCurrentConfig({ img: val });
  }
});

/** Spine模式：配置对象 */
const spineConfig = computed(() => {
  const config = getCurrentConfig();
  if (typeof config === 'object' && 'spine' in config && config.spine === true) {
    return config as CommonType.I18nSpineConfig;
  }
  return { png: '', json: '', atlas: '', img: '', svg: '', spine: true } as CommonType.I18nSpineConfig;
});

/** 更新Spine配置的字段 */
function updateSpineField(field: keyof Omit<CommonType.I18nSpineConfig, 'spine'>, value: string) {
  const config = spineConfig.value;
  const newConfig: CommonType.I18nSpineConfig = { ...config, [field]: value };
  updateCurrentConfig(newConfig);
}

/** 处理文件上传前的验证 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  if (props.enableSizeLimit && props.maxSize > 0) {
    const sizeMB = rawFile.size / 1024 / 1024;
    if (sizeMB > props.maxSize) {
      ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`);
      return false;
    }
  }
  return true;
};

/** 处理Spine模式的文件上传成功 */
function handleSpineUploadSuccess(field: keyof Omit<CommonType.I18nSpineConfig, 'spine'>, response: any) {
  // 这里需要根据实际的后端接口返回格式处理
  if (response?.url) {
    updateSpineField(field, response.url);
  }
}

/** 自定义上传处理 */
async function customUpload(options: any) {
  const file = options.file;

  try {
    // 调用上传接口
    const { data, error } = await fetchUploadFile(file);

    if (error) {
      const errorMessage = (error as unknown as SimplifiedError)?.msg || '上传失败';
      ElMessage.error(errorMessage);
      options.onError(error);
      return Promise.reject(error);
    }

    if (data?.url) {
      options.onSuccess({ url: data.url });
      ElMessage.success('上传成功');
      return Promise.resolve({ url: data.url });
    }

    ElMessage.error('上传失败：未返回文件URL');
    options.onError(new Error('未返回文件URL'));
    return Promise.reject(new Error('未返回文件URL'));
  } catch (err: any) {
    ElMessage.error(err?.message || '上传失败');
    options.onError(err);
    return Promise.reject(err);
  }
}

/** 处理简单模式的文件上传成功 */
function handleSimpleUploadSuccess(response: any) {
  // 这里需要根据实际的后端接口返回格式处理
  if (response?.url) {
    simpleImg.value = response.url;
  }
}

/** 图片预览相关 */
const previewVisible = ref(false);
const previewImage = ref('');

/** 打开图片预览 */
function handlePreview(url: string) {
  previewImage.value = url;
  previewVisible.value = true;
}

/** 尺寸提示文本 */
const sizeHint = computed(() => {
  const hasWidth = props.width !== undefined;
  const hasHeight = props.height !== undefined;

  // 如果两个都没传，返回空字符串
  if (!hasWidth && !hasHeight) {
    return '';
  }

  const widthText = hasWidth ? props.width : '不限';
  const heightText = hasHeight ? props.height : '不限';

  return `尺寸大小 ${widthText} × ${heightText}`;
});
</script>

<template>
  <div class="w-full b-1 rounded-2px p-5px">
    <!-- Spine开关 -->
    <div class="mb-16px flex items-center rounded-4px bg-#f5f7fa px-16px py-12px">
      <ElSwitch v-model="spineEnabled" :disabled="disabled" />
      <span class="ml-8px">Spine</span>
      <span v-if="sizeHint" class="ml-8px text-12px text-gray-400">{{ sizeHint }}</span>
    </div>

    <!-- 标签页 -->
    <ElTabs v-model="activeTab" type="card" class="i18n-image__tabs">
      <ElTabPane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <!-- 简单模式：只有IMG输入 -->
        <template v-if="!isSpineMode">
          <div>
            <div class="mb-16px flex items-center last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266">IMG</label>
              <div class="flex flex-1 items-center gap-12px">
                <ElInput
                  v-model="simpleImg"
                  class="flex-1"
                  placeholder="请输入图片地址或上传图片"
                  :disabled="disabled"
                />
                <!-- 缩略图上传区域 -->
                <div class="shrink-0">
                  <ElUpload
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="customUpload"
                    :on-success="handleSimpleUploadSuccess"
                    :disabled="disabled"
                    :accept="accept"
                    class="image-uploader"
                  >
                    <div
                      v-if="!simpleImg"
                      class="flex flex-col items-center justify-center b-1 border-#d9d9d9 rounded-6px border-dashed bg-#fafafa transition-all"
                      :class="{
                        'cursor-pointer hover:b-[var(--el-color-primary)]': !disabled,
                        'cursor-not-allowed opacity-60': disabled
                      }"
                      :style="{
                        width: width ? `${width}px` : '100px',
                        height: height ? `${height}px` : '100px'
                      }"
                    >
                      <ElIcon :size="20" class="text-#8c939d">
                        <Plus />
                      </ElIcon>
                      <div class="mt-4px text-12px text-#8c939d">上传图片</div>
                    </div>
                    <div
                      v-else
                      class="group relative overflow-hidden b-1 border-#d9d9d9 rounded-6px border-solid"
                      :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
                      :style="{
                        width: width ? `${width}px` : '100px',
                        height: height ? `${height}px` : '100px'
                      }"
                    >
                      <img :src="simpleImg" class="block h-full w-full object-cover" />
                      <div
                        v-if="!disabled"
                        class="absolute inset-0 flex items-center justify-center gap-12px bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <ElIcon
                          :size="20"
                          class="cursor-pointer text-white transition-transform hover:scale-120"
                          @click.stop="handlePreview(simpleImg)"
                        >
                          <ZoomIn />
                        </ElIcon>
                        <ElIcon
                          :size="20"
                          class="cursor-pointer text-white transition-transform hover:scale-120"
                          @click.stop="simpleImg = ''"
                        >
                          <Delete />
                        </ElIcon>
                      </div>
                    </div>
                  </ElUpload>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Spine模式：完整配置 -->
        <template v-else>
          <div>
            <!-- PNG上传 -->
            <div class="mb-16px flex items-start last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266 leading-32px">PNG</label>
              <div class="flex flex-1 gap-8px">
                <ElInput
                  class="flex-1"
                  :model-value="spineConfig.png"
                  placeholder=""
                  :disabled="disabled"
                  @input="val => updateSpineField('png', val)"
                />
                <ElUpload
                  class="shrink-0"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="customUpload"
                  :on-success="response => handleSpineUploadSuccess('png', response)"
                  :disabled="disabled"
                  accept=".png"
                >
                  <ElButton :icon="UploadIcon" type="primary" :disabled="disabled" />
                </ElUpload>
              </div>
            </div>

            <!-- JSON上传 -->
            <div class="mb-16px flex items-start last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266 leading-32px">JSON</label>
              <div class="flex flex-1 gap-8px">
                <ElInput
                  class="flex-1"
                  :model-value="spineConfig.json"
                  placeholder=""
                  :disabled="disabled"
                  @input="val => updateSpineField('json', val)"
                />
                <ElUpload
                  class="shrink-0"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="customUpload"
                  :on-success="response => handleSpineUploadSuccess('json', response)"
                  :disabled="disabled"
                  accept=".json"
                >
                  <ElButton :icon="UploadIcon" type="primary" :disabled="disabled" />
                </ElUpload>
              </div>
            </div>

            <!-- ATLAS上传 -->
            <div class="mb-16px flex items-start last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266 leading-32px">ATLAS</label>
              <div class="flex flex-1 gap-8px">
                <ElInput
                  class="flex-1"
                  :model-value="spineConfig.atlas"
                  placeholder=""
                  :disabled="disabled"
                  @input="val => updateSpineField('atlas', val)"
                />
                <ElUpload
                  class="shrink-0"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="customUpload"
                  :on-success="response => handleSpineUploadSuccess('atlas', response)"
                  :disabled="disabled"
                  accept=".atlas"
                >
                  <ElButton :icon="UploadIcon" type="primary" :disabled="disabled" />
                </ElUpload>
              </div>
            </div>

            <div
              class="mb-16px b-1 border-#fde2e2 rounded-4px bg-#fef0f0 px-12px py-8px text-center text-13px text-#f56c6c leading-1.5"
            >
              温馨提示: H5直图URL(静態圖)、svg(動圖)請選一填寫
            </div>

            <!-- URL输入 -->
            <div class="mb-16px flex items-start last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266 leading-32px">URL</label>
              <div class="flex flex-1 gap-8px">
                <ElInput
                  class="flex-1"
                  :model-value="spineConfig.img"
                  placeholder=""
                  :disabled="disabled"
                  @input="val => updateSpineField('img', val)"
                />
                <ElUpload
                  class="shrink-0"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="customUpload"
                  :on-success="response => handleSpineUploadSuccess('img', response)"
                  :disabled="disabled"
                  :accept="accept"
                >
                  <ElButton :icon="UploadIcon" type="primary" :disabled="disabled" />
                </ElUpload>
              </div>
            </div>

            <!-- SVG上传 -->
            <div class="mb-16px flex items-start last:mb-0">
              <label class="w-60px shrink-0 pr-12px text-right text-14px text-#606266 leading-32px">SVG</label>
              <div class="flex flex-1 gap-8px">
                <ElInput
                  class="flex-1"
                  :model-value="spineConfig.svg"
                  placeholder=""
                  :disabled="disabled"
                  @input="val => updateSpineField('svg', val)"
                />
                <ElUpload
                  class="shrink-0"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="customUpload"
                  :on-success="response => handleSpineUploadSuccess('svg', response)"
                  :disabled="disabled"
                  accept=".svg"
                >
                  <ElButton :icon="UploadIcon" type="primary" :disabled="disabled" />
                </ElUpload>
              </div>
            </div>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>

    <!-- 图片预览对话框 -->
    <ElDialog v-model="previewVisible" title="图片预览" width="800px" append-to-body>
      <div class="flex items-center justify-center">
        <img :src="previewImage" class="max-h-600px max-w-full" />
      </div>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
// Element Plus 组件深度样式覆盖
.i18n-image__tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    color: #606266;

    &.is-active {
      color: var(--el-color-primary);
    }

    // 为第一个标签添加错误标记样式
    &:first-child {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 8px;
        right: 4px;
        width: 6px;
        height: 6px;
        background-color: #f56c6c;
        border-radius: 50%;
        display: none; // 默认隐藏，需要时可以通过添加class显示
      }
    }
  }
}

// 缩略图上传样式 - Element Plus Upload 组件深度样式
.image-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}
</style>
