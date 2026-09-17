/** Locale source encoding: UTF-8 */
import { login_tw } from './pages/login';
import { bo_tw } from './pages/bo';
import { system_tw } from './pages/system';
import { home_tw } from './pages/home';
import { manage_tw } from './pages/manage';
import { points_tw } from './pages/points';
import { game_tw } from './pages/game';
import { member_tw } from './pages/member';
import { cash_tw } from './pages/cash';
import { announce_tw } from './pages/announce';
import { error_message_tw } from './error-message';
const local: App.I18n.Schema = {
  system: {
    title: 'Admin',
    updateTitle: '系統版本更新通知',
    updateContent: '檢測到系統有新版本發布，是否立即刷新頁面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍後再說'
  },
  common: {
    action: '操作',
    read: '檢視',
    add: '新增',
    view: '查看',
    addSuccess: '添加成功',
    backToHome: '返回首頁',
    batchDelete: '批次刪除',
    cancel: '取消',
    open: '開啟',
    close: '關閉',
    check: '勾選',
    expandColumn: '展開列',
    columnSetting: '列設置',
    config: '配置',
    confirm: '確認',
    copy: '複製',
    paste: '粘貼',
    delete: '刪除',
    deleteSuccess: '刪除成功',
    confirmDelete: '確認刪除嗎？',
    edit: '編輯',
    warning: '警告',
    error: '錯誤',
    index: '序號',
    keywordSearch: '請輸入關鍵字搜索',
    logout: '退出登錄',
    logoutConfirm: '確認退出登錄嗎？',
    lookForward: '敬請期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '無數據',
    note: '備註',
    noPrivilege: '無權限',
    operate: '操作',
    pleaseCheckValue: '請檢查輸入的值是否合法',
    pleaseSelectPrivileges: '請選擇權限',
    refresh: '刷新',
    reset: '重設',
    save: '保存',
    selectAll: '全選',
    search: '搜索',
    switch: '切換',
    tip: '提示',
    trigger: '觸發',
    update: '更新',
    updateSuccess: '更新成功',
    updateFailed: '更新失敗',
    addFailed: '添加失敗',
    userCenter: '個人中心',
    status: '狀態',
    startImport: '開始導入',
    startExport: '開始導出',
    disable: '禁用',
    enable: '啟用',
    recover: '恢復',
    detail: '明细',
    remove: '解除',
    member: {
      id: '會員編號',
      account: '會員帳號',
      nickname: '會員暱稱'
    },
    shop: {
      id: '店家編號',
      account: '店家帳號',
      name: '店家名稱'
    },
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    game: {
      category: '遊戲類別',
      id: '遊戲編號',
      name: '遊戲名稱'
    },
    gameType: {
      all: '全部類型',
      '-1': '全部遊戲',
      slot: '轉輪',
      video: '視訊',
      chess: '棋牌',
      pachinko: '柏青',
      fish: '魚機',
      electronic: '電子'
    },
    lang: {
      'zh-cn': '中文(簡體)',
      'zh-tw': '中文(繁體)',
      'en-us': 'English'
    },
    time: '時間',
    timeRangeRequired: '請選擇時間範圍',
    beforeModify: '修改前',
    afterModify: '修改後',
    operator: '操作人',
    noChange: '無變更',
    getSuccess: '獲取成功',
    requestFailed: '請求失敗',
    import: '匯入',
    export: '匯出',
    batchProgress: {
      title: '任務進度',
      processList: '進程列表',
      successCount: '已成功 {success} / {total}',
      failedTitle: '未同步：',
      retry: '重試失敗項',
      retryConfirm: '將對 {count} 個失敗項重新執行，是否繼續？',
      taskType: {
        gameTemplatePublish: '模板發佈進程'
      }
    },
    fileIO: {
      exportFile: '導出文件',
      importFile: '導入文件',
      exportData: '導出數據',
      fileName: '檔案名',
      fileFormat: '檔案格式',
      selectFile: '選擇文件',
      delimiter: '分隔符號',
      encoding: '編碼格式',
      hasHeader: '包含表頭',
      useJsonFormat: '使用 JSON 格式',
      pleaseInputFileName: '請輸入檔案名（不含副檔名）',
      pleaseSelectFileFormat: '請選擇檔案格式',
      pleaseSelectDelimiter: '請選擇分隔符號',
      pleaseSelectEncoding: '請選擇編碼格式',
      pleaseSelectFile: '請選擇文件',
      firstRowIsHeader: '第一行是否為表頭',
      useJsonFormatTip: '使用 JSON 格式（保留完整的對象結構）',
      fileSelected: '已選擇文件',
      pleaseSelectFileFirst: '請先選擇文件',
      noDataInFile: '文件中沒有數據',
      noDataToExport: '沒有數據可導出',
      unsupportedFormat: '不支援的匯出格式',
      importSuccess: '成功導入 {count} 條數據',
      importFailed: '導入失敗',
      exportSuccess: '導出成功',
      exportFailed: '導出失敗',
      willExportCount: '將導出 {count} 條數據',
      fileInfo: '文件資訊: {name} ({size} KB)',
      jsonFormatTip: 'JSON 文件應為對象數組格式',
      formatOptions: {
        xlsx: 'Excel 2007+ (.xlsx)',
        xls: 'Excel 97-2003 (.xls)',
        csv: 'CSV 文件 (.csv)',
        txt: '文本文件 (.txt)',
        json: 'JSON 文件 (.json)'
      },
      delimiterOptions: {
        comma: '逗號 (,)',
        semicolon: '分號 (;)',
        tab: '製表符 (Tab)',
        space: '空格',
        pipe: '豎線 (|)'
      }
    },
    startTime: '開始時間',
    endTime: '結束時間',
    searchFailed: '搜索失敗',
    total: '合計'
  },
  request: {
    logout: '請求失敗後登出用戶',
    logoutMsg: '用戶狀態失效，請重新登入',
    logoutWithModal: '請求失敗後彈出模態框再登出用戶',
    logoutWithModalMsg: '用戶狀態失效，請重新登入',
    refreshToken: '請求的token已過期，刷新token',
    tokenExpired: 'token已過期'
  },
  theme: {
    themeSchema: {
      title: '主題模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟隨系統'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左側菜單模式',
      'vertical-mix': '左側菜單混合模式',
      horizontal: '頂部選單模式',
      'horizontal-mix': '頂部選單混合模式',
      reverseHorizontalMix: '一級菜單與子級菜單位置反轉'
    },
    recommendColor: '應用推薦算法的顏色',
    recommendColorDesc: '推薦顏色的算法參照',
    themeColor: {
      title: '主題顏色',
      primary: '主色',
      info: '資訊色',
      success: '成功色',
      warning: '警告色',
      error: '錯誤色',
      followPrimary: '跟隨主色'
    },
    scrollMode: {
      title: '滾動模式',
      wrapper: '外層滾動',
      content: '主體滾動'
    },
    page: {
      animate: '頁面切換動畫',
      mode: {
        title: '頁面切換動畫類型',
        'fade-slide': '滑動',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '縮放消退',
        'zoom-fade': '漸變',
        'zoom-out': '閃現',
        none: '無'
      }
    },
    fixedHeaderAndTab: '固定頭部和標籤欄',
    header: {
      height: '頭部高度',
      breadcrumb: {
        visible: '顯示麵包屑',
        showIcon: '顯示麵包屑圖示'
      },
      multilingual: {
        visible: '顯示多語言按鈕'
      },
      globalSearch: {
        visible: '顯示全局搜索按鈕'
      }
    },
    tab: {
      visible: '顯示標籤欄',
      cache: '標籤欄資訊快取',
      height: '標籤欄高度',
      mode: {
        title: '標籤欄風格',
        chrome: 'Google風格',
        button: '按鈕風格'
      }
    },
    sider: {
      inverted: '深色側邊欄',
      width: '側邊欄寬度',
      collapsedWidth: '側邊欄摺疊寬度',
      mixWidth: '混合布局側邊欄寬度',
      mixCollapsedWidth: '混合布局側邊欄摺疊寬度',
      mixChildMenuWidth: '混合布局子菜單寬度'
    },
    footer: {
      visible: '顯示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '顯示全螢幕浮水印',
      text: '浮水印文本',
      enableUserName: '啟用使用者名稱浮水印'
    },
    themeDrawerTitle: '主題配置',
    pageFunTitle: '頁面功能',
    resetCacheStrategy: {
      title: '重設快取策略',
      close: '關閉頁面',
      refresh: '刷新頁面'
    },
    configOperation: {
      copyConfig: '複製配置',
      copySuccessMsg: '複製成功，請替換 src/theme/settings.ts 中的變數 themeSettings',
      resetConfig: '重設配置',
      resetSuccessMsg: '重設成功'
    }
  },
  route: {
    login: '登錄',
    403: '無權限',
    404: '頁面不存在',
    500: '伺服器錯誤',
    home: '首頁',
    demo: '組件示例',
    manage: '帳號管理',
    manage_admin: '管理員列表',
    user: '用戶管理',
    user_list: '用戶列表',
    user_role: '角色管理',
    points: '積分',
    points_settings: '功能設定',
    points_records: '積分流水',
    document: '文件',
    document_project: '項目文件',
    'document_project-link': '項目文件(外鏈)',
    document_vue: 'Vue文件',
    document_vite: 'Vite文件',
    document_unocss: 'UnoCSS文件',
    document_naive: 'Naive UI文件',
    document_antd: 'Ant Design Vue文件',
    'document_element-plus': 'Element Plus文件',
    document_alova: 'Alova文件',
    exception: '異常頁',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500'
  },
  page: {
    login: login_tw,
    bo: bo_tw,
    home: home_tw,
    manage: manage_tw,
    points: points_tw,
    game: game_tw,
    member: member_tw,
    system: system_tw,
    cash: cash_tw,
    announce: announce_tw
  },
  form: {
    required: '不能為空',
    placeholder: '請輸入{text}',
    select: '請選擇{text}',
    userName: {
      required: '請輸入使用者名稱',
      invalid: '使用者名稱格式不正確'
    },
    phone: {
      required: '請輸入手機號碼',
      invalid: '手機號碼格式不正確'
    },
    pwd: {
      required: '請輸入密碼',
      invalid: '密碼格式不正確，6-18位字元，包含字母、數字、下劃線'
    },
    confirmPwd: {
      required: '請輸入確認密碼',
      invalid: '兩次輸入密碼不一致'
    },
    code: {
      required: '請輸入驗證碼',
      invalid: '驗證碼格式不正確'
    },
    email: {
      required: '請輸入信箱',
      invalid: '信箱格式不正確'
    },
    keyword: {
      required: '請輸入關鍵字',
      invalid: ''
    },
    gameId: {
      required: '請輸入遊戲編號',
      invalid: '遊戲編號格式不正確'
    },
    positiveInteger: {
      required: '請輸入正整數',
      invalid: '請輸入正整數'
    }
  },
  dropdown: {
    closeCurrent: '關閉',
    closeOther: '關閉其它',
    closeLeft: '關閉左側',
    closeRight: '關閉右側',
    closeAll: '關閉所有'
  },
  icon: {
    themeConfig: '主題配置',
    themeSchema: '主題模式',
    lang: '切換語言',
    fullscreen: '全螢幕',
    fullscreenExit: '退出全螢幕',
    reload: '刷新頁面',
    collapse: '摺疊菜單',
    expand: '展開菜單',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 條'
  },
  errorMessage: error_message_tw
};

export default local;
