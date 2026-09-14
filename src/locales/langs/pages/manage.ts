/** Locale source encoding: UTF-8 */
const manage_cn: App.I18n.Schema['page']['manage'] = {
  common: {
    status: {
      enable: '启用',
      disable: '禁用'
    }
  },
  role: {
    title: '角色列表',
    roleName: '角色名称',
    roleCode: '角色编码',
    roleStatus: '角色状态',
    roleDesc: '角色描述',
    menuAuth: '菜单权限',
    buttonAuth: '按钮权限',
    form: {
      roleName: '请输入角色名称',
      roleCode: '请输入角色编码',
      roleStatus: '请选择角色状态',
      roleDesc: '请输入角色描述'
    },
    addRole: '新增角色',
    editRole: '编辑角色'
  },
  user: {
    title: '用户列表',
    userName: '用户名',
    userGender: '性别',
    nickName: '昵称',
    userPhone: '手机号',
    userEmail: '邮箱',
    userStatus: '用户状态',
    userRole: '用户角色',
    form: {
      userName: '请输入用户名',
      userGender: '请选择性别',
      nickName: '请输入昵称',
      userPhone: '请输入手机号',
      userEmail: '请输入邮箱',
      userStatus: '请选择用户状态',
      userRole: '请选择用户角色'
    },
    addUser: '新增用户',
    editUser: '编辑用户',
    gender: {
      male: '男',
      female: '女'
    }
  },
  menu: {
    home: '首页',
    title: '菜单列表',
    id: 'ID',
    parentId: '父级菜单ID',
    menuType: '菜单类型',
    menuName: '菜单名称',
    routeName: '路由名称',
    routePath: '路由路径',
    pathParam: '路径参数',
    layout: '布局',
    page: '页面组件',
    i18nKey: '国际化key',
    icon: '图标',
    localIcon: '本地图标',
    iconTypeTitle: '图标类型',
    order: '排序',
    constant: '常量路由',
    keepAlive: '缓存路由',
    href: '外链',
    hideInMenu: '隐藏菜单',
    activeMenu: '高亮的菜单',
    multiTab: '支持多页签',
    fixedIndexInTab: '固定在页签中的序号',
    query: '路由参数',
    button: '按钮',
    buttonCode: '按钮编码',
    buttonDesc: '按钮描述',
    menuStatus: '菜单状态',
    form: {
      home: '请选择首页',
      menuType: '请选择菜单类型',
      menuName: '请输入菜单名称',
      routeName: '请输入路由名称',
      routePath: '请输入路由路径',
      pathParam: '请输入路径参数',
      page: '请选择页面组件',
      layout: '请选择布局组件',
      i18nKey: '请输入国际化key',
      icon: '请输入图标',
      localIcon: '请选择本地图标',
      order: '请输入排序',
      keepAlive: '请选择是否缓存路由',
      href: '请输入外链',
      hideInMenu: '请选择是否隐藏菜单',
      activeMenu: '请选择高亮的菜单的路由名称',
      multiTab: '请选择是否支持多标签',
      fixedInTab: '请选择是否固定在页签中',
      fixedIndexInTab: '请输入固定在页签中的序号',
      queryKey: '请输入路由参数Key',
      queryValue: '请输入路由参数Value',
      button: '请选择是否按钮',
      buttonCode: '请输入按钮编码',
      buttonDesc: '请输入按钮描述',
      menuStatus: '请选择菜单状态'
    },
    addMenu: '新增菜单',
    editMenu: '编辑菜单',
    addChildMenu: '新增子菜单',
    type: {
      directory: '目录',
      menu: '菜单'
    },
    iconType: {
      iconify: 'iconify图标',
      local: '本地图标'
    }
  }
};

const manage_tw: App.I18n.Schema['page']['manage'] = {
  common: {
    status: {
      enable: '啟用',
      disable: '禁用'
    }
  },
  role: {
    title: '角色列表',
    roleName: '角色名稱',
    roleCode: '角色編碼',
    roleStatus: '角色狀態',
    roleDesc: '角色描述',
    menuAuth: '菜單權限',
    buttonAuth: '按鈕權限',
    form: {
      roleName: '請輸入角色名稱',
      roleCode: '請輸入角色編碼',
      roleStatus: '請選擇角色狀態',
      roleDesc: '請輸入角色描述'
    },
    addRole: '新增角色',
    editRole: '編輯角色'
  },
  user: {
    title: '用戶列表',
    userName: '使用者名稱',
    userGender: '性別',
    nickName: '暱稱',
    userPhone: '手機號碼',
    userEmail: '信箱',
    userStatus: '用戶狀態',
    userRole: '用戶角色',
    form: {
      userName: '請輸入使用者名稱',
      userGender: '請選擇性別',
      nickName: '請輸入暱稱',
      userPhone: '請輸入手機號碼',
      userEmail: '請輸入信箱',
      userStatus: '請選擇用戶狀態',
      userRole: '請選擇用戶角色'
    },
    addUser: '新增用戶',
    editUser: '編輯用戶',
    gender: {
      male: '男',
      female: '女'
    }
  },
  menu: {
    home: '首頁',
    title: '菜單列表',
    id: 'ID',
    parentId: '父級菜單ID',
    menuType: '菜單類型',
    menuName: '菜單名稱',
    routeName: '路由名稱',
    routePath: '路由路徑',
    pathParam: '路徑參數',
    layout: '布局',
    page: '頁面組件',
    i18nKey: '國際化key',
    icon: '圖示',
    localIcon: '本地圖標',
    iconTypeTitle: '圖示類型',
    order: '排序',
    constant: '常量路由',
    keepAlive: '快取路由',
    href: '外鏈',
    hideInMenu: '隱藏菜單',
    activeMenu: '高亮的菜單',
    multiTab: '支持多頁簽',
    fixedIndexInTab: '固定在頁簽中的序號',
    query: '路由參數',
    button: '按鈕',
    buttonCode: '按鈕編碼',
    buttonDesc: '按鈕描述',
    menuStatus: '菜單狀態',
    form: {
      home: '請選擇首頁',
      menuType: '請選擇菜單類型',
      menuName: '請輸入菜單名稱',
      routeName: '請輸入路由名稱',
      routePath: '請輸入路由路徑',
      pathParam: '請輸入路徑參數',
      page: '請選擇頁面組件',
      layout: '請選擇布局組件',
      i18nKey: '請輸入國際化key',
      icon: '請輸入圖示',
      localIcon: '請選擇本地圖標',
      order: '請輸入排序',
      keepAlive: '請選擇是否快取路由',
      href: '請輸入外鏈',
      hideInMenu: '請選擇是否隱藏菜單',
      activeMenu: '請選擇高亮的菜單的路由名稱',
      multiTab: '請選擇是否支持多標籤',
      fixedInTab: '請選擇是否固定在頁簽中',
      fixedIndexInTab: '請輸入固定在頁簽中的序號',
      queryKey: '請輸入路由參數Key',
      queryValue: '請輸入路由參數Value',
      button: '請選擇是否按鈕',
      buttonCode: '請輸入按鈕編碼',
      buttonDesc: '請輸入按鈕描述',
      menuStatus: '請選擇菜單狀態'
    },
    addMenu: '新增菜單',
    editMenu: '編輯菜單',
    addChildMenu: '新增子菜單',
    type: {
      directory: '目錄',
      menu: '菜單'
    },
    iconType: {
      iconify: 'iconify圖示',
      local: '本地圖標'
    }
  }
};

