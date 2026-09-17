<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import type { FormItem } from '@/components';
import { JQCustomPage, JQDataTable, JQDialogForm, JQSearch } from '@/components';
import {
  fetchAdjustAdminUserPoints,
  fetchAdminUserList,
  fetchCreateAdminUser,
  fetchResetAdminUserPassword,
  fetchRoleList,
  fetchUpdateAdminUser
} from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'ManageUser' });

const loading = ref(false);
const rows = ref<Api.AdminUser.Item[]>([]);
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
});

const query = reactive<{
  keyword: string;
  status: '' | Api.AdminUser.Status;
  roleId: string;
}>({
  keyword: '',
  status: '',
  roleId: ''
});

const roleOptions = ref<TCommon.SelectItem[]>([]);

const formVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editing = ref<Api.AdminUser.Item | null>(null);
const resetVisible = ref(false);
const resetTarget = ref<Api.AdminUser.Item | null>(null);
const adjustVisible = ref(false);
const adjustTarget = ref<Api.AdminUser.Item | null>(null);

const statusOptions = computed(() => [
  { label: $t('page.manage.user.statusPending'), value: 'pending_verification' },
  { label: $t('page.manage.user.statusActive'), value: 'active' },
  { label: $t('page.manage.user.statusDisabled'), value: 'disabled' }
]);

const searchItems = computed<FormItem[]>(() => [
  {
    prop: 'keyword',
    label: $t('page.manage.user.keyword'),
    type: 'input',
    placeholder: $t('page.manage.user.form.userEmail')
  },
  {
    prop: 'status',
    label: $t('page.manage.user.userStatus'),
    type: 'select',
    clearable: true,
    options: statusOptions.value
  },
  {
    prop: 'roleId',
    label: $t('page.manage.user.userRole'),
    type: 'select',
    clearable: true,
    options: roleOptions.value
  }
]);

const formItems = computed<FormItem[]>(() => {
  const isCreate = formMode.value === 'create';
  return [
    {
      prop: 'email',
      label: $t('page.manage.user.userEmail'),
      type: 'input',
      span: 2,
      rules: [{ required: true, type: 'email', message: $t('form.email.invalid'), trigger: 'blur' }]
    },
    {
      prop: 'username',
      label: $t('page.manage.user.userName'),
      type: 'input',
      span: 2
    },
    ...(isCreate
      ? [
          {
            prop: 'password',
            label: $t('page.manage.user.password'),
            type: 'input',
            span: 2,
            componentProps: { type: 'password', showPassword: true },
            rules: [{ required: true, min: 8, message: $t('form.pwd.invalid'), trigger: 'blur' }]
          } as FormItem
        ]
      : []),
    {
      prop: 'roleIds',
      label: $t('page.manage.user.userRole'),
      type: 'select',
      span: 2,
      options: roleOptions.value,
      componentProps: { multiple: true, collapseTags: true, filterable: true }
    }
  ];
});

const resetFormItems = computed<FormItem[]>(() => [
  {
    prop: 'password',
    label: $t('page.manage.user.password'),
    type: 'input',
    span: 2,
    componentProps: { type: 'password', showPassword: true },
    rules: [{ required: true, min: 8, message: $t('form.pwd.invalid'), trigger: 'blur' }]
  }
]);

const adjustFormItems = computed<FormItem[]>(() => [
  {
    prop: 'direction',
    label: $t('page.points.user.direction'),
    type: 'radio',
    span: 2,
    options: [
      { label: $t('page.points.user.increase'), value: 'increase' },
      { label: $t('page.points.user.decrease'), value: 'decrease' }
    ],
    rules: [{ required: true, message: $t('form.required'), trigger: 'change' }]
  },
  {
    prop: 'amount',
    label: $t('page.points.user.amount'),
    type: 'number',
    span: 2,
    componentProps: { min: 1, step: 1, precision: 0 },
    rules: [
      {
        required: true,
        type: 'integer',
        min: 1,
        message: $t('page.points.user.amountInvalid'),
        trigger: 'blur'
      }
    ]
  },
  {
    prop: 'remark',
    label: $t('page.points.user.remark'),
    type: 'textarea',
    span: 2,
    componentProps: { maxlength: 200, showWordLimit: true, rows: 3 },
    rules: [{ required: true, message: $t('page.points.user.remarkRequired'), trigger: 'blur' }]
  }
]);

