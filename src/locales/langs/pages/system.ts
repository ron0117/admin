/** Locale source encoding: UTF-8 */
const system_cn: App.I18n.Schema['page']['system'] = {
  setting: {
    boUserID: 'BO用户ID',
    category: '配置类别',
    name: '配置名称',
    value: '配置内容',
    comment: '备注',
    shared: '是否共享客户端',
    modificationTime: '修改时间',
    detail: '配置详情',
    systemConfig: {
      tips: '如果内容是对象，请确保是合法的 JSON 格式'
    }
  },
  gameMaintain: {
    gameSwitch: '游戏开关',
    setting: '当前设定',
    record: '操作记录',
    setExecuteTime: '指定排程',
    executeTime: '排程时间',
    search: '搜索',
    operationTime: '操作时间',
    scheduleSetting: '排程设定',
    settingItems: '设定项目',
    adminName: '异动人员',
    operation: '操作',
    open: '开放',
    maintain: '维护',
    stop: '设定开放',
    start: '设定维护',
    isDelete: '是否取消排程？',
    cancel: '取消排程',
    refresh: '刷新',
    isOpenNow: '是否立即开放？',
    isMaintainNow: '是否立即维护？',
    isHave: '是否于',
    toMaintain: '进行维护',
    toOpen: '进行开放',
    pleaseSelectExecuteTime: '请选择排程时间',
    executeTimeRuleTip: '选择的时间不能早于当前时间',
    pachinkoTip: '*视讯柏青仅支持大厅入口维护，其余游戏皆隐藏按钮',
    pleaseSelectGame: '请选择游戏',
    operationType: '操作类型',
    scheduleSwitchTime: '排程开关时间',
    exportOperationLog: '导出操作记录',
    operator: '操作人员',
    slot: '转轮',
    video: '视讯',
    chess: '棋牌',
    electronic: '电子',
    pachinko: '柏青斯洛',
    fish: '鱼机'
  },
  maintain: {
    tester: '例外清单',
    udid: '识别码',
    createdAt: '创建时间',
    comment: '备注',
    operation: '操作',
    searchUserUdid: '从会员编号查找识别码'
  },
  storeMaintain: {
    storeName: '店家名称',
    mode: '维护方式',
    modeManual: '手动重启',
    modeAuto: '自动重启',
    countDown: '维护倒计时',
    updatedBy: '异动人员',
    cycleTip: '维护时间每{day}天'
  },
  sync: {
    store: '店家',
    date: '日期',
    syncBtn: '同步',
    syncSuccess: '同步中，请15分钟后进行对账'
  },
  testTool: {
    kick: '踢人',
    machineId: '机台ID',
    gameId: '游戏ID',
    userId: '会员编号',
    kickConfirm: '确认踢出该玩家吗？',
    kickPlayer: '踢出玩家',
    clearSeat: '清空座位',
    clearSeatConfirm: '确认清空该座位锁定时长吗？',
    clearSeatTip: '踢出游戏占位的玩家，清空平台保留座位',
    userIdRequired: '会员编号不得为空'
  }
};

