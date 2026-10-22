<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { fetchAdminAiConfig, publishAdminAiConfig, saveAdminAiConfig } from '@/service/api/ai-config';
import {
  AI_PROTOCOLS,
  AI_STAGES,
  canBindAiService,
  canPublishAiConfig,
  createAiConfigPayload,
  emptyAiBindings,
  validateAiConfig,
  validateAiService
} from '@/utils/ai-config';
import type { AdminAiConfig, AiConfigDraft, AiServiceDraft, AiStage } from '@/utils/ai-config';

defineOptions({ name: 'AiConfig' });

const config = ref<AdminAiConfig | null>(null);
const draft = ref<AiConfigDraft>({ enabled: false, services: [], bindings: emptyAiBindings() });
const loading = ref(false);
const saving = ref(false);
const publishing = ref(false);
const loadFailed = ref(false);
const errors = ref<string[]>([]);
const baseline = ref('');
const dirty = computed(
  () => Boolean(config.value) && JSON.stringify(createAiConfigPayload(draft.value, 0)) !== baseline.value
);
const busy = computed(() => loading.value || saving.value || publishing.value);
const canPublish = computed(() => canPublishAiConfig(config.value, dirty.value));
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const editing = ref<AiServiceDraft | null>(null);
const serviceErrors = ref<string[]>([]);
const timeoutSeconds = computed({
  get: () => (editing.value?.timeoutMs || 600000) / 1000,
  set: (value: number) => {
    if (editing.value) editing.value.timeoutMs = Number(value) * 1000;
  }
});
const boundCount = computed(() => AI_STAGES.filter(stage => draft.value.bindings[stage.value]).length);

function acceptConfig(value: AdminAiConfig) {
  clearDraftKeys();
  config.value = value;
  draft.value = {
    enabled: value.enabled,
    services: value.services.map(service => ({ ...service })),
    bindings: { ...emptyAiBindings(), ...value.bindings }
  };
  baseline.value = JSON.stringify(createAiConfigPayload(draft.value, 0));
  errors.value = [];
}

function clearDraftKeys() {
  for (const service of draft.value.services) delete service.apiKey;
}

async function confirmDiscard(): Promise<boolean> {
  if (!dirty.value && !dialogVisible.value) return true;
  try {
    await ElMessageBox.confirm('尚有未保存的修改，离开后会丢弃这些修改和未保存的密钥。', '放弃修改？', {
      confirmButtonText: '放弃修改',
      cancelButtonText: '继续编辑',
      type: 'warning'
    });
    return true;
  } catch {
    return false;
  }
}

async function loadConfig() {
  if (!(await confirmDiscard())) return;
  loading.value = true;
  loadFailed.value = false;
  try {
    const { data, error } = await fetchAdminAiConfig();
    if (error || !data) {
      loadFailed.value = true;
      return;
    }
    acceptConfig(data);
  } finally {
    loading.value = false;
  }
}

function editService(service?: AiServiceDraft) {
  editingId.value = service?.id || null;
  editing.value = service
    ? { ...service, apiKey: '' }
    : {
        id: crypto.randomUUID(),
        name: '',
        protocol: 'chat-completions',
        baseUrl: '',
        model: '',
        enabled: true,
        timeoutMs: 600000,
        supportsVision: true,
        hasApiKey: false,
        apiKeyMasked: null,
        apiKey: ''
      };
  serviceErrors.value = [];
  dialogVisible.value = true;
}

function closeService() {
  if (editing.value) delete editing.value.apiKey;
  editing.value = null;
  serviceErrors.value = [];
}

function applyService() {
  if (!editing.value) return;
  serviceErrors.value = validateAiService(editing.value);
  if (serviceErrors.value.length) return;
  const existingIndex = draft.value.services.findIndex(service => service.id === editingId.value);
  const service = { ...editing.value };
  // Leaving the replacement field empty preserves a previously entered, still-unsaved key too.
  if (!service.apiKey?.trim()) service.apiKey = draft.value.services[existingIndex]?.apiKey;
  if (existingIndex < 0) draft.value.services.push(service);
  else draft.value.services[existingIndex] = service;
  dialogVisible.value = false;
}

