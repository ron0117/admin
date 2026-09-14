<script setup lang="ts">
import { computed, ref } from 'vue';
// import { loginModuleRecord } from '@/constants/app';
import { useAuthStore } from '@/store/modules/auth';
// import { useRouterPush } from '@/hooks/common/router';
import { useForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'PwdLogin' });

const authStore = useAuthStore();
// const { toggleLoginModule } = useRouterPush();
const { validate } = useForm();

interface FormModel {
  subject: string;
  password: string;
}

const model = ref<FormModel>({
  subject: '',
  password: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale ref, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    subject: formRules.subject,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login({ loginType: 'email', subject: model.value.subject, password: model.value.password });
}
</script>

<template>
  <ElForm :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <ElFormItem prop="userName">
      <ElInput v-model="model.subject" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        v-model="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </ElFormItem>
    <ElSpace direction="vertical" :size="24" class="w-full" fill>
      <ElButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </ElButton>
    </ElSpace>
  </ElForm>
</template>

<style scoped></style>
