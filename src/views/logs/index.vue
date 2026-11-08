<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQSearch } from '@/components';
import { fetchAdminLogs } from '@/service/api';
import { ADMIN_DATETIMERANGE_VALUE_FORMAT, parseSearchTimeRange } from '@/utils/time';
import { $t } from '@/locales';

defineOptions({ name: 'Logs' });

const RANGE_MS = 7 * 24 * 60 * 60 * 1000;

const channels: Array<{ value: '' | Api.Logs.Channel; labelKey: App.I18n.I18nKey }> = [
  { value: '', labelKey: 'page.logs.channelAll' },
  { value: 'http', labelKey: 'page.logs.channelHttp' },
  { value: 'business', labelKey: 'page.logs.channelBusiness' },
  { value: 'error', labelKey: 'page.logs.channelError' },
  { value: 'database', labelKey: 'page.logs.channelDatabase' },
  { value: 'security', labelKey: 'page.logs.channelSecurity' },
  { value: 'none', labelKey: 'page.logs.channelNone' }
];

const levels: Array<{ value: Api.Logs.Level; labelKey: App.I18n.I18nKey }> = [
  { value: 'trace', labelKey: 'page.logs.levelTrace' },
  { value: 'debug', labelKey: 'page.logs.levelDebug' },
  { value: 'info', labelKey: 'page.logs.levelInfo' },
  { value: 'warn', labelKey: 'page.logs.levelWarn' },
  { value: 'error', labelKey: 'page.logs.levelError' },
  { value: 'fatal', labelKey: 'page.logs.levelFatal' }
];

function defaultRange(): [string, string] {
  return [
    dayjs().subtract(24, 'hour').format(ADMIN_DATETIMERANGE_VALUE_FORMAT),
    dayjs().format(ADMIN_DATETIMERANGE_VALUE_FORMAT)
  ];
}

const [defaultFrom, defaultTo] = defaultRange();

const channel = ref<'' | Api.Logs.Channel>('');
const loading = ref(false);
const rows = ref<Api.Logs.Item[]>([]);
const logStatus = ref<Api.Logs.Status>('ok');
const detailVisible = ref(false);
const detailRow = ref<Api.Logs.Item | null>(null);
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive({
  keyword: '',
  level: '' as '' | Api.Logs.Level,
  requestId: '',
  clientVersion: '',
  from: defaultFrom,
  to: defaultTo
});

const searchInitial = {
  keyword: '',
  level: '',
  requestId: '',
  clientVersion: '',
  timeRange: [defaultFrom, defaultTo]
};

const levelOptions = computed(() => levels.map(item => ({ label: $t(item.labelKey), value: item.value })));

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'timeRange',
    label: $t('page.logs.time'),
    type: 'datetimerange'
  },
  {
    prop: 'level',
    label: $t('page.logs.level'),
    type: 'select',
    clearable: true,
    options: levelOptions.value
  },
  {
    prop: 'keyword',
    label: $t('page.logs.keyword'),
    type: 'input',
    placeholder: $t('page.logs.keywordPlaceholder')
  },
  {
    prop: 'requestId',
    label: $t('page.logs.requestId'),
    type: 'input'
  },
  {
    prop: 'clientVersion',
    label: $t('page.logs.clientVersion'),
    type: 'input'
  }
]);

const columns = computed(() => [
  { prop: 'createdAt', label: $t('page.logs.time'), minWidth: 170, formatTime: true },
  { prop: 'level', label: $t('page.logs.level'), minWidth: 90, slot: 'level' },
  { prop: 'channel', label: $t('page.logs.channel'), minWidth: 100, slot: 'channel' },
  { prop: 'message', label: $t('page.logs.message'), minWidth: 220 },
  { prop: 'requestId', label: $t('page.logs.requestId'), minWidth: 180 },
  { prop: 'clientVersion', label: $t('page.logs.clientVersion'), minWidth: 120, slot: 'clientVersion' },
  { prop: 'actions', label: $t('common.operate'), minWidth: 90, slot: 'actions', fixed: 'right' }
]);

const statusText = computed(() => {
  if (logStatus.value === 'disabled') return $t('page.logs.unavailableDisabled');
  if (logStatus.value === 'down') return $t('page.logs.unavailableDown');
  return '';
});