async function removeService(service: AiServiceDraft) {
  try {
    await ElMessageBox.confirm(
      `从草稿中删除“${service.name}”？已分配给此服务的功能也将取消分配；发布后才会影响 APP。`,
      '删除服务',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    );
  } catch {
    return;
  }
  delete service.apiKey;
  draft.value.services = draft.value.services.filter(item => item.id !== service.id);
  for (const stage of AI_STAGES) {
    if (draft.value.bindings[stage.value] === service.id) draft.value.bindings[stage.value] = null;
  }
}

function optionsFor(stage: AiStage) {
  return draft.value.services.filter(service => canBindAiService(stage, service));
}

function serviceRow(value: unknown) {
  return value as AiServiceDraft;
}

function bindingWarning(stage: AiStage) {
  const id = draft.value.bindings[stage];
  const service = draft.value.services.find(item => item.id === id);
  if (id && (!service || !canBindAiService(stage, service))) return '当前分配已不兼容，请重新选择。';
  return '';
}

function checkConfig() {
  errors.value = validateAiConfig(draft.value, true);
  if (!errors.value.length) window.$message?.success('配置格式和功能匹配检查通过；未调用模型 API。');
}

async function saveDraft() {
  if (!config.value) return;
  errors.value = validateAiConfig(draft.value);
  if (errors.value.length) return;
  saving.value = true;
  try {
    const { data, error } = await saveAdminAiConfig(createAiConfigPayload(draft.value, config.value.draftRevision));
    if (error || !data) {
      errors.value = ['草稿未保存。如提示版本冲突，请重新载入最新配置后再编辑。'];
      return;
    }
    acceptConfig(data);
    window.$message?.success('草稿已保存，密钥输入已清空。发布后 APP 才会同步。');
  } finally {
    saving.value = false;
  }
}

async function publishDraft() {
  if (!config.value || dirty.value) return;
  errors.value = validateAiConfig(draft.value, true);
  if (errors.value.length) return;
  try {
    await ElMessageBox.confirm(
      draft.value.enabled
        ? '发布此草稿？APP 同步后，新任务使用新配置。已开始的任务继续使用原配置。'
        : '发布关闭状态？APP 同步后，使用后台配置的模式将无法开始新的生成。需要在 APP 手动切回“原有配置”才能恢复旧调用方式。',
      '发布配置',
      { confirmButtonText: '发布', cancelButtonText: '取消', type: 'warning' }
    );
  } catch {
    return;
  }
  publishing.value = true;
  try {
    const { data, error } = await publishAdminAiConfig(config.value.draftRevision);
    if (error || !data) {
      errors.value = ['发布未成功，已发布版本保持不变。请按错误提示修正；版本冲突时重新载入配置。'];
      return;
    }
    acceptConfig(data);
    window.$message?.success(`配置 v${data.publishedRevision} 已发布。`);
  } finally {
    publishing.value = false;
  }
}

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!dirty.value && !dialogVisible.value) return;
  event.preventDefault();
  event.returnValue = '';
}

