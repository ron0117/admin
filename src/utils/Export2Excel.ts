import * as XLSX from 'xlsx';

function saveBlob(blob: Blob, fileName: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
// 生成表格数据数组
function generateArray(table: HTMLTableElement) {
  const out: any[] = [];
  const rows = table.querySelectorAll('tr');
  const ranges: any[] = [];

  rows.forEach((row, R) => {
    const outRow: any[] = [];
    const columns = row.querySelectorAll('td');

    columns.forEach((cell, _C) => {
      const colspan = cell.getAttribute('colspan');
      const rowspan = cell.getAttribute('rowspan');
      let cellValue: string | number = cell.textContent ?? '';

      // 如果 cellValue 可以被转换为数字，则进行转换
      if (cellValue !== '' && !Number.isNaN(Number(cellValue))) {
        cellValue = Number(cellValue);
      }

      // 跳过已经处理过的区域
      ranges.forEach(range => {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (let i = 0; i <= range.e.c - range.s.c; i += 1) outRow.push(null);
        }
      });

      // 处理行列跨度
      if (rowspan || colspan) {
        const rowSpanNum = rowspan ? Number(rowspan) : 1;
        const colSpanNum = colspan ? Number(colspan) : 1;
        ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowSpanNum - 1, c: outRow.length + colSpanNum - 1 } });
      }

      outRow.push(cellValue !== '' ? cellValue : null);

      // 处理 colSpan
      if (colspan) for (let k = 0; k < Number(colspan) - 1; k += 1) outRow.push(null);
    });

    out.push(outRow);
  });

  return [out, ranges];
}

// 将日期转换为 Excel 日期格式
function datenum(v: string | Date, date1904: boolean): number {
  let dateString: string;
  if (v instanceof Date) {
    dateString = v.toISOString();
  } else {
    dateString = v;
  }
  if (date1904) {
    dateString += '1462';
  }
  const epoch = Date.parse(dateString);

  return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000);
}

// 将二维数组转换为 Excel 工作表格式
function sheet_from_array_of_arrays(data: any[][], _opts: any) {
  const ws: any = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };

  data.forEach((row, R) => {
    row.forEach((cell, C) => {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;

      const cellObj: any = { v: cell };

      if (cellObj.v === null || cellObj.v === undefined) return;

      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      // 设置单元格类型
      if (typeof cellObj.v === 'number') cellObj.t = 'n';
      else if (typeof cellObj.v === 'boolean') cellObj.t = 'b';
      else if (cellObj.v instanceof Date) {
        cellObj.t = 'n';
        cellObj.z = 'm/d/yy'; // 日期格式
        cellObj.v = datenum(cellObj.v, false);
      } else {
        cellObj.t = 's';
      }

      ws[cell_ref] = cellObj;
    });
  });

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}
interface WorkbookType {
  SheetNames: string[];
  Sheets: { [key: string]: any };
}

class Workbook implements WorkbookType {
  SheetNames: string[];
  Sheets: { [key: string]: any };

  constructor() {
    this.SheetNames = [];
    this.Sheets = {};
  }
}

// 将字符串转换为二进制数组
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i);
  return buf;
}

// 导出表格数据为 Excel 文件
export function export_table_to_excel(id: string) {
  const theTable = document.getElementById(id) as HTMLTableElement;

  if (!theTable) {
    console.error('Table element not found');
    return;
  }

  const [data, ranges] = generateArray(theTable);

  const ws_name = 'SheetJS';
  const wb = new Workbook();
  const ws = sheet_from_array_of_arrays(data, {});

  // 添加合并单元格
  ws['!merges'] = ranges;

  // 将工作表添加到工作簿
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

  saveBlob(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx');
}

// 导出 JSON 数据为 Excel 文件
export function export_json_to_excel(
  th: string[],
  jsonData: any[],
  options: string | { defaultTitle?: string; cols?: any[] } = '列表'
) {
  const data = [...jsonData];
  data.unshift(th);
  const defaultTitle = typeof options === 'string' ? options : (options.defaultTitle ?? '列表');
  const cols = typeof options === 'string' ? [] : (options.cols ?? []);

  const ws_name = 'SheetJS';
  const wb = new Workbook();
  const ws = sheet_from_array_of_arrays(data, {});

  // 设置列宽（必须在添加到工作簿之前设置）
  if (cols && cols.length > 0) {
    // 确保列宽数组格式正确
    ws['!cols'] = cols.map((col: any) => {
      // 如果已经是对象格式，直接使用
      if (typeof col === 'object' && col !== null) {
        return {
          wch: col.wch || col.width || 10
        };
      }
      // 如果是数字，直接作为宽度
      return { wch: typeof col === 'number' ? col : 10 };
    });
  }

  // 将工作表添加到工作簿
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

  saveBlob(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${defaultTitle}.xlsx`);
}

export const formatJson = (filterVal: string[], jsonData: Array<Record<string, any>>) => {
  return jsonData.map(v => filterVal.map(j => v[j]));
};
