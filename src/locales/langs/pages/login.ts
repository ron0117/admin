/** Locale source encoding: UTF-8 */
const login_cn: App.I18n.Schema['page']['login'] = {
  common: {
    loginOrRegister: '登录 / 注册',
    userNamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    confirm: '确定',
    back: '返回',
    validateSuccess: '验证成功',
    loginSuccess: '登录成功',
    welcomeBack: '欢迎回来，{userName} ！'
  },
  pwdLogin: {
    title: '密码登录'
  }
};

const login_tw: App.I18n.Schema['page']['login'] = {
  common: {
    loginOrRegister: '登錄 / 註冊',
    userNamePlaceholder: '請輸入使用者名稱',
    passwordPlaceholder: '請輸入密碼',
    confirmPasswordPlaceholder: '請再次輸入密碼',
    confirm: '確定',
    back: '返回',
    validateSuccess: '驗證成功',
    loginSuccess: '登錄成功',
    welcomeBack: '歡迎回來，{userName} ！'
  },
  pwdLogin: {
    title: '密碼登錄'
  }
};

const login_us: App.I18n.Schema['page']['login'] = {
  common: {
    loginOrRegister: 'Login / Register',
    userNamePlaceholder: 'Please enter user name',
    passwordPlaceholder: 'Please enter password',
    confirmPasswordPlaceholder: 'Please enter password again',
    confirm: 'Confirm',
    back: 'Back',
    validateSuccess: 'Verification passed',
    loginSuccess: 'Login successfully',
    welcomeBack: 'Welcome back, {userName} !'
  },
  pwdLogin: {
    title: 'Password Login'
  }
};

export { login_cn, login_tw, login_us };
