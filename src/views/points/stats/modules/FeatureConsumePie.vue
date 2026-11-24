<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts, type ECOption } from '@/hooks/common/echarts';
import { $t } from '@/locales';

const props = defineProps<{
  features: Api.Points.StatsFeature[];
  total: number;
}>();

function build(): ECOption {
  const features = props.features.filter(item => item.netPoints > 0);
  return {
    title: {
      text: String(props.total),
      subtext: $t('page.points.stats.netPoints'),
      left: '36%',
      top: 'center',
      textAlign: 'center'
    },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      formatter(name: string) {
        const row = features.find(item => item.name === name);
        return row ? `${name} ${row.netPoints}` : name;
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '70%'],
        center: ['36%', '50%'],
        label: { show: false },
        data: features.map(item => ({ name: item.name, value: item.netPoints }))
      }
    ]
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
  () => [props.features, props.total],
  () => {
    updateOptions(build);
  },
  { deep: true }
);
</script>

<template>
  <div ref="domRef" class="h-320px w-full" />
</template>
