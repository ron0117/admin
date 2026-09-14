import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = getBuildTime();

  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    optimizeDeps: {
      include: ['@iconify/utils']
    },
    server: {
      host: '0.0.0.0',
      port: 18101,
      open: true,
      proxy: createViteProxy(viteEnv, enableProxy)
    },
    preview: {
      port: 18101
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false
      },
      // 优化构建性能和内存使用
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // 手动分块，减少单个 chunk 的大小
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'chart-vendor': ['echarts', '@antv/g2', '@antv/g6'],
            'vchart-vendor': ['@visactor/vchart', '@visactor/vchart-theme'],
            'vtable-vendor': ['@visactor/vue-vtable', '@visactor/vtable-editors', '@visactor/vtable-gantt'],
            'editor-vendor': ['wangeditor', 'vditor', 'jsoneditor'],
            'utils-vendor': ['dayjs', 'clipboard', 'dompurify', 'xlsx']
          }
        }
      }
    }
  };
});
