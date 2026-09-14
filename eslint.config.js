import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', 'Register', '[id]', '[url]']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/']
        }
      ],
      'import/no-named-default': 'off',
      'vue/custom-event-name-casing': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'vue/require-default-prop': 'off',
      'unocss/order-attributify': 'off',
      'no-console': 'off',
      // 关闭文件名必须驼峰
      'vue/multi-word-component-names': 'off',
      // 关闭多个传参校验
      'max-params': 'off',
      // 关闭圈复杂度限制
      complexity: 'off'
    }
  }
).then(config => config);
