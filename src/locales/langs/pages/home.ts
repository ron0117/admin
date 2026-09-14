/** Locale source encoding: UTF-8 */
const home_cn: App.I18n.Schema['page']['home'] = {
  greeting: '早安，{userName}, 今天又是充满活力的一天!',
  contentInfo: {
    welcome: '欢迎进入O2O管理后台系统',
    detail: '详情请使用左侧导航栏查询'
  }
};

const home_tw: App.I18n.Schema['page']['home'] = {
  greeting: '早安，{userName}, 今天又是充滿活力的一天!',
  contentInfo: {
    welcome: '歡迎進入O2O管理後台系統',
    detail: '詳情請使用左側導航欄查詢'
  }
};

const home_us: App.I18n.Schema['page']['home'] = {
  greeting: 'Good morning, {userName}, today is another day full of vitality!',
  contentInfo: {
    welcome: 'Welcome to O2O Admin',
    detail: 'Please use the left navigation bar to query the details'
  }
};

export { home_cn, home_tw, home_us };
