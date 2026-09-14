/** Locale source encoding: UTF-8 */
const cash_cn: App.I18n.Schema['page']['cash'] = {
  report: {
    orderTime: '订单时间',
    proxy: '代理商',
    storeDisplayId: '店家编号',
    store: '店家',
    allMembers: '所有会员',
    member: '会员',
    machineNumber: '机台号',
    machineNumberRequired: '请选择机台号',
    noStoresUnderProxy: '选择的代理商下没有店家',
    keyIn: 'Key in',
    billIn: 'Bill in',
    backendIn: '后台入点',
    keyOut: 'Key out',
    backendOut: '后台出点',
    cardIn: 'KI',
    cardOut: 'KO',
    burstKo: '爆机KO',
    remark: '备注',
    metaSwallow: '吞分',
    metaReturn: '返还',
    machineRevenue: '机台营收',
    storeRevenue: '店家营收',
    totalRevenue: '总营收',
    balance: '台面余额',
    summary: {
      transferIn: '转入（Key in/KI/Bill in/后台入点）',
      transferOut: '转出（Key out/KO/后台出点/爆机KO）',
      revenue: '营收',
      rowSum: '合计'
    },
    tabs: {
      storeQuery: '店家查询',
      machineQuery: '机台查询',
      ledger: '金流记录',
      summary: '金流记录总表'
    }
  },
  ioConfig: {
    ioConfig: 'I/O配置',
    keyin: 'keyin',
    keyinUnit: 'keyin Unit',
    keyinUnitBig: 'keyin Unit(Big)',
    keyout: 'keyout',
    keyoutUnit: 'keyout Unit',
    brustConfig: '爆机配置',
    brustSetting: '爆机设定',
    upperLimit: '上限值',
    upperLimitRequired: '请输入上限值',
    upperLimitPlaceholder: '请输入万的倍数值'
  }
};

const cash_tw: App.I18n.Schema['page']['cash'] = {
  report: {
    orderTime: '訂單時間',
    proxy: '代理商',
    storeDisplayId: '店家編號',
    store: '店家',
    allMembers: '所有會員',
    member: '會員',
    machineNumber: '機台號',
    machineNumberRequired: '請選擇機台號',
    noStoresUnderProxy: '所選代理商下沒有店家',
    keyIn: 'Key in',
    billIn: 'Bill in',
    backendIn: '後台入點',
    keyOut: 'Key out',
    backendOut: '後台出點',
    cardIn: 'KI',
    cardOut: 'KO',
    burstKo: '爆機KO',
    remark: '備注',
    metaSwallow: '吞分',
    metaReturn: '返還',
    machineRevenue: '機台營收',
    storeRevenue: '店家營收',
    totalRevenue: '總營收',
    balance: '檯面餘額',
    summary: {
      transferIn: '轉入（Key in/KI/Bill in/後台入點）',
      transferOut: '轉出（Key out/KO/後台出點/爆機KO）',
      revenue: '營收',
      rowSum: '合計'
    },
    tabs: {
      storeQuery: '店家查詢',
      machineQuery: '機台查詢',
      ledger: '金流記錄',
      summary: '金流記錄總表'
    }
  },
  ioConfig: {
    ioConfig: 'I/O配置',
    keyin: 'keyin',
    keyinUnit: 'keyin Unit',
    keyinUnitBig: 'keyin Unit(Big)',
    keyout: 'keyout',
    keyoutUnit: 'keyout Unit',
    brustConfig: '爆機配置',
    brustSetting: '爆機設定',
    upperLimit: '上限值',
    upperLimitRequired: '請輸入上限值',
    upperLimitPlaceholder: '請輸入萬的倍數值'
  }
};

const cash_us: App.I18n.Schema['page']['cash'] = {
  report: {
    orderTime: 'Order Time',
    proxy: 'Agent',
    storeDisplayId: 'Store ID',
    store: 'Store',
    allMembers: 'All Members',
    member: 'Member',
    machineNumber: 'Machine number',
    machineNumberRequired: 'Please select a machine number',
    noStoresUnderProxy: 'No stores under the selected agent',
    keyIn: 'Key in',
    billIn: 'Bill in',
    backendIn: 'Backend In',
    keyOut: 'Key out',
    backendOut: 'Backend Out',
    cardIn: 'KI',
    cardOut: 'KO',
    burstKo: 'Burst KO',
    remark: 'Remark',
    metaSwallow: 'Swallow',
    metaReturn: 'Return',
    machineRevenue: 'Machine revenue',
    storeRevenue: 'Store revenue',
    totalRevenue: 'Total revenue',
    balance: 'Table balance',
    summary: {
      transferIn: 'Transfer In (Key in/KI/Bill in/Backend In)',
      transferOut: 'Transfer Out (Key out/KO/Backend Out/Burst Out)',
      revenue: 'Revenue',
      rowSum: 'Total (revenue − balance)'
    },
    tabs: {
      storeQuery: 'Store query',
      machineQuery: 'Machine query',
      ledger: 'Ledger',
      summary: 'Summary'
    }
  },
  ioConfig: {
    ioConfig: 'I/O Config',
    keyin: 'keyin',
    keyinUnit: 'keyin Unit',
    keyinUnitBig: 'keyin Unit (Big)',
    keyout: 'keyout',
    keyoutUnit: 'keyout Unit',
    brustConfig: 'Burst Config',
    brustSetting: 'Burst Setting',
    upperLimit: 'Upper Limit',
    upperLimitRequired: 'Please enter upper limit',
    upperLimitPlaceholder: 'Enter a multiple of 10,000'
  }
};

export { cash_cn, cash_tw, cash_us };
