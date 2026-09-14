/** Locale source encoding: UTF-8 */
const error_message_cn: App.I18n.Schema['errorMessage'] = {
  '605': '字段重复',
  '1100': '出点金额不能超过当前台账金额',
  '1107': '开分超过爆机上限',
  '2001': '不雅字缓存存储不存在',
  '2002': '存储失败，用户ID不存在',
  '2003': '用户权限已经存在',
  '2004': '记录已存在',
  '2005': '任务正在运行',
  '2006': '重复的游戏ID',
  '2021': '机台号同店家不可重复',
  '4301': '会员编号不存在',
  '6501': '角色名称已存在',
  '6502': '角色已启用',
  '6503': '角色已禁用',
  '6504': '部门名称已存在',
  '6505': 'LSID 必须是12位数字',
  '6506': 'LSID 已存在'
};

const error_message_tw: App.I18n.Schema['errorMessage'] = {
  '605': '字段重複',
  '1100': '出點金額不能超過當前台賬金額',
  '1107': '開分超過爆機上限',
  '2001': '不雅字快取儲存不存在',
  '2002': '儲存失敗，使用者ID不存在',
  '2003': '使用者權限已存在',
  '2004': '紀錄已存在',
  '2005': '任務正在執行',
  '2006': '重複的遊戲ID',
  '2021': '機台號同店家不可重複',
  '4301': '會員編號不存在',
  '6501': '角色名稱已存在',
  '6502': '角色已啓用',
  '6503': '角色已禁用',
  '6504': '部門名稱已存在',
  '6505': 'LSID 必須為12位數字',
  '6506': 'LSID 已存在'
};

const error_message_us: App.I18n.Schema['errorMessage'] = {
  '605': 'Field already exists',
  '1100': 'Outpoint amount cannot exceed current balance',
  '1107': 'Over burst limit',
  '2001': 'Dirty word cache storage not found',
  '2002': 'Save failed: user ID not found',
  '2003': 'User permission already exists',
  '2004': 'Record already exists',
  '2005': 'Job is running',
  '2006': 'Duplicate game ID',
  '2021': 'Machine number cannot be duplicated for the same store',
  '4301': 'Member ID not found',
  '6501': 'Role name already exists',
  '6502': 'Role is enabled',
  '6503': 'Role is disabled',
  '6504': 'Department name already exists',
  '6505': 'LSID must be 12 digits',
  '6506': 'LSID already exists'
};

export { error_message_cn, error_message_tw, error_message_us };
