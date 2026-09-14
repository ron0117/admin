import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD } from '@/constants/reg';
import { $t } from '@/locales';
import type { GlobalLangType } from '@/locales';

export function useFormRules() {
  const patternRules = {
    subject: {
      // pattern: REG_USER_NAME,
      message: $t('form.userName.invalid'),
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      message: $t('form.phone.invalid'),
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      message: $t('form.pwd.invalid'),
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      message: $t('form.code.invalid'),
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      message: $t('form.email.invalid'),
      trigger: 'change'
    }
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    subject: [createRequiredRule($t('form.userName.required')), patternRules.subject],
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    email: [createRequiredRule($t('form.email.required')), patternRules.email]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      { required: true, message: $t('form.confirmPwd.required') },
      {
        asyncValidator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        message: $t('form.confirmPwd.invalid'),
        trigger: 'input'
      }
    ];
    return confirmPwdRule;
  }

  /**
   * 创建多语言图片的校验规则
   * @param requiredLang 必填的语言，默认为 'zh-cn'
   * @returns 校验规则
   */
  function createI18nImageRule(requiredLang: GlobalLangType = 'zh-cn'): App.Global.FormRule {
    return {
      required: true,
      asyncValidator: (_rule, value) => {
        // 如果 value 不是对象，直接校验失败
        if (!value || typeof value !== 'object') {
          return Promise.reject(new Error($t('form.required')));
        }

        const langValue = value[requiredLang];

        // 检查必填语言是否有值
        if (!langValue) {
          return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)}${$t('form.required')}`));
        }

        // 判断是否为 Spine 模式
        const isSpineMode = typeof langValue === 'object' && 'spine' in langValue && langValue.spine === true;

        if (isSpineMode) {
          // Spine 模式校验：png, json, atlas 必填，img 和 svg 至少填一个
          const spineConfig = langValue as CommonType.I18nSpineConfig;

          if (!spineConfig.png || !spineConfig.png.trim()) {
            return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)} PNG ${$t('form.required')}`));
          }

          if (!spineConfig.json || !spineConfig.json.trim()) {
            return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)} JSON ${$t('form.required')}`));
          }

          if (!spineConfig.atlas || !spineConfig.atlas.trim()) {
            return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)} ATLAS ${$t('form.required')}`));
          }

          // img 和 svg 至少填一个
          const hasImg = spineConfig.img && spineConfig.img.trim();
          const hasSvg = spineConfig.svg && spineConfig.svg.trim();

          if (!hasImg && !hasSvg) {
            return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)} URL 或 SVG ${$t('form.required')}`));
          }
        } else {
          // 简单模式校验：img 必填
          const simpleConfig = langValue as CommonType.I18nSimpleConfig;

          if (!simpleConfig.img || !simpleConfig.img.trim()) {
            return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)} IMG ${$t('form.required')}`));
          }
        }

        return Promise.resolve();
      },
      trigger: 'blur'
    };
  }

  /**
   * 创建多语言输入的校验规则
   * @param requiredLang 必填的语言，默认为 'zh-cn'
   * @returns 校验规则
   */
  function createI18nInputRule(requiredLang: GlobalLangType = 'zh-cn'): App.Global.FormRule {
    return {
      required: true,
      asyncValidator: (_rule, value) => {
        // 如果 value 不是对象，直接校验失败
        if (!value || typeof value !== 'object') {
          return Promise.reject(new Error($t('form.required')));
        }

        const langValue = value[requiredLang];

        // 检查必填语言是否有值
        if (!langValue || (typeof langValue === 'string' && !langValue.trim())) {
          return Promise.reject(new Error(`${$t(`common.lang.${requiredLang}`)}${$t('form.required')}`));
        }

        return Promise.resolve();
      },
      trigger: 'blur'
    };
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule,
    createI18nImageRule,
    createI18nInputRule
  };
}

export function useForm() {
  const formRef = ref<FormInstance | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.resetFields();
  }

  return {
    formRef,
    validate,
    restoreValidation
  };
}