const manage_us: App.I18n.Schema['page']['manage'] = {
  common: {
    status: {
      enable: 'Enable',
      disable: 'Disable'
    }
  },
  role: {
    title: 'Role List',
    roleName: 'Role Name',
    roleCode: 'Role Code',
    roleStatus: 'Role Status',
    roleDesc: 'Role Description',
    menuAuth: 'Menu Auth',
    buttonAuth: 'Button Auth',
    form: {
      roleName: 'Please enter role name',
      roleCode: 'Please enter role code',
      roleStatus: 'Please select role status',
      roleDesc: 'Please enter role description'
    },
    addRole: 'Add Role',
    editRole: 'Edit Role'
  },
  user: {
    title: 'User List',
    userName: 'User Name',
    userGender: 'Gender',
    nickName: 'Nick Name',
    userPhone: 'Phone Number',
    userEmail: 'Email',
    userStatus: 'User Status',
    userRole: 'User Role',
    form: {
      userName: 'Please enter user name',
      userGender: 'Please select gender',
      nickName: 'Please enter nick name',
      userPhone: 'Please enter phone number',
      userEmail: 'Please enter email',
      userStatus: 'Please select user status',
      userRole: 'Please select user role'
    },
    addUser: 'Add User',
    editUser: 'Edit User',
    gender: {
      male: 'Male',
      female: 'Female'
    }
  },
  menu: {
    home: 'Home',
    title: 'Menu List',
    id: 'ID',
    parentId: 'Parent ID',
    menuType: 'Menu Type',
    menuName: 'Menu Name',
    routeName: 'Route Name',
    routePath: 'Route Path',
    pathParam: 'Path Param',
    layout: 'Layout Component',
    page: 'Page Component',
    i18nKey: 'I18n Key',
    icon: 'Icon',
    localIcon: 'Local Icon',
    iconTypeTitle: 'Icon Type',
    order: 'Order',
    constant: 'Constant',
    keepAlive: 'Keep Alive',
    href: 'Href',
    hideInMenu: 'Hide In Menu',
    activeMenu: 'Active Menu',
    multiTab: 'Multi Tab',
    fixedIndexInTab: 'Fixed Index In Tab',
    query: 'Query Params',
    button: 'Button',
    buttonCode: 'Button Code',
    buttonDesc: 'Button Desc',
    menuStatus: 'Menu Status',
    form: {
      home: 'Please select home',
      menuType: 'Please select menu type',
      menuName: 'Please enter menu name',
      routeName: 'Please enter route name',
      routePath: 'Please enter route path',
      pathParam: 'Please enter path param',
      page: 'Please select page component',
      layout: 'Please select layout component',
      i18nKey: 'Please enter i18n key',
      icon: 'Please enter iconify name',
      localIcon: 'Please enter local icon name',
      order: 'Please enter order',
      keepAlive: 'Please select whether to cache route',
      href: 'Please enter href',
      hideInMenu: 'Please select whether to hide menu',
      activeMenu: 'Please select route name of the highlighted menu',
      multiTab: 'Please select whether to support multiple tabs',
      fixedInTab: 'Please select whether to fix in the tab',
      fixedIndexInTab: 'Please enter the index fixed in the tab',
      queryKey: 'Please enter route parameter Key',
      queryValue: 'Please enter route parameter Value',
      button: 'Please select whether it is a button',
      buttonCode: 'Please enter button code',
      buttonDesc: 'Please enter button description',
      menuStatus: 'Please select menu status'
    },
    addMenu: 'Add Menu',
    editMenu: 'Edit Menu',
    addChildMenu: 'Add Child Menu',
    type: {
      directory: 'Directory',
      menu: 'Menu'
    },
    iconType: {
      iconify: 'Iconify Icon',
      local: 'Local Icon'
    }
  }
};

export { manage_cn, manage_tw, manage_us };