const system_tw: App.I18n.Schema['page']['system'] = {
  setting: {
    boUserID: 'BO用戶ID',
    category: '配置類別',
    name: '配置名稱',
    value: '配置內容',
    comment: '備註',
    shared: '是否共享客户端',
    modificationTime: '修改時間',
    detail: '配置詳情',
    systemConfig: {
      tips: '如果內容是對象，請確保是合法的 JSON 格式'
    }
  },
  gameMaintain: {
    gameSwitch: '遊戲開關',
    setting: '當前設定',
    record: '操作記錄',
    setExecuteTime: '指定排程',
    executeTime: '排程時間',
    search: '搜尋',
    operationTime: '操作時間',
    scheduleSetting: '排程設定',
    settingItems: '設定項目',
    adminName: '異動人員',
    operation: '操作',
    open: '開放',
    maintain: '維護',
    stop: '設定開放',
    start: '設定維護',
    isDelete: '是否取消排程？',
    cancel: '取消排程',
    refresh: '刷新',
    isOpenNow: '是否立即開放？',
    isMaintainNow: '是否立即維護？',
    isHave: '是否於',
    toMaintain: '進行維護',
    toOpen: '進行開放',
    pleaseSelectExecuteTime: '請選擇排程時間',
    executeTimeRuleTip: '選擇的時間不能早於當前時間',
    pachinkoTip: '*視訊柏青僅支持大廳入口維護，其餘遊戲皆隱藏按紐',
    pleaseSelectGame: '請選擇遊戲',
    operationType: '操作類型',
    scheduleSwitchTime: '排程開關時間',
    exportOperationLog: '導出操作記錄',
    operator: '操作人員',
    slot: '轉輪',
    video: '視訊',
    chess: '棋牌',
    electronic: '電子',
    pachinko: '柏青斯洛',
    fish: '魚機'
  },
  maintain: {
    tester: '例外清單',
    udid: '識別碼',
    createdAt: '創建時間',
    comment: '備註',
    operation: '操作',
    searchUserUdid: '從會員編號查找識別碼'
  },
  storeMaintain: {
    storeName: '店家名稱',
    mode: '維護方式',
    modeManual: '手動重啟',
    modeAuto: '自動重啟',
    countDown: '維護倒計時',
    updatedBy: '異動人員',
    cycleTip: '維護時間每{day}天'
  },
  sync: {
    store: '店家',
    date: '日期',
    syncBtn: '同步',
    syncSuccess: '同步中，請15分鐘後進行對賬'
  },
  testTool: {
    kick: '踢人',
    machineId: '機台ID',
    gameId: '遊戲ID',
    userId: '會員編號',
    kickConfirm: '確認踢出該玩家嗎？',
    kickPlayer: '踢出玩家',
    clearSeat: '清空座位',
    clearSeatConfirm: '確認清空該座位鎖定時長嗎？',
    clearSeatTip: '踢出遊戲佔位的玩家，清空平台保留座位',
    userIdRequired: '會員編號不得為空'
  }
};
const system_us: App.I18n.Schema['page']['system'] = {
  setting: {
    boUserID: 'BO User ID',
    category: 'Category',
    name: 'Name',
    value: 'Value',
    comment: 'Comment',
    shared: 'Shared Client',
    modificationTime: 'Modification Time',
    detail: 'Detail',
    systemConfig: {
      tips: 'If the content is an object, please ensure it is in valid JSON format'
    }
  },
  gameMaintain: {
    gameSwitch: 'Game Switch',
    setting: 'Setting',
    record: 'Record',
    setExecuteTime: 'Set Execute Time',
    executeTime: 'Execute Time',
    search: 'Search',
    operationTime: 'Operation Time',
    scheduleSetting: 'Schedule Setting',
    settingItems: 'Setting Items',
    adminName: 'Admin Name',
    operation: 'Operation',
    open: 'Open',
    maintain: 'Maintain',
    stop: 'Set Open',
    start: 'Set Maintain',
    isDelete: 'Is Cancel Schedule?',
    cancel: 'Cancel Schedule',
    refresh: 'Refresh',
    isOpenNow: 'Is Open Now?',
    isMaintainNow: 'Is Maintain Now?',
    isHave: 'Will It ',
    toMaintain: 'Maintain At',
    toOpen: 'Open At',
    pleaseSelectExecuteTime: 'Please Select Execute Time',
    executeTimeRuleTip: 'The selected time cannot be earlier than the current time',
    pachinkoTip: '*Video Pachinko only supports the maintenance of the lobby, other games hide the buttons',
    pleaseSelectGame: 'Please Select Game',
    operationType: 'Operation Type',
    scheduleSwitchTime: 'Schedule Switch Time',
    exportOperationLog: 'Export Operation Log',
    operator: 'Operator',
    slot: 'Slot',
    video: 'Video',
    chess: 'Chess',
    electronic: 'Electronic',
    pachinko: 'Pachinko',
    fish: 'Fish'
  },
  maintain: {
    tester: 'Exception List',
    udid: 'Udid',
    createdAt: 'Created At',
    comment: 'Comment',
    operation: 'Operation',
    searchUserUdid: 'Search User UDID'
  },
  storeMaintain: {
    storeName: 'Store Name',
    mode: 'Maintain Mode',
    modeManual: 'Manual Restart',
    modeAuto: 'Auto Restart',
    countDown: 'Maintain Countdown',
    updatedBy: 'Updated By',
    cycleTip: 'Maintain every {day} days'
  },
  sync: {
    store: 'Store',
    date: 'Date',
    syncBtn: 'Sync',
    syncSuccess: 'Syncing in progress. Please reconcile after 15 minutes.'
  },
  testTool: {
    kick: 'Kick',
    machineId: 'Machine ID',
    gameId: 'Game ID',
    userId: 'User ID',
    kickConfirm: 'Are you sure you want to kick this user?',
    kickPlayer: 'Kick Player',
    clearSeat: 'Clear Seat',
    clearSeatConfirm: 'Clear the lock duration of this seat?',
    clearSeatTip: 'Kick players occupying game seats and clear platform reserved seats',
    userIdRequired: 'User ID is required'
  }
};

export { system_cn, system_tw, system_us };
