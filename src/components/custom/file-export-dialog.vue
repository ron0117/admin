<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { FileFormat, downloadExcelFile, exportFile } from '@/utils/file-io';
import { $t } from '@/locales';
import { ExportMode } from '@/enum';

interface Props {
  visible: boolean;
  title?: string;
  data?: any[];
  defaultFilename?: string;
  /** 支持的文件格式，为空则支持所有格式 */
  supportedFormats?: FileFormat[];
  /** 导出模式：前端或服务器，默认前端 */
  exportMode?: ExportMode;
  /** 服务器导出接口函数，返回文件下载链接或Blob */
  serverExportApi?: (params: any) => Promise<any>;
  /** 服务器导出的额外参数 */
  serverExportParams?: Record<string, any>;
  /** 前端自定义导出函数（用于高级导出，如合并单元格） */
  clientExportApi?: (params: { filename: string; format: FileFormat; data: any[] }) => Promise<void> | void;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: () => $t('common.fileIO.exportFile'),
  defaultFilename: () => $t('common.fileIO.exportData'),
  supportedFormats: () => [],
  data: () => [],
  exportMode: ExportMode.CLIENT,
  serverExportApi: undefined,
  serverExportParams: () => ({}),
  clientExportApi: undefined
});

const emit = defineEmits<Emits>();

const loading = ref(false);
const filename = ref(props.defaultFilename);

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
// 导出文件
async function handleExport() {
  if (!filename.value.trim()) {
    ElMessage.warning($t('common.fileIO.pleaseInputFileName'));
    return;
  }

  // 前端导出模式需要检查数据
  if (props.exportMode === ExportMode.CLIENT && (!props.data || props.data.length === 0)) {
    ElMessage.warning($t('common.fileIO.noDataToExport'));
    return;
  }

  loading.value = true;

  try {
    if (props.exportMode === ExportMode.SERVER) {
      // 服务器导出模式
      await handleServerExport();
    } else {
      // 前端导出模式
      await handleClientExport();
    }

    ElMessage.success($t('common.fileIO.exportSuccess'));
    handleClose();
  } catch (error) {
    ElMessage.error(`${$t('common.fileIO.exportFailed')}: ${(error as Error).message}`);
  } finally {
    loading.value = false;
  }
}

// 前端导出
const handleClientExport = async () => {
  if (props.clientExportApi) {
    await props.clientExportApi({
      filename: filename.value,
      format: fileFormat.value,
      data: props.data
    });
    return;
  }

  exportFile({
    filename: filename.value,
    format: fileFormat.value,
    data: props.data,
    useJsonFormat: true
  });
};

// 服务器导出
async function handleServerExport() {
  if (!props.serverExportApi) {
    throw new Error('未配置服务器导出接口');
  }

  const params = { ...props.serverExportParams };
  const { data, error } = await props.serverExportApi(params);
  if (error) {
    throw new Error(error.msg || '服务器导出失败');
  }

  // 无有效数据视为失败，避免误报导出成功
  if (data === undefined || data === null) {
    throw new Error('未获取到导出文件');
  }

  if (typeof data === 'string') {
    if (!data.trim()) throw new Error('未获取到导出文件');
    window.open(data, '_blank');
    return;
  }
  if (data instanceof Blob) {
    if (data.size === 0) throw new Error('导出文件为空');
    const fullFilename = `${filename.value}.${fileFormat.value}`;
    downloadExcelFile(data, fullFilename);
    return;
  }
  if (typeof data === 'object' && data !== null && data.url) {
    const url = typeof data.url === 'string' ? data.url : String(data.url);
    if (!url.trim()) throw new Error('未获取到导出文件');
    window.open(url, '_blank');
    return;
  }

  throw new Error('未获取到有效的导出文件');
}

// 关闭对话框
function handleClose() {
  emit('update:visible', false);
  // 重置表单
  filename.value = props.defaultFilename;
  const defaultFormat = getDefaultFormat();
  fileFormat.value = defaultFormat;
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="title"
    width="600px"
    align-center
    :close-on-click-modal="false"
    class="file-export-dialog"
    @close="handleClose"
  >
    <ElForm :model="{}" label-width="120px">
      <ElFormItem :label="$t('common.fileIO.fileName')">
        <ElInput v-model="filename" :placeholder="$t('common.fileIO.pleaseInputFileName')" />
      </ElFormItem>

      <ElFormItem :label="$t('common.fileIO.fileFormat')">
        <ElSelect v-model="fileFormat" :placeholder="$t('common.fileIO.pleaseSelectFileFormat')">
          <ElOption v-for="option in formatOptions" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </ElFormItem>

      <ElAlert
        v-if="exportMode === 'client'"
        :title="$t('common.fileIO.willExportCount', { count: data.length })"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <ElAlert v-else title="服务器端导出：将调用服务器接口生成并下载文件" type="info" :closable="false" class="mb-4" />
    </ElForm>

    <template #footer>
      <ElButton @click="handleClose">{{ $t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleExport">{{ $t('common.startExport') }}</ElButton>
    </template>
  </ElDialog>
</template>

<style lang="scss">
/* 非 scoped：Dialog 被 append-to-body 挂到 body，屏幕能完整显示时在视口居中 */
.file-export-dialog.el-overlay-dialog,
.file-export-dialog.el-modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped lang="scss">
.mb-4 {
  margin-bottom: 1rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-500 {
  color: #6b7280;
}
</style>
