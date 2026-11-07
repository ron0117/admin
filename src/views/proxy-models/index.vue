<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import {
  fetchAdminProxyModels,
  refreshAdminProxyModels,
  saveAdminProxyModels
} from '@/service/api/proxy-models';
import {
  allowManualProxyModel,
  proxyModelIdError,
  proxyModelStale
} from '@/utils/proxy-models';
import type { AdminProxyModels, ProxyModelKindView } from '@/utils/proxy-models';

defineOptions({ name: 'ProxyModels' });

const kinds = [
  {
    key: 'text',
    title: '生文模型',
    hint: '对话、识图和文案使用这个模型。接口地址和密钥仍由服务器的 OPENAI_BASE_URL、OPENAI_API_KEY 决定。'
  },
  {
    key: 'image',
    title: '生图模型',
    hint: '图片生成使用这个模型。接口地址和密钥仍由 OPENAI_IMAGE_BASE_URL、OPENAI_IMAGE_API_KEY 决定。换模型后，调用方式仍按现有规则分流。'
  }
] as const;

type KindKey = (typeof kinds)[number]['key'];

const state = ref<AdminProxyModels | null>(null);
const drafts = reactive({ text: '', image: '' });
const loading = ref(false);
const saving = ref(false);
const refreshing = ref(false);
const loadFailed = ref(false);
const errors = ref<string[]>([]);
const busy = computed(() => loading.value || saving.value || refreshing.value);
const dirty = computed(
  () =>
    Boolean(state.value) &&
    (drafts.text !== state.value?.text.selected || drafts.image !== state.value?.image.selected)
);

function accept(value: AdminProxyModels) {
  state.value = value;
  drafts.text = value.text.selected;
  drafts.image = value.image.selected;
  errors.value = [];
}

function viewOf(key: KindKey): ProxyModelKindView | null {
  return state.value?.[key] ?? null;
}

function catalogOf(key: KindKey): string[] {
  return viewOf(key)?.catalog ?? [];
}

async function loadModels() {
  loading.value = true;
  loadFailed.value = false;
  try {
    const { data, error } = await fetchAdminProxyModels();
    if (error || !data) {
      loadFailed.value = true;
      return;
    }
    accept(data);
  } finally {
    loading.value = false;
  }
}

async function refreshCatalog() {
  if (dirty.value) {
    try {
      await ElMessageBox.confirm('同步会丢弃尚未保存的模型修改。', '同步上游列表？', {
        confirmButtonText: '同步',
        cancelButtonText: '取消',
        type: 'warning'
      });
    } catch {
      return;
    }
  }
  refreshing.value = true;
  try {
    const { data, error } = await refreshAdminProxyModels();
    if (error || !data) {
      errors.value = ['上游列表没有同步成功，页面仍显示上次的目录。'];
      return;
    }
    accept(data);
    const failed = kinds.filter(kind => data[kind.key].fetchError).map(kind => kind.title);
    if (failed.length) {
      window.$message?.warning(`${failed.join('、')}同步失败，已保留上次成功的列表。`);
      return;
    }
    window.$message?.success('上游模型列表已更新。');
  } finally {
    refreshing.value = false;
  }
}

async function saveModels() {
  errors.value = kinds.flatMap(kind => {
    const message = proxyModelIdError(drafts[kind.key], kind.title);
    return message ? [message] : [];
  });
  if (errors.value.length) return;
  saving.value = true;
  try {
    const { data, error } = await saveAdminProxyModels({
      textModel: drafts.text.trim(),
      imageModel: drafts.image.trim()
    });
    if (error || !data) {
      errors.value = ['模型没有保存。请按错误提示修正后再试。'];
      return;
    }
    accept(data);
    window.$message?.success('已保存。下一笔生文或生图会使用新模型。');
  } finally {
    saving.value = false;
  }
}

function chooseCatalog(key: KindKey, value: unknown) {
  if (typeof value !== 'string' || !value) return;
  drafts[key] = value;
}

