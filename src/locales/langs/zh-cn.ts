/** Locale source encoding: UTF-8 */
import { login_cn } from './pages/login';
import { bo_cn } from './pages/bo';
import { system_cn } from './pages/system';
import { home_cn } from './pages/home';
import { manage_cn } from './pages/manage';
import { game_cn } from './pages/game';
import { member_cn } from './pages/member';
import { cash_cn } from './pages/cash';
import { announce_cn } from './pages/announce';
import { error_message_cn } from './error-message';
const local: App.I18n.Schema = {
  system: {
    title: 'Admin',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    read: '检视',
    add: '新增',
    view: '查看',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    open: '开启',
    close: '关闭',
    check: '勾选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    copy: '复制',
    paste: '粘贴',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    note: '备注',
    noPrivilege: '无权限',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    pleaseSelectPrivileges: '请选择权限',
    refresh: '刷新',
    reset: '重置',
    save: '保存',
    selectAll: '全选',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    addFailed: '添加失败',
    userCenter: '个人中心',
    status: '状态',
    startImport: '开始导入',
    startExport: '开始导出',
    disable: '禁用',
    enable: '启用',
    recover: '恢复',
    detail: '明细',
    remove: '解除',
    member: {
      id: '会员编号',
      account: '会员账号',
      nickname: '会员昵称'
    },
    shop: {
      id: '店家编号',
      account: '店家账号',
      name: '店家名称'
    },
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    game: {
      category: '游戏类别',
      id: '游戏编号',
      name: '游戏名称'
    },
    gameType: {
      all: '全部类型',
      '-1': '全部游戏',
      slot: '转轮',
      video: '视讯',
      chess: '棋牌',
      pachinko: '柏青',
      fish: '鱼机',
      electronic: '电子'
    },
    lang: {
      'zh-cn': '中文(简体)',
      'zh-tw': '中文(繁體)',
      'en-us': 'English'
    },
    time: '时间',
    timeRangeRequired: '请选择时间范围',
    beforeModify: '修改前',
    afterModify: '修改后',
    operator: '操作人',
    noChange: '无变更',
    getSuccess: '获取成功',
    requestFailed: '请求失败',
    import: '汇入',
    export: '汇出',
    batchProgress: {
      title: '任务进度',
      processList: '进程列表',
      successCount: '已成功 {success} / {total}',
      failedTitle: '未同步：',
      retry: '重试失败项',
      retryConfirm: '将对 {count} 个失败项重新执行，是否继续？',
      taskType: {
        gameTemplatePublish: '模板发布进程'
      }
    },
    fileIO: {
      exportFile: '导出文件',
      importFile: '导入文件',
      exportData: '导出数据',
      fileName: '文件名',
      fileFormat: '文件格式',
      selectFile: '选择文件',
      delimiter: '分隔符',
      encoding: '编码格式',
      hasHeader: '包含表头',
      useJsonFormat: '使用 JSON 格式',
      pleaseInputFileName: '请输入文件名（不含扩展名）',
      pleaseSelectFileFormat: '请选择文件格式',
      pleaseSelectDelimiter: '请选择分隔符',
      pleaseSelectEncoding: '请选择编码格式',
      pleaseSelectFile: '请选择文件',
      firstRowIsHeader: '第一行是否为表头',
      useJsonFormatTip: '使用 JSON 格式（保留完整的对象结构）',
      fileSelected: '已选择文件',
      pleaseSelectFileFirst: '请先选择文件',
      noDataInFile: '文件中没有数据',
      noDataToExport: '没有数据可导出',
      unsupportedFormat: '不支持的导出格式',
      importSuccess: '成功导入 {count} 条数据',
      importFailed: '导入失败',
      exportSuccess: '导出成功',
      exportFailed: '导出失败',
      willExportCount: '将导出 {count} 条数据',
      fileInfo: '文件信息: {name} ({size} KB)',
      jsonFormatTip: 'JSON 文件应为对象数组格式',
      formatOptions: {
        xlsx: 'Excel 2007+ (.xlsx)',
        xls: 'Excel 97-2003 (.xls)',
        csv: 'CSV 文件 (.csv)',
        txt: '文本文件 (.txt)',
        json: 'JSON 文件 (.json)'
      },
      delimiterOptions: {
        comma: '逗号 (,)',
        semicolon: '分号 (;)',
        tab: '制表符 (Tab)',
        space: '空格',
        pipe: '竖线 (|)'
      }
    },
    startTime: '开始时间',
    endTime: '结束时间',
    searchFailed: '搜索失败',
    total: '合计'
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '左侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式',
      reverseHorizontalMix: '一级菜单与子级菜单位置反转'
    },
    recommendColor: '应用推荐算法的颜色',
    recommendColorDesc: '推荐颜色的算法参照',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      },
      multilingual: {
        visible: '显示多语言按钮'
      },
      globalSearch: {
        visible: '显示全局搜索按钮'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '标签栏信息缓存',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '显示全屏水印',
      text: '水印文本',
      enableUserName: '启用用户名水印'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    resetCacheStrategy: {
      title: '重置缓存策略',
      close: '关闭页面',
      refresh: '刷新页面'
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    home: '首页',
    demo: '组件示例',
    document: '文档',
    document_project: '项目文档',
    'document_project-link': '项目文档(外链)',
    document_vue: 'Vue文档',
    document_vite: 'Vite文档',
    document_unocss: 'UnoCSS文档',
    document_naive: 'Naive UI文档',
    document_antd: 'Ant Design Vue文档',
    'document_element-plus': 'Element Plus文档',
    document_alova: 'Alova文档',
    exception: '异常页',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500'
  },
  page: {
    login: login_cn,
    bo: bo_cn,
    home: home_cn,
    manage: manage_cn,
    game: game_cn,
    member: member_cn,
    system: system_cn,
    cash: cash_cn,
    announce: announce_cn
  },
  form: {
    required: '不能为空',
    placeholder: '请输入{text}',
    select: '请选择{text}',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    },
    keyword: {
      required: '请输入关键字',
      invalid: ''
    },
    gameId: {
      required: '请输入遊戲編號',
      invalid: '遊戲編號格式不正確'
    },
    positiveInteger: {
      required: '请输入正整数',
      invalid: '请输入正整数'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条'
  },
  errorMessage: error_message_cn
};

export default local;