onBeforeRouteLeave(confirmDiscard);
onMounted(() => {
  loadConfig();
  window.addEventListener('beforeunload', handleBeforeUnload);
});
onBeforeUnmount(() => {
  clearDraftKeys();
  closeService();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div v-loading="loading" class="ai-config-page">
    <div class="config-header">
      <div>
        <h2>模型服务</h2>
        <p>集中管理配置，由 APP 直接请求模型服务，图片和生成结果不经过本服务器。</p>
      </div>
      <ElButton :disabled="busy" @click="loadConfig">重新载入</ElButton>
    </div>
    <ElAlert
      v-if="loadFailed"
      title="配置加载失败，请检查登录权限和服务器连接，再重新载入。"
      type="error"
      :closable="false"
    />
    <template v-if="config">
      <ElAlert
        v-if="!config.encryptionReady"
        title="服务器尚未配置密钥加密。请先完成服务端加密设置，再保存或发布配置。"
        type="warning"
        :closable="false"
      />
      <ElCard shadow="never">
        <div class="config-toolbar">
          <div class="version-info">
            <ElTag :type="dirty ? 'warning' : 'info'">
              {{ dirty ? '有未保存修改' : `草稿 v${config.draftRevision}` }}
            </ElTag>
            <span>{{ config.publishedRevision ? `已发布 v${config.publishedRevision}` : '尚未发布' }}</span>
            <span v-if="config.publishedAt" class="muted">{{ new Date(config.publishedAt).toLocaleString() }}</span>
          </div>
          <div class="action-row">
            <ElButton :disabled="busy" @click="checkConfig">检查配置</ElButton>
            <ElButton :loading="saving" :disabled="busy || !dirty || !config.encryptionReady" @click="saveDraft">
              保存草稿
            </ElButton>
            <ElButton
              type="primary"
              :loading="publishing"
              :disabled="busy || !canPublish || !config.encryptionReady"
              @click="publishDraft"
            >
              发布配置
            </ElButton>
          </div>
        </div>
        <div class="config-switch">
          <ElSwitch v-model="draft.enabled" aria-label="启用后台配置下发" :disabled="busy" />
          <span>启用后台配置下发</span>
        </div>
        <p class="muted">
          保存草稿不影响 APP。发布后在 APP 下次同步时生效；使用后台配置时，未分配的功能不能开始生成。回滚需在 APP
          手动切回“原有配置”。
        </p>
      </ElCard>
      <ElAlert v-if="errors.length" title="请检查以下问题" type="error" :closable="false" show-icon>
        <ul class="error-list">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </ElAlert>
      <ElCard shadow="never">
        <template #header>
          <div class="card-heading">
            <div>
              <strong>服务列表</strong>
              <span class="muted">一个服务可以分配给多个功能</span>
            </div>
            <ElButton type="primary" plain :disabled="busy" @click="editService()">添加服务</ElButton>
          </div>
        </template>
        <ElTable :data="draft.services" row-key="id" empty-text="尚未添加服务，先添加接口地址、模型和 API Key。">
          <ElTableColumn prop="name" label="服务名称" min-width="150" />
          <ElTableColumn label="调用方式 / 模型" min-width="240">
            <template #default="{ row }">
              <div>{{ AI_PROTOCOLS.find(p => p.value === row.protocol)?.label }}</div>
              <small class="muted">{{ row.model }}</small>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="baseUrl" label="接口地址" min-width="230" show-overflow-tooltip />
          <ElTableColumn label="API Key" min-width="155">
            <template #default="{ row }">
              <ElTag v-if="row.apiKey" type="warning">待保存新密钥</ElTag>
              <span v-else>{{ row.hasApiKey ? row.apiKeyMasked || '已保存（不可回读）' : '未配置' }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="状态" width="90">
            <template #default="{ row }">
              <ElTag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '启用' : '停用' }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" :disabled="busy" @click="editService(serviceRow(row))">编辑</ElButton>
              <ElButton link type="danger" :disabled="busy" @click="removeService(serviceRow(row))">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElCard>
      <ElCard shadow="never">
        <template #header>
          <div class="card-heading">
            <strong>功能分配</strong>
            <span class="muted">已分配 {{ boundCount }} / {{ AI_STAGES.length }} 个处理阶段</span>
          </div>
        </template>
        <p class="section-hint">
          不同阶段可以共用同一服务，也可分别配置。只显示已启用且兼容的服务；带图的文字功能需要开启识图能力。
        </p>
        <div v-for="stage in AI_STAGES" :key="stage.value" class="binding-row">
          <div class="binding-label">
            <strong>{{ stage.module }}</strong>
            <span class="muted">{{ stage.label }}</span>
          </div>
          <div class="binding-control">
            <ElSelect
              :aria-label="`${stage.module} · ${stage.label}`"
              :model-value="draft.bindings[stage.value] || ''"
              :disabled="busy"
              clearable
              placeholder="未配置 / 未启用"
              @update:model-value="value => (draft.bindings[stage.value] = value || null)"
            >
              <ElOption
                v-for="service in optionsFor(stage.value)"
                :key="service.id"
                :value="service.id"
                :label="`${service.name} · ${service.model}`"
              />
            </ElSelect>
            <p v-if="bindingWarning(stage.value)" class="binding-error">{{ bindingWarning(stage.value) }}</p>
          </div>
        </div>
      </ElCard>
      <p class="muted footer-note">
        “检查配置”只验证字段和功能匹配，不会请求模型或产生模型费用。API Key 保存后仅显示掩码；替换 Key
        不会撤销供应商处的旧 Key。
      </p>
    </template>
    <ElDialog
      v-model="dialogVisible"
      :title="editingId ? '编辑服务' : '添加服务'"
      width="660px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="closeService"
    >
      <ElForm v-if="editing" label-position="top" @submit.prevent="applyService">
        <ElAlert v-if="serviceErrors.length" type="error" title="请检查服务信息" :closable="false">
          <ul class="error-list">
            <li v-for="error in serviceErrors" :key="error">{{ error }}</li>
          </ul>
        </ElAlert>
        <ElFormItem label="服务名称">
          <ElInput v-model="editing.name" maxlength="80" placeholder="例如：生图主服务" />
        </ElFormItem>
        <ElFormItem label="调用方式">
          <ElSelect v-model="editing.protocol">
            <ElOption
              v-for="protocol in AI_PROTOCOLS"
              :key="protocol.value"
              :value="protocol.value"
              :label="protocol.label"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="接口基础地址">
          <ElInput
            v-model="editing.baseUrl"
            :placeholder="editing.protocol === 'wan-video' ? 'https://api.example.com' : 'https://api.example.com/v1'"
            autocomplete="off"
          />
          <p class="field-hint">
            <template v-if="editing.protocol === 'wan-video'">
              Wan 视频填写供应商 API 根地址，不追加 /v1 或具体调用路径。
            </template>
            <template v-else>填写供应商基础地址，不含 /chat/completions 等具体调用路径。</template>
            HTTP 地址需服务器显式允许。
          </p>
        </ElFormItem>
        <ElFormItem label="模型名称">
          <ElInput v-model="editing.model" maxlength="200" placeholder="填写供应商提供的准确模型名称" />
        </ElFormItem>
        <ElFormItem :label="editing.hasApiKey ? '替换 API Key（留空保留原密钥）' : 'API Key'">
          <ElInput
            v-model="editing.apiKey"
            type="password"
            autocomplete="new-password"
            :placeholder="editing.hasApiKey ? '已保存，无法回读；如需更换，请输入新 Key' : '输入供应商 API Key'"
          />
          <p class="field-hint">确认后还需保存草稿。保存成功会清空密钥输入；不会存入浏览器本地存储。</p>
        </ElFormItem>
        <div class="service-options">
          <ElFormItem label="超时（秒）">
            <ElInputNumber v-model="timeoutSeconds" :min="1" :max="1200" :precision="0" />
          </ElFormItem>
          <ElFormItem label="支持图片识别"><ElSwitch v-model="editing.supportsVision" /></ElFormItem>
          <ElFormItem label="启用服务"><ElSwitch v-model="editing.enabled" /></ElFormItem>
        </div>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="applyService">确认修改</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped>
.ai-config-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  min-height: 100%;
}
.config-header,
.config-toolbar,
.card-heading,
.version-info,
.action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.config-header,
.config-toolbar,
.card-heading {
  justify-content: space-between;
}
.config-header h2 {
  font-size: 21px;
  margin: 0 0 8px;
  font-weight: 600;
}
.config-header p,
.muted,
.section-hint,
.field-hint {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
.config-header p {
  margin: 0;
}
.config-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 8px;
}
.card-heading > div {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.section-hint {
  margin: 0 0 14px;
  line-height: 1.7;
}
.binding-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}
.binding-label {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.binding-control {
  max-width: 680px;
  flex: 1;
}
.binding-error {
  color: var(--el-color-danger);
  font-size: 12px;
  margin: 6px 0 0;
}
.field-hint {
  line-height: 1.6;
  margin: 7px 0 0;
}
.service-options {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}
.error-list {
  padding-left: 18px;
  list-style-type: disc;
  margin: 8px 0;
  line-height: 1.8;
}
.footer-note {
  line-height: 1.7;
  margin: 0;
}
@media (max-width: 700px) {
  .ai-config-page {
    padding: 12px;
  }
  .binding-row {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }
  .binding-label {
    width: auto;
    flex-direction: row;
    gap: 12px;
  }
}
</style>
