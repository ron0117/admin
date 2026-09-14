/** Locale source encoding: UTF-8 */
import { login_us } from './pages/login';
import { bo_us } from './pages/bo';
import { system_us } from './pages/system';
import { home_us } from './pages/home';
import { manage_us } from './pages/manage';
import { game_us } from './pages/game';
import { member_us } from './pages/member';
import { cash_us } from './pages/cash';
import { announce_us } from './pages/announce';
import { error_message_us } from './error-message';
const local: App.I18n.Schema = {
  system: {
    title: 'Admin',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    read: 'Read',
    add: 'Add',
    view: 'View',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    open: 'Open',
    close: 'Close',
    check: 'Check',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    copy: 'Copy',
    paste: 'Paste',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    note: 'Note',
    noPrivilege: 'No Privilege',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    pleaseSelectPrivileges: 'Please select privileges',
    refresh: 'Refresh',
    reset: 'Reset',
    save: 'Save',
    selectAll: 'Select All',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    updateFailed: 'Update Failed',
    addFailed: 'Add Failed',
    userCenter: 'User Center',
    status: 'Status',
    startImport: 'Start Import',
    startExport: 'Start Export',
    disable: 'Disable',
    enable: 'Enable',
    recover: 'Recover',
    detail: 'Detail',
    remove: 'Remove',
    member: {
      id: 'Member ID',
      account: 'Member Account',
      nickname: 'Member Nickname'
    },
    shop: {
      id: 'Shop ID',
      account: 'Shop Account',
      name: 'Shop Name'
    },
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    game: {
      category: 'Game Category',
      id: 'Game ID',
      name: 'Game Name'
    },
    gameType: {
      all: 'All Type',
      '-1': 'All Game',
      slot: 'Slot',
      video: 'Video',
      chess: 'Chess',
      pachinko: 'Pachinko',
      fish: 'Fish',
      electronic: 'Electronic'
    },
    lang: {
      'zh-cn': 'Chinese (Simplified)',
      'zh-tw': 'Chinese (Traditional)',
      'en-us': 'English'
    },
    time: 'Time',
    timeRangeRequired: 'Please select time range',
    beforeModify: 'Before Modify',
    afterModify: 'After Modify',
    operator: 'Operator',
    noChange: 'No Change',
    getSuccess: 'Get Success',
    requestFailed: 'Request Failed',
    import: 'Import',
    export: 'Export',
    batchProgress: {
      title: 'Task Progress',
      processList: 'Process List',
      successCount: 'Succeeded {success} / {total}',
      failedTitle: 'Not synced:',
      retry: 'Retry Failed',
      retryConfirm: 'Retry {count} failed item(s)? You can cancel.',
      taskType: {
        gameTemplatePublish: 'Template Publish Process'
      }
    },
    fileIO: {
      exportFile: 'Export File',
      importFile: 'Import File',
      exportData: 'Export Data',
      fileName: 'File Name',
      fileFormat: 'File Format',
      selectFile: 'Select File',
      delimiter: 'Delimiter',
      encoding: 'Encoding',
      hasHeader: 'Has Header',
      useJsonFormat: 'Use JSON Format',
      pleaseInputFileName: 'Please enter file name (without extension)',
      pleaseSelectFileFormat: 'Please select file format',
      pleaseSelectDelimiter: 'Please select delimiter',
      pleaseSelectEncoding: 'Please select encoding',
      pleaseSelectFile: 'Please select file',
      firstRowIsHeader: 'Is first row header',
      useJsonFormatTip: 'Use JSON format (preserve complete object structure)',
      fileSelected: 'File selected',
      pleaseSelectFileFirst: 'Please select file first',
      noDataInFile: 'No data in file',
      noDataToExport: 'No data to export',
      unsupportedFormat: 'Unsupported export format',
      importSuccess: 'Successfully imported {count} records',
      importFailed: 'Import failed',
      exportSuccess: 'Export success',
      exportFailed: 'Export failed',
      willExportCount: 'Will export {count} records',
      fileInfo: 'File info: {name} ({size} KB)',
      jsonFormatTip: 'JSON file should be in array format',
      formatOptions: {
        xlsx: 'Excel 2007+ (.xlsx)',
        xls: 'Excel 97-2003 (.xls)',
        csv: 'CSV File (.csv)',
        txt: 'Text File (.txt)',
        json: 'JSON File (.json)'
      },
      delimiterOptions: {
        comma: 'Comma (,)',
        semicolon: 'Semicolon (;)',
        tab: 'Tab',
        space: 'Space',
        pipe: 'Pipe (|)'
      }
    },
    startTime: 'Start Time',
    endTime: 'End Time',
    searchFailed: 'Search failed',
    total: 'Total'
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    grayscale: 'Grayscale',
    colourWeakness: 'Colour Weakness',
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode',
      reverseHorizontalMix: 'Reverse first level menus and child level menus position'
    },
    recommendColor: 'Apply Recommended Color Algorithm',
    recommendColorDesc: 'The recommended color algorithm refers to',
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      },
      multilingual: {
        visible: 'Display multilingual button'
      },
      globalSearch: {
        visible: 'Display global search button'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tag Bar Info Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    watermark: {
      visible: 'Watermark Full Screen Visible',
      text: 'Watermark Text',
      enableUserName: 'Enable User Name Watermark'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    resetCacheStrategy: {
      title: 'Reset Cache Strategy',
      close: 'Close Page',
      refresh: 'Refresh Page'
    },
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    home: 'Home',
    demo: 'Component Demo',
    document: 'Document',
    document_project: 'Project Document',
    'document_project-link': 'Project Document(External Link)',
    document_vue: 'Vue Document',
    document_vite: 'Vite Document',
    document_unocss: 'UnoCSS Document',
    document_naive: 'Naive UI Document',
    document_antd: 'Ant Design Vue Document',
    'document_element-plus': 'Element Plus Document',
    document_alova: 'Alova Document',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500'
  },
  page: {
    login: login_us,
    bo: bo_us,
    home: home_us,
    manage: manage_us,
    game: game_us,
    member: member_us,
    system: system_us,
    cash: cash_us,
    announce: announce_us
  },
  form: {
    required: 'Cannot be empty',
    placeholder: 'Please enter {text}',
    select: 'Please select {text}',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    },
    keyword: {
      required: 'Please enter keyword',
      invalid: ''
    },
    gameId: {
      required: 'Please enter gameId',
      invalid: 'GameId format is incorrect'
    },
    positiveInteger: {
      required: 'Please enter a positive integer',
      invalid: 'Please enter a positive integer'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  datatable: {
    itemCount: 'Total {total} items'
  },
  errorMessage: error_message_us
};

export default local;
