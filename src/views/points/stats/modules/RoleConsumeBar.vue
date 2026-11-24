<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts, type ECOption } from '@/hooks/common/echarts';
import { $t } from '@/locales';

const props = defineProps<{
  roles: Api.Points.StatsRole[];
}>();

function axisName(name: string) {
  return name.length > 12 ? `${name.slice(0, 12)}…` : name;
}

function build(): ECOption {
  const roles = props.roles;
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params: unknown) {
        const first = (Array.isArray(params) ? params[0] : params) as { dataIndex?: number };
        const row = roles[first?.dataIndex ?? 0];
        if (!row) return '';
        return [
          row.name,
          `${$t('page.points.stats.netPoints')} ${row.netPoints}`,
          `${$t('page.points.stats.userCount')} ${row.userCount}`
        ].join('<br/>');
      }
    },
    grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      inverse: true,
      data: roles.map(item => axisName(item.name)),
      axisLabel: { width: 96, overflow: 'truncate' }
    },
    series: [{ type: 'bar', barMaxWidth: 16, data: roles.map(item => item.netPoints) }]
  };
}

const { domRef, updateOptions } = useEcharts(build, {
  onRender(instance) {
    instance.setOption(build(), true);
    instance.hideLoading();
  },
  onUpdated(instance) {
    instance.setOption(build(), true);
    instance.hideLoading();
  }
});

watch(
  () => props.roles,
  () => {
    updateOptions(build);
  },
  { deep: true }
);
</script>

<template>
  <div ref="domRef" class="h-320px w-full" />
</template>