const columns = computed(() => [
  { prop: 'email', label: $t('page.manage.user.userEmail'), minWidth: 200 },
  { prop: 'username', label: $t('page.manage.user.userName'), minWidth: 120 },
  { prop: 'roles', label: $t('page.manage.user.userRole'), minWidth: 180, slot: 'roles' },
  { prop: 'status', label: $t('page.manage.user.userStatus'), minWidth: 120, slot: 'status' },
  { prop: 'points', label: $t('page.points.user.points'), minWidth: 90 },
  { prop: 'createdAt', label: $t('page.manage.user.createdAt'), minWidth: 170, formatTime: true },
  { prop: 'actions', label: $t('common.operate'), minWidth: 360, slot: 'actions', fixed: 'right' }
]);

const formTitle = computed(() =>
  formMode.value === 'create' ? $t('page.manage.user.addUser') : $t('page.manage.user.editUser')
);

const formInitial = computed(() => {
  if (formMode.value === 'edit' && editing.value) {
    return {
      email: editing.value.email,
      username: editing.value.username ?? '',
      roleIds: (editing.value.roles ?? []).map(role => role.id)
    };
  }
  return { email: '', username: '', password: '', roleIds: [] as string[] };
});

const loadList = async () => {
  loading.value = true;
  const { data, error } = await fetchAdminUserList({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    keyword: query.keyword || undefined,
    status: query.status || undefined,
    roleId: query.roleId || undefined
  });
  loading.value = false;
  if (error || !data) {
    return;
  }
  rows.value = data.items;
  pagination.total = data.total;
};

const handleSearch = (data: Record<string, string>) => {
  query.keyword = data.keyword || '';
  query.status = (data.status as Api.AdminUser.Status) || '';
  query.roleId = data.roleId || '';
  pagination.currentPage = 1;
  loadList();
};

const handleReset = () => {
  query.keyword = '';
  query.status = '';
  query.roleId = '';
  pagination.currentPage = 1;
  loadList();
};

const openCreate = () => {
  formMode.value = 'create';
  editing.value = null;
  formVisible.value = true;
};

const openEdit = (row: Api.AdminUser.Item) => {
  formMode.value = 'edit';
  editing.value = row;
  formVisible.value = true;
};

const openReset = (row: Api.AdminUser.Item) => {
  resetTarget.value = row;
  resetVisible.value = true;
};

const openAdjust = (row: Api.AdminUser.Item) => {
  adjustTarget.value = row;
  adjustVisible.value = true;
};