function fetchedLabel(view: ProxyModelKindView): string {
  if (!view.fetchedAt) return '还没有成功同步过';
  return `上次成功同步 ${new Date(view.fetchedAt).toLocaleString()}`;
}

onMounted(loadModels);
</script>

<template>
  <div v-loading="loading" class="proxy-models-page">
    <div class="page-header">
      <div>
        <h2>当前模型</h2>
        <p>这里切换的是服务器代发的生文和生图模型。保存后下一笔请求生效，已经开始的请求不会中途更换。</p>
      </div>
      <div class="action-row">
        <ElButton :disabled="busy" @click="loadModels">重新载入</ElButton>
        <ElButton :loading="refreshing" :disabled="busy" @click="refreshCatalog">同步上游列表</ElButton>
      </div>
    </div>
    <ElAlert
      v-if="loadFailed"
      title="配置加载失败，请检查登录权限和服务器连接，再重新载入。"
      type="error"
      :closable="false"
    />
    <template v-if="state">
      <ElAlert v-if="errors.length" title="请检查以下问题" type="error" :closable="false" show-icon>
        <ul class="error-list">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </ElAlert>
      <ElCard v-for="kind in kinds" :key="kind.key" shadow="never">
        <template #header>
          <div class="card-heading">
            <strong>{{ kind.title }}</strong>
            <ElTag :type="viewOf(kind.key)?.source === 'database' ? 'success' : 'info'">
              {{ viewOf(kind.key)?.source === 'database' ? '后台指定' : '环境变量默认' }}
            </ElTag>
          </div>
        </template>
        <p class="hint">{{ kind.hint }}</p>
        <p class="hint">
          {{ fetchedLabel(viewOf(kind.key)!) }}
          <template v-if="catalogOf(kind.key).length"> · 可选 {{ catalogOf(kind.key).length }} 个</template>
          <template v-else> · 列表为空，请手填</template>
        </p>
        <ElAlert
          v-if="viewOf(kind.key)?.fetchError"
          :title="viewOf(kind.key)?.fetchError || ''"
          type="warning"
          :closable="false"
          class="fetch-error"
        />
        <div class="model-fields">
          <ElSelect
            v-if="catalogOf(kind.key).length"
            :model-value="catalogOf(kind.key).includes(drafts[kind.key]) ? drafts[kind.key] : ''"
            :disabled="busy"
            filterable
            class="model-select"
            placeholder="从已同步模型中选择"
            :aria-label="kind.title"
            @update:model-value="value => chooseCatalog(kind.key, value)"
          >
            <ElOption v-for="id in catalogOf(kind.key)" :key="id" :label="id" :value="id" />
          </ElSelect>
          <ElInput
            v-if="allowManualProxyModel(catalogOf(kind.key), drafts[kind.key])"
            v-model="drafts[kind.key]"
            :disabled="busy"
            maxlength="200"
            class="model-input"
            placeholder="列表中没有时手填模型名称"
            :aria-label="`${kind.title}手填`"
          />
          <ElTag v-if="proxyModelStale(catalogOf(kind.key), drafts[kind.key])" type="warning">不在最新列表中</ElTag>
        </div>
      </ElCard>
      <div class="save-row">
        <ElButton type="primary" :loading="saving" :disabled="busy || !dirty" @click="saveModels">保存并生效</ElButton>
        <span class="hint">每天 12:00（上海）自动同步一次。列表里没有的模型可以保留，并标成「不在最新列表中」。</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.proxy-models-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  min-height: 100%;
}
.page-header,
.card-heading,
.action-row,
.model-fields,
.save-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.page-header,
.card-heading {
  justify-content: space-between;
}
.page-header h2 {
  margin: 0 0 8px;
  font-size: 21px;
  font-weight: 600;
}
.page-header p,
.hint {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}
.model-fields {
  margin-top: 14px;
}
.model-select,
.model-input {
  width: min(100%, 420px);
}
.fetch-error {
  margin-top: 12px;
}
.error-list {
  margin: 8px 0;
  padding-left: 18px;
  line-height: 1.8;
}
@media (max-width: 700px) {
  .proxy-models-page {
    padding: 12px;
  }
}
</style>
