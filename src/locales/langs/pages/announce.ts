/** Locale source encoding: UTF-8 */
const announce_cn: App.I18n.Schema['page']['announce'] = {
  marquee: {
    title: '标题',
    content: '内容',
    startTime: '开始时间',
    endTime: '结束时间',
    displayTime: '展示时间',
    status: '状态',
    creator: '创建人',
    dialogAddTitle: '新增跑马灯',
    dialogEditTitle: '编辑跑马灯',
    deleteConfirm: '确定要删除该跑马灯吗？',
    statusPending: '待开始',
    statusRunning: '进行中',
    statusFinished: '已结束'
  },
  standby: {
    title: '待机页配置',
    storeName: '店家名称',
    enabled: '待机页开启状态',
    carousel: '是否随机播放'
  }
};

const announce_tw: App.I18n.Schema['page']['announce'] = {
  marquee: {
    title: '標題',
    content: '內容',
    startTime: '開始時間',
    endTime: '結束時間',
    displayTime: '展示時間',
    status: '狀態',
    creator: '建立人',
    dialogAddTitle: '新增跑馬燈',
    dialogEditTitle: '編輯跑馬燈',
    deleteConfirm: '確定要刪除該跑馬燈嗎？',
    statusPending: '待開始',
    statusRunning: '進行中',
    statusFinished: '已結束'
  },
  standby: {
    title: '待機頁配置',
    storeName: '店家名稱',
    enabled: '待機頁開啓狀態',
    carousel: '是否隨機播放'
  }
};

const announce_us: App.I18n.Schema['page']['announce'] = {
  marquee: {
    title: 'Title',
    content: 'Content',
    startTime: 'Start Time',
    endTime: 'End Time',
    displayTime: 'Display Period',
    status: 'Status',
    creator: 'Creator',
    dialogAddTitle: 'Add Marquee',
    dialogEditTitle: 'Edit Marquee',
    deleteConfirm: 'Are you sure you want to delete this marquee?',
    statusPending: 'Pending',
    statusRunning: 'Running',
    statusFinished: 'Finished'
  },
  standby: {
    title: 'Standby Page Config',
    storeName: 'Store Name',
    enabled: 'Standby Page Enable Status',
    carousel: 'Is Random Play'
  }
};

export { announce_cn, announce_tw, announce_us };