const payloadText = computed(() => {
  const payload = detailRow.value?.payload;
  if (payload === null || payload === undefined) return '—';
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
});

const logRow = (row: unknown) => row as Api.Logs.Item;

const channelLabel = (value: string | null) => {
  if (!value) return $t('page.logs.channelNone');
  const found = channels.find(item => item.value === value);
  return found ? $t(found.labelKey) : value;
};

const levelLabel = (value: string) => {
  const found = levels.find(item => item.value === value);
  return found ? $t(found.labelKey) : value;
};

const levelTag = (value: string) => {
  if (value === 'error' || value === 'fatal') return 'danger';
  if (value === 'warn') return 'warning';
  return 'info';
};

function toIso(value: string | undefined) {
  if (!value) return undefined;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toISOString() : undefined;
}

const loadList = async () => {
  const from = toIso(query.from);
  const to = toIso(query.to);
  if (!from || !to) {
    window.$message?.warning($t('page.logs.rangeRequired'));
    return;
  }
  if (dayjs(to).diff(dayjs(from)) > RANGE_MS) {
    window.$message?.warning($t('page.logs.rangeTooLong'));
    return;
  }
  loading.value = true;
  const { data, error } = await fetchAdminLogs({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    from,
    to,
    level: query.level || undefined,
    channel: channel.value || undefined,
    keyword: query.keyword || undefined,
    requestId: query.requestId || undefined,
    clientVersion: query.clientVersion || undefined
  });
  loading.value = false;
  if (error || !data) {
    return;
  }
  logStatus.value = data.status;
  rows.value = data.status === 'ok' ? data.items : [];
  pagination.total = data.status === 'ok' ? data.total : 0;
};

const handleSearch = (data: Record<string, unknown>) => {
  query.keyword = String(data.keyword || '');
  query.level = (data.level as Api.Logs.Level) || '';
  query.requestId = String(data.requestId || '');
  query.clientVersion = String(data.clientVersion || '');
  const range = parseSearchTimeRange(data.timeRange);
  query.from = range.from || '';
  query.to = range.to || '';
  pagination.currentPage = 1;
  loadList();
};

const handleReset = () => {
  const [from, to] = defaultRange();
  query.keyword = '';
  query.level = '';
  query.requestId = '';
  query.clientVersion = '';
  query.from = from;
  query.to = to;
  pagination.currentPage = 1;
};

const onChannel = () => {
  pagination.currentPage = 1;
  loadList();
};

const openDetail = (row: Api.Logs.Item) => {
  detailRow.value = row;
  detailVisible.value = true;
};
</script>

<template>
  <JQCustomPage>
    <div class="mb-12px flex flex-wrap items-center justify-between gap-12px">
      <ElRadioGroup v-model="channel" @change="onChannel">
        <ElRadioButton v-for="item in channels" :key="item.value || 'all'" :value="item.value">
          {{ $t(item.labelKey) }}
        </ElRadioButton>
      </ElRadioGroup>
      <span class="text-13px text-gray-500">{{ $t('page.logs.retentionHint') }}</span>
    </div>
    <ElAlert v-if="statusText" class="mb-12px" :title="statusText" type="warning" show-icon :closable="false" />
    <JQSearch :form-items="searchItems" :initial-data="searchInitial" @search="handleSearch" @reset="handleReset" />
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :module-name="$t('page.logs.title')"
      class="min-h-0 flex-1"
      row-key="id"
      @refresh="loadList"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          loadList();
        }
      "
    >
      <template #level="{ row }">
        <ElTag :type="levelTag(logRow(row).level)" size="small">{{ levelLabel(logRow(row).level) }}</ElTag>
      </template>
      <template #channel="{ row }">
        {{ channelLabel(logRow(row).channel) }}
      </template>
      <template #clientVersion="{ row }">
        {{ logRow(row).clientVersion || '—' }}
      </template>
      <template #actions="{ row }">
        <ElButton type="primary" plain size="small" @click="openDetail(logRow(row))">
          {{ $t('page.logs.detail') }}
        </ElButton>
      </template>
    </JQDataTable>
    <ElDialog v-model="detailVisible" :title="$t('page.logs.payload')" width="640px">
      <pre class="max-h-480px overflow-auto whitespace-pre-wrap break-all text-12px">{{ payloadText }}</pre>
    </ElDialog>
  </JQCustomPage>
</template>
