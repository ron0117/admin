<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { FileFormat, importFile, selectFile } from '@/utils/file-io';
import { $t } from '@/locales';

interface Props {
  visible: boolean;
  title?: string;
  /** 支持的文件格式，为空则支持所有格式 */
  supportedFormats?: FileFormat[];
  /** 成功回调 */
  successCallback?: (data: any[], file: File) => Promise<boolean>;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success', data: any[], file: File): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: $t('common.import'),
  supportedFormats: () => []
});

const emit = defineEmits<Emits>();

const loading = ref(false);
const selectedFile = ref<File | null>(null);

// 所有可用的格式选项
const allFormatOptions = computed(() => [
  { label: $t('common.fileIO.formatOptions.xlsx'), value: FileFormat.XLX },
  { label: $t('common.fileIO.formatOptions.xls'), value: FileFormat.XLS },
  { label: $t('common.fileIO.formatOptions.csv'), value: FileFormat.CSV },
  { label: $t('common.fileIO.formatOptions.txt'), value: FileFormat.TXT },
  { label: $t('common.fileIO.formatOptions.json'), value: FileFormat.JSON }
]);

// 根据支持的格式过滤选项
const formatOptions = computed(() => {
  if (!props.supportedFormats || props.supportedFormats.length === 0) {
    return allFormatOptions.value;
  }
  return allFormatOptions.value.filter((option: { label: string; value: FileFormat }) =>
    props.supportedFormats.includes(option.value)
  );
});

// 获取默认文件格式（从支持的格式中选择第一个）
const getDefaultFormat = () => {
  if (formatOptions.value.length > 0) {
    return formatOptions.value[0].value;
  }
  return FileFormat.XLX;
};

const fileFormat = ref<FileFormat>(getDefaultFormat());
const hasHeader = ref(true);
const encoding = ref('UTF-8');

const encodingOptions = [
  { label: 'UTF-8', value: 'UTF-8' },
  { label: 'GBK', value: 'GBK' },
  { label: 'GB2312', value: 'GB2312' }
];

// 是否显示编码选项
const showEncoding = computed(() => {
  return (
    fileFormat.value === FileFormat.CSV || fileFormat.value === FileFormat.TXT || fileFormat.value === FileFormat.JSON
  );
});

// 是否显示表头选项
const showHeader = computed(() => {
  return fileFormat.value !== FileFormat.JSON && fileFormat.value !== FileFormat.TXT;
});

// 获取文件类型的 accept 属性
const acceptFileTypes = computed(() => {
  switch (fileFormat.value) {
    case FileFormat.XLX:
      return '.xlsx';
    case FileFormat.XLS:
      return '.xls';
    case FileFormat.CSV:
      return '.csv';
    case FileFormat.TXT:
      return '.txt';
    case FileFormat.JSON:
      return '.json';
    default:
      // 如果指定了支持的格式，则只返回这些格式
      if (props.supportedFormats && props.supportedFormats.length > 0) {
        const extensions = props.supportedFormats
          .map((format: FileFormat) => {
            switch (format) {
              case FileFormat.XLX:
                return '.xlsx';
              case FileFormat.XLS:
                return '.xls';
              case FileFormat.CSV:
                return '.csv';
              case FileFormat.TXT:
                return '.txt';
              case FileFormat.JSON:
                return '.json';
              default:
                return '';
            }
          })
          .filter(Boolean);
        return extensions.join(',');
      }
      return '.xlsx,.xls,.csv,.txt,.json';
  }
});

// 选择文件
async function handleSelectFile() {
  try {
    const files = await selectFile(acceptFileTypes.value);
    if (files && files.length > 0) {
      selectedFile.value = files[0];
      ElMessage.success(`${$t('common.fileIO.fileSelected')}: ${selectedFile.value.name}`);
    }
  } catch {
    // 用户取消选择
  }
}

// 导入文件
async function handleImport() {
  if (!selectedFile.value) {
    ElMessage.warning($t('common.fileIO.pleaseSelectFileFirst'));
    return;
  }

  loading.value = true;

  try {
    const data = await importFile(selectedFile.value, {
      format: fileFormat.value,
      hasHeader: hasHeader.value,
      encoding: encoding.value
    });

    if (data.length === 0) {
      ElMessage.warning($t('common.fileIO.noDataInFile'));
      return;
    }

    // 由于emit无法拦截，所以新增props的异步方法
    if (props.successCallback) {
      const success = await props.successCallback(data, selectedFile.value);
      if (!success) {
        return;
      }
    }

    emit('success', data, selectedFile.value);
    ElMessage.success($t('common.fileIO.importSuccess', { count: data.length }));
    handleClose();
  } catch (error) {
    ElMessage.error(`${$t('common.fileIO.importFailed')}: ${(error as Error).message}`);
  } finally {
    loading.value = false;
  }
}

// 关闭对话框
function handleClose() {
  emit('update:visible', false);
  // 重置表单
  selectedFile.value = null;
  fileFormat.value = getDefaultFormat();
  hasHeader.value = true;
  encoding.value = 'UTF-8';
}
</script>

<template>
  <ElDialog :model-value="visible" :title="title" width="600px" :close-on-click-modal="false" @close="handleClose">
    <ElForm :model="{}" label-width="120px">
      <ElFormItem :label="$t('common.fileIO.fileFormat')">
        <ElSelect v-model="fileFormat" :placeholder="$t('common.fileIO.pleaseSelectFileFormat')">
          <ElOption v-for="option in formatOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('common.fileIO.selectFile')">
        <div class="w-full flex items-center gap-2">
          <ElInput
            :model-value="selectedFile?.name || ''"
            :placeholder="$t('common.fileIO.pleaseSelectFile')"
            readonly
            class="flex-1"
          />
          <ElButton type="primary" @click="handleSelectFile">{{ $t('common.fileIO.selectFile') }}</ElButton>
        </div>
      </ElFormItem>

      <ElFormItem v-if="showHeader" :label="$t('common.fileIO.hasHeader')">
        <ElSwitch v-model="hasHeader" />
        <span class="ml-2 text-sm text-gray-500">{{ $t('common.fileIO.firstRowIsHeader') }}</span>
      </ElFormItem>

      <ElFormItem v-if="showEncoding" :label="$t('common.fileIO.encoding')">
        <ElSelect v-model="encoding" :placeholder="$t('common.fileIO.pleaseSelectEncoding')">
          <ElOption v-for="option in encodingOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>

      <ElAlert v-if="fileFormat === FileFormat.JSON" type="info" :closable="false" class="mb-4">
        <template #title>
          <span class="text-sm">{{ $t('common.fileIO.jsonFormatTip') }}</span>
        </template>
      </ElAlert>

      <ElAlert
        v-if="selectedFile"
        :title="$t('common.fileIO.fileInfo', { name: selectedFile.name, size: (selectedFile.size / 1024).toFixed(2) })"
        type="info"
        :closable="false"
        class="mb-4"
      />
    </ElForm>

    <template #footer>
      <ElButton @click="handleClose">{{ $t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="loading" :disabled="!selectedFile" @click="handleImport">
        {{ $t('common.startImport') }}
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

.flex-1 {
  flex: 1;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-500 {
  color: #6b7280;
}
</style>
