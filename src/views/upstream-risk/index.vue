<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { JQCustomPage } from '@/components';
import { fetchAdminUserList, fetchUpstreamRisk } from '@/service/api';

defineOptions({ name: 'UpstreamRisk' });

const range = ref<[string, string]>([dayjs().subtract(24, 'hour').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')]);
const userId = ref('');
const userOptions = ref<Array<{ label: string; value: string }>>([]);
const userLoading = ref(false);
const loading = ref(false);
const data = ref<Api.UpstreamRisk.Response>();
const summary = computed(() => data.value?.summary ?? { total: 0, success: 0, failed: 0, successRate: 0, avgDurationMs: 0 });

async function searchUsers(keyword: string) {
  userLoading.value = true;
  const { data: result } = await fetchAdminUserList({ keyword: keyword.trim() || undefined, pageSize: 50 });
  userLoading.value = false;
  userOptions.value = (result?.items ?? []).map(item => ({ label: `${item.email}${item.username ? `（${item.username}）` : ''}`, value: item.id }));
}
async function load() {
  if (!range.value?.[0] || !range.value?.[1]) return;
  loading.value = true;
  const result = await fetchUpstreamRisk({ from: dayjs(range.value[0]).toISOString(), to: dayjs(range.value[1]).toISOString(), userId: userId.value || undefined });
  loading.value = false;
  if (!result.error && result.data) data.value = result.data;
}
function formatTime(value: string) { return dayjs(value).format('MM-DD HH:mm:ss'); }
function clientName(value?: string) { return value === 'miniapp' ? '网页端 Miniapp' : value === 'electron' ? 'Electron' : value || '未知'; }

onMounted(() => { searchUsers(''); load(); });
</script>

<template>
  <JQCustomPage>
    <ElCard shadow="never" class="mb-12px">
      <div class="flex flex-wrap items-center gap-12px">
        <ElDatePicker v-model="range" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" :clearable="false" />
        <ElSelect v-model="userId" filterable remote clearable :remote-method="searchUsers" :loading="userLoading" placeholder="全部账号（可搜索邮箱/用户名）" class="w-320px">
          <ElOption v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
        <ElButton type="primary" :loading="loading" @click="load">查询统计</ElButton>
        <span class="text-12px text-gray-500">数据从本版本部署后开始按账号采集，最长查询 14 天</span>
      </div>
    </ElCard>

    <ElAlert v-if="data && data.status !== 'ok'" class="mb-12px" type="warning" show-icon :closable="false" title="日志统计库当前不可用" />
    <ElRow :gutter="12" class="mb-12px">
      <ElCol v-for="item in [
        { label: '请求总数', value: summary.total }, { label: '成功请求', value: summary.success },
        { label: '失败请求', value: summary.failed }, { label: '成功率', value: `${summary.successRate}%` },
        { label: '平均耗时', value: `${summary.avgDurationMs} ms` }
      ]" :key="item.label" :xs="12" :sm="8" :lg="4">
        <ElCard shadow="never"><div class="text-13px text-gray-500">{{ item.label }}</div><div class="mt-8px text-24px font-600">{{ item.value }}</div></ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="12" class="mb-12px">
      <ElCol :span="12"><ElCard shadow="never" header="状态码分布">
        <ElTable :data="data?.statusBreakdown || []" size="small"><ElTableColumn prop="statusCode" label="状态码" /><ElTableColumn prop="count" label="数量" /></ElTable>
      </ElCard></ElCol>
      <ElCol :span="12"><ElCard shadow="never" header="客户端成功率">
        <ElTable :data="data?.clientBreakdown || []" size="small"><ElTableColumn label="客户端"><template #default="scope">{{ clientName(scope.row.client) }}</template></ElTableColumn><ElTableColumn prop="total" label="请求数" /><ElTableColumn label="成功率"><template #default="scope">{{ scope.row.successRate }}%</template></ElTableColumn></ElTable>
      </ElCard></ElCol>
    </ElRow>

    <ElCard shadow="never" header="时间趋势" class="mb-12px">
      <ElTable :data="data?.trend || []" max-height="300"><ElTableColumn label="时间" min-width="150"><template #default="scope">{{ formatTime(scope.row.time) }}</template></ElTableColumn><ElTableColumn prop="total" label="请求数" /><ElTableColumn prop="success" label="成功数" /><ElTableColumn label="成功率"><template #default="scope">{{ scope.row.successRate }}%</template></ElTableColumn></ElTable>
    </ElCard>
    <ElCard shadow="never" header="最近失败（最多 50 条）">
      <ElTable :data="data?.recentFailures || []" max-height="420"><ElTableColumn label="时间" min-width="150"><template #default="scope">{{ formatTime(scope.row.createdAt) }}</template></ElTableColumn><ElTableColumn prop="userId" label="账号 ID" min-width="220" show-overflow-tooltip /><ElTableColumn label="客户端" min-width="120"><template #default="scope">{{ clientName(scope.row.client) }}</template></ElTableColumn><ElTableColumn prop="statusCode" label="状态码" width="90" /><ElTableColumn prop="durationMs" label="耗时(ms)" width="110" /><ElTableColumn prop="error" label="错误" min-width="280" show-overflow-tooltip /><ElTableColumn prop="requestId" label="请求 ID" min-width="220" show-overflow-tooltip /></ElTable>
    </ElCard>
  </JQCustomPage>
</template>
