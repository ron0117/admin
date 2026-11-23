<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { nestRequest } from "@/service/request/nest";

interface Member {
  expiresAt: string;
  suspended: boolean;
  leaseUntil: string | null;
  deviceId: string | null;
}
interface Card {
  code: string;
  days: number;
  priceCents: number | null;
  redeemedBy: string | null;
  redeemedAt: string | null;
  voidedAt: string | null;
  holder: { email: string; photoMembership: Member | null } | null;
}
const shopUrl = ref("");
async function saveShop() {
  const { error } = await nestRequest({
    url: "/admin/photo-cards/shop",
    method: "patch",
    data: { shopUrl: shopUrl.value.trim() },
  });
  if (!error) ElMessage.success("洗图时长卡购买链接已保存");
}
const count = ref(1);
const days = ref(30);
const price = ref<number | undefined>(99);
const page = ref(1);
const total = ref(0);
const search = ref("");
const rows = ref<Card[]>([]);
const lastBatch = ref<string[]>([]);
const busy = ref(false);
const loading = ref(false);
let request = 0;
async function list() {
  const revision = ++request;
  loading.value = true;
  try {
    const { data } = await nestRequest<{ items: Card[]; total: number }>({
      url: "/admin/photo-cards/search",
      method: "post",
      data: { page: page.value, search: search.value.trim() },
    });
    if (data && revision === request) {
      rows.value = data.items;
      total.value = data.total;
    }
  } finally {
    if (revision === request) loading.value = false;
  }
}
async function generate() {
  if (busy.value) return;
  busy.value = true;
  try {
    const { data } = await nestRequest<{ codes: string[] }>({
      url: "/admin/photo-cards/generate",
      method: "post",
      data: {
        count: count.value,
        days: days.value,
        priceCents:
          price.value == null ? undefined : Math.round(price.value * 100),
      },
    });
    if (!data) return;
    lastBatch.value = data.codes;
    ElMessage.success("已生成 " + data.codes.length + " 张时长卡");
    page.value = 1;
    await list();
  } finally {
    busy.value = false;
  }
}
function exportBatch() {
  const url = URL.createObjectURL(
    new Blob([lastBatch.value.join("\r\n")], {
      type: "text/plain;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "洗图时长卡.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function action(
  id: string,
  kind: "void" | "release" | "suspend" | "restore",
  label: string,
) {
  try {
    await ElMessageBox.confirm("确认" + label + "？", "会员管理");
  } catch {
    return;
  }
  const { error } = await nestRequest({
    url: "/admin/photo-cards/" + (kind === "void" ? "void" : "member"),
    method: "post",
    data: kind === "void" ? { code: id } : { userId: id, action: kind },
  });
  if (!error) await list();
}
onMounted(async () => {
  void list();
  const { data } = await nestRequest<{ shopUrl: string | null }>({
    url: "/admin/photo-cards/shop",
    method: "get",
  });
  if (data) shopUrl.value = data.shopUrl ?? "";
});
</script>
<template>
  <ElForm inline @submit.prevent="saveShop">
    <ElFormItem label="时长卡购买链接"
      ><ElInput v-model="shopUrl" placeholder="可留空，线下发卡"
    /></ElFormItem>
    <ElButton native-type="submit">保存链接</ElButton>
  </ElForm>
  <ElForm inline @submit.prevent="generate">
    <ElFormItem label="有效天数"
      ><ElInputNumber v-model="days" :min="1" :max="36500" :precision="0" />
      <ElButton link @click="days = 7">7 天</ElButton
      ><ElButton link @click="days = 30">30 天</ElButton>
    </ElFormItem>
    <ElFormItem label="售价（元）"
      ><ElInputNumber v-model="price" :min="0" :precision="2"
    /></ElFormItem>
    <ElFormItem label="张数"
      ><ElInputNumber v-model="count" :min="1" :max="500" :precision="0"
    /></ElFormItem>
    <ElButton type="primary" :loading="busy" native-type="submit"
      >生成时长卡</ElButton
    >
    <ElButton :disabled="!lastBatch.length" @click="exportBatch"
      >导出本次卡密</ElButton
    >
  </ElForm>
  <ElForm
    inline
    @submit.prevent="
      page = 1;
      list();
    "
    ><ElFormItem label="查询"
      ><ElInput
        v-model="search"
        clearable
        placeholder="卡号或兑换账号邮箱" /></ElFormItem
    ><ElButton native-type="submit">查询</ElButton></ElForm
  >
  <ElTable v-loading="loading" :data="rows" row-key="code" height="420">
    <ElTableColumn prop="code" label="卡密" min-width="240" /><ElTableColumn
      prop="days"
      label="天数"
      width="70"
    />
    <ElTableColumn label="售价" width="80"
      ><template #default="{ row }">{{
        row.priceCents == null ? "—" : (row.priceCents / 100).toFixed(2)
      }}</template></ElTableColumn
    >
    <ElTableColumn label="状态"
      ><template #default="{ row }">{{
        row.voidedAt ? "已作废" : row.redeemedAt ? "已兑换" : "未兑换"
      }}</template></ElTableColumn
    >
    <ElTableColumn label="兑换账号" min-width="160"
      ><template #default="{ row }">{{
        row.holder?.email || "—"
      }}</template></ElTableColumn
    >
    <ElTableColumn label="兑换时间" min-width="160"
      ><template #default="{ row }">{{
        row.redeemedAt ? new Date(row.redeemedAt).toLocaleString() : "—"
      }}</template></ElTableColumn
    >
    <ElTableColumn label="账号到期时间" min-width="160"
      ><template #default="{ row }">{{
        row.holder?.photoMembership
          ? new Date(row.holder.photoMembership.expiresAt).toLocaleString()
          : "—"
      }}</template></ElTableColumn
    >
    <ElTableColumn label="当前设备" min-width="100"
      ><template #default="{ row }">{{
        Date.parse(row.holder?.photoMembership?.leaseUntil) > Date.now()
          ? row.holder.photoMembership.deviceId
          : "—"
      }}</template></ElTableColumn
    >
    <ElTableColumn label="操作" min-width="130"
      ><template #default="{ row }">
        <ElButton
          v-if="!row.voidedAt && !row.redeemedAt"
          link
          @click="action(row.code, 'void', '作废这张卡')"
          >作废</ElButton
        >
        <template v-if="row.holder?.photoMembership"
          ><ElButton
            link
            @click="
              action(
                row.redeemedBy,
                row.holder.photoMembership.suspended ? 'restore' : 'suspend',
                '更改会员状态',
              )
            "
            >{{
              row.holder.photoMembership.suspended ? "恢复会员" : "停用会员"
            }}</ElButton
          >
          <ElButton
            link
            @click="action(row.redeemedBy, 'release', '释放设备占用')"
            >释放占用</ElButton
          ></template
        >
      </template></ElTableColumn
    >
  </ElTable>
  <ElPagination
    v-model:current-page="page"
    :page-size="20"
    :total="total"
    layout="total, prev, pager, next"
    @current-change="list"
  />
</template>