const handleFormSubmit = async (data: Record<string, unknown>) => {
  const email = String(data.email || '');
  const username = String(data.username || '');
  const password = String(data.password || '');
  const roleIds = Array.isArray(data.roleIds) ? (data.roleIds as string[]) : [];
  if (formMode.value === 'create') {
    const { error } = await fetchCreateAdminUser({
      email,
      password,
      username: username || undefined,
      roleIds
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.addSuccess'));
  } else if (editing.value) {
    const prev = (editing.value.roles ?? []).map(role => role.id).sort();
    const next = [...roleIds].sort();
    const sameRoles = prev.length === next.length && prev.every((id, index) => id === next[index]);
    const { error } = await fetchUpdateAdminUser(editing.value.id, {
      email,
      username: username || null,
      ...(sameRoles ? {} : { roleIds })
    });
    if (error) {
      return;
    }
    window.$message?.success($t('common.updateSuccess'));
  }
  formVisible.value = false;
  await loadList();
};

const handleResetSubmit = async (data: Record<string, string>) => {
  if (!resetTarget.value) {
    return;
  }
  const { error } = await fetchResetAdminUserPassword(resetTarget.value.id, data.password);
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  resetVisible.value = false;
};

const handleAdjustSubmit = async (data: Record<string, unknown>) => {
  if (!adjustTarget.value) {
    return;
  }
  const { error } = await fetchAdjustAdminUserPoints(adjustTarget.value.id, {
    direction: data.direction === 'decrease' ? 'decrease' : 'increase',
    amount: Number(data.amount),
    remark: String(data.remark || '').trim()
  });
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  adjustVisible.value = false;
  await loadList();
};

const patchStatus = async (row: Api.AdminUser.Item, status: 'active' | 'disabled') => {
  const confirmText =
    status === 'disabled' ? $t('page.manage.user.confirmDisable') : $t('page.manage.user.confirmEnable');
  try {
    await ElMessageBox.confirm(confirmText, $t('common.tip'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning',
      closeOnClickModal: false
    });
  } catch {
    return;
  }
  const { error } = await fetchUpdateAdminUser(row.id, { status });
  if (error) {
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
  await loadList();
};

const statusLabel = (status: Api.AdminUser.Status) => {
  if (status === 'active') return $t('page.manage.user.statusActive');
  if (status === 'disabled') return $t('page.manage.user.statusDisabled');
  return $t('page.manage.user.statusPending');
};

const userRow = (row: unknown) => row as Api.AdminUser.Item;

const rolesText = (row: Api.AdminUser.Item) => (row.roles ?? []).map(role => role.name).join('、') || '—';

const loadRoles = async () => {
  const { data, error } = await fetchRoleList({ page: 1, pageSize: 100, status: 'active' });
  if (error || !data) {
    return;
  }
  roleOptions.value = data.items.map(role => ({ label: role.name, value: role.id }));
};

onMounted(() => {
  loadRoles();
  loadList();
});
</script>

<template>
  <JQCustomPage>
    <JQSearch
      :form-items="searchItems"
      show-add
      :add-text="$t('common.add')"
      @search="handleSearch"
      @reset="handleReset"
      @add="openCreate"
    />
    <JQDataTable
      :data="rows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      class="min-h-0 flex-1"
      row-key="id"
      @pagination-change="
        ({ currentPage, pageSize }) => {
          pagination.currentPage = currentPage;
          pagination.pageSize = pageSize;
          loadList();
        }
      "
    >
      <template #roles="{ row }">
        {{ rolesText(userRow(row)) }}
      </template>
      <template #status="{ row }">
        <ElTag :type="row.status === 'active' ? 'success' : row.status === 'disabled' ? 'danger' : 'warning'">
          {{ statusLabel(row.status) }}
        </ElTag>
      </template>
      <template #actions="{ row }">
        <ElButton type="primary" plain size="small" @click="openEdit(userRow(row))">{{ $t('common.edit') }}</ElButton>
        <ElButton type="primary" plain size="small" @click="openAdjust(userRow(row))">
          {{ $t('page.points.user.adjust') }}
        </ElButton>
        <ElButton type="primary" plain size="small" @click="openReset(userRow(row))">
          {{ $t('page.manage.user.resetPassword') }}
        </ElButton>
        <ElButton
          v-if="row.status === 'pending_verification'"
          type="success"
          plain
          size="small"
          @click="patchStatus(userRow(row), 'active')"
        >
          {{ $t('page.manage.user.activate') }}
        </ElButton>
        <ElButton
          v-else-if="row.status === 'active'"
          type="danger"
          plain
          size="small"
          @click="patchStatus(userRow(row), 'disabled')"
        >
          {{ $t('common.disable') }}
        </ElButton>
        <ElButton v-else type="success" plain size="small" @click="patchStatus(userRow(row), 'active')">
          {{ $t('common.enable') }}
        </ElButton>
      </template>
    </JQDataTable>

    <JQDialogForm
      v-model="formVisible"
      :title="formTitle"
      :form-items="formItems"
      :initial-data="formInitial"
      width="560px"
      :close-on-click-modal="false"
      :on-submit="handleFormSubmit"
    />
    <JQDialogForm
      v-model="resetVisible"
      :title="$t('page.manage.user.resetPassword')"
      :form-items="resetFormItems"
      :initial-data="{ password: '' }"
      width="480px"
      :close-on-click-modal="false"
      :on-submit="handleResetSubmit"
    />
    <JQDialogForm
      v-model="adjustVisible"
      :title="$t('page.points.user.adjust')"
      :form-items="adjustFormItems"
      :initial-data="{ direction: 'increase', amount: 1, remark: '' }"
      width="480px"
      :close-on-click-modal="false"
      :on-submit="handleAdjustSubmit"
    />
  </JQCustomPage>
</template>
