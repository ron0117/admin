import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';

/**
 * 支持的文件格式
 */
export enum FileFormat {
  XLX = 'xlsx',
  XLS = 'xls',
  CSV = 'csv',
  TXT = 'txt',
  JSON = 'json'
}

/**
 * 文件导入配置
 */
export interface ImportOptions {
  /** 文件格式 */
  format?: FileFormat;
  /** 是否包含表头 */
  hasHeader?: boolean;
  /** CSV/TXT 分隔符 */
  delimiter?: string;
  /** 编码格式 */
  encoding?: string;
  /** 工作表名称（仅用于 Excel） */
  sheetName?: string;
  /** 成功回调 */
  onSuccess?: (data: any[], file: File) => void;
  /** 失败回调 */
  onError?: (error: Error) => void;
}

/**
 * 文件导出配置
 */
export interface ExportOptions {
  /** 文件名（不含扩展名） */
  filename: string;
  /** 文件格式 */
  format?: FileFormat;
  /** 数据 */
  data: any[];
  /** 表头 */
  headers?: string[];
  /** 工作表名称（仅用于 Excel） */
  sheetName?: string;
  /** CSV/TXT 分隔符 */
  delimiter?: string;
  /** 是否使用JSON格式（用于TXT文件） */
  useJsonFormat?: boolean;
  /** JSON格式化缩进空格数 */
  jsonIndent?: number;
}

/**
 * 获取文件扩展名
 */
function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex >= 0 ? filename.slice(dotIndex + 1).toLowerCase() : '';
}

/**
 * 尝试将字符串解析为原始值
 * 如果字符串是JSON格式的对象或数组，则解析它；否则返回原始字符串
 */
function parseValueFromImport(value: string): any {
  // 空值直接返回
  if (!value || value === '') {
    return value;
  }

  // 尝试解析为JSON（对象或数组）
  if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
    try {
      return JSON.parse(value);
    } catch {
      // 解析失败，返回原始字符串
      return value;
    }
  }

  // 返回原始字符串
  return value;
}

/**
 * 解析 Excel 文件（.xlsx, .xls）
 */
function parseExcel(file: File, options: ImportOptions): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // 获取工作表
        const sheetName = options.sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          reject(new Error(`工作表 "${sheetName}" 不存在`));
          return;
        }

        // 转换为 JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: options.hasHeader ? undefined : 1,
          defval: ''
        });

        // 尝试将字符串值解析回对象
        const parsedData = jsonData.map((row: any) => {
          const parsedRow: any = {};
          Object.keys(row).forEach(key => {
            const value = row[key];
            // 如果是字符串，尝试解析为JSON
            if (typeof value === 'string') {
              parsedRow[key] = parseValueFromImport(value);
            } else {
              parsedRow[key] = value;
            }
          });
          return parsedRow;
        });

        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 分隔符文件解析配置
 */
interface DelimitedParseConfig {
  file: File;
  options: ImportOptions;
  defaultDelimiter: string;
  tryJsonParse?: boolean;
}

/**
 * 尝试解析为 JSON 数组
 */
function tryParseJsonArray(text: string): any[] | null {
  try {
    const trimmedText = text.trim();
    if (trimmedText.startsWith('[') && trimmedText.endsWith(']')) {
      const jsonData = JSON.parse(trimmedText);
      if (Array.isArray(jsonData)) {
        return jsonData;
      }
    }
  } catch {
    // 解析失败，返回 null
  }
  return null;
}

/**
 * 解析分隔符格式的文本数据
 */
function parseDelimitedText(text: string, delimiter: string, hasHeader: boolean): any[] {
  const lines = text.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return [];
  }

  const headers: string[] = [];
  let dataStartIndex = 0;

  if (hasHeader) {
    const headerLine = lines[0].split(delimiter).map(h => h.trim());
    headers.push(...headerLine);
    dataStartIndex = 1;
  }

  return lines.slice(dataStartIndex).map(line => {
    const values = line.split(delimiter).map(v => v.trim());
    const row: any = {};

    values.forEach((value, i) => {
      const key = hasHeader ? headers[i] : `col_${i}`;
      row[key] = parseValueFromImport(value);
    });

    return row;
  });
}

/**
 * 通用的分隔符文件解析函数
 * 用于解析 CSV 和 TXT 文件
 */
function parseDelimitedFile(config: DelimitedParseConfig): Promise<any[]> {
  const { file, options, defaultDelimiter, tryJsonParse = false } = config;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const text = e.target?.result as string;

        // 如果允许，首先尝试作为JSON数组解析
        if (tryJsonParse) {
          const jsonResult = tryParseJsonArray(text);
          if (jsonResult) {
            resolve(jsonResult);
            return;
          }
        }

        // 作为分隔符格式处理
        const delimiter = options.delimiter || defaultDelimiter;
        const result = parseDelimitedText(text, delimiter, options.hasHeader || true);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, options.encoding || 'UTF-8');
  });
}

/**
 * 解析 CSV 文件
 */
function parseCSV(file: File, options: ImportOptions): Promise<any[]> {
  return parseDelimitedFile({ file, options, defaultDelimiter: ',', tryJsonParse: false });
}

/**
 * 解析 TXT 文件
 */
function parseTXT(file: File, options: ImportOptions): Promise<any[]> {
  return parseDelimitedFile({ file, options, defaultDelimiter: '\t', tryJsonParse: true });
}

/**
 * 解析 JSON 文件
 */
function parseJSON(file: File, options: ImportOptions): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        // 确保返回的是数组
        if (Array.isArray(data)) {
          resolve(data);
        } else if (typeof data === 'object' && data !== null) {
          // 如果是单个对象，转换为数组
          resolve([data]);
        } else {
          reject(new Error('JSON 文件格式不正确，应为数组或对象'));
        }
      } catch (error) {
        reject(new Error(`JSON 解析失败: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, options.encoding || 'UTF-8');
  });
}

/**
 * 文件导入通用方法
 * @param file 文件对象
 * @param options 导入配置
 * @returns Promise<any[]> 解析后的数据
 */
export async function importFile(file: File, options: ImportOptions = {}): Promise<any[]> {
  const ext = getFileExtension(file.name);
  const format = options.format || (ext as FileFormat);

  // 默认配置
  const defaultOptions: ImportOptions = {
    hasHeader: true,
    delimiter: ',',
    encoding: 'UTF-8',
    ...options
  };

  try {
    let data: any[] = [];

    switch (format) {
      case FileFormat.XLX:
      case FileFormat.XLS:
        data = await parseExcel(file, defaultOptions);
        break;

      case FileFormat.CSV:
        data = await parseCSV(file, defaultOptions);
        break;

      case FileFormat.TXT:
        data = await parseTXT(file, defaultOptions);
        break;

      case FileFormat.JSON:
        data = await parseJSON(file, defaultOptions);
        break;

      default:
        throw new Error(`不支持的文件格式: ${format}`);
    }

    // 成功回调
    if (options.onSuccess) {
      options.onSuccess(data, file);
    }

    return data;
  } catch (error) {
    // 失败回调
    if (options.onError) {
      options.onError(error as Error);
    }
    throw error;
  }
}

/**
 * 文件导出通用方法
 * @param options 导出配置
 */
export function exportFile(options: ExportOptions): void {
  const {
    filename,
    format = FileFormat.XLX,
    data,
    headers,
    sheetName = 'Sheet1',
    delimiter = ',',
    useJsonFormat = false,
    jsonIndent = 2
  } = options;

  try {
    if (!data || data.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }

    switch (format) {
      case FileFormat.XLX:
      case FileFormat.XLS:
        exportExcel({ data, filename, format, sheetName, headers });
        break;

      case FileFormat.CSV:
        exportCSV({ data, filename, delimiter, headers });
        break;

      case FileFormat.TXT:
        if (useJsonFormat) {
          exportJSON({ data, filename, extension: 'txt', indent: jsonIndent });
        } else {
          exportTXT({ data, filename, delimiter, headers });
        }
        break;

      case FileFormat.JSON:
        exportJSON({ data, filename, extension: 'json', indent: jsonIndent });
        break;

      default:
        throw new Error(`不支持的文件格式: ${format}`);
    }
  } catch (error) {
    ElMessage.error(`导出失败: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Excel 导出配置
 */
interface ExcelExportConfig {
  data: any[];
  filename: string;
  format: FileFormat;
  sheetName: string;
  headers?: string[];
}

/**
 * 导出为 Excel 文件
 */
function exportExcel(config: ExcelExportConfig): void {
  const { data, filename, format, sheetName, headers } = config;

  // 格式化数据，确保对象类型的字段能正确显示
  const formattedData = data.map(row => {
    const formattedRow: any = {};
    Object.keys(row).forEach(key => {
      formattedRow[key] = formatValueForExport(row[key]);
    });
    return formattedRow;
  });

  // 如果提供了自定义表头，则重新构建数据
  let exportData = formattedData;
  if (headers && headers.length > 0) {
    exportData = [
      headers.reduce((acc, header) => {
        acc[header] = header;
        return acc;
      }, {} as any),
      ...formattedData
    ];
  }

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    skipHeader: Boolean(headers)
  });

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 导出文件
  XLSX.writeFile(workbook, `${filename}.${format}`, {
    bookType: format === FileFormat.XLX ? 'xlsx' : 'xls'
  });
}

/**
 * 分隔符文件导出配置
 */
interface DelimitedExportConfig {
  data: any[];
  filename: string;
  delimiter: string;
  headers?: string[];
  fileExtension: string;
  mimeType: string;
  addBOM?: boolean;
  escapeDelimiter?: boolean;
}

/**
 * 格式化值以便导出
 * 将对象、数组等复杂类型转换为字符串
 */
function formatValueForExport(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  // 如果是对象或数组，转换为JSON字符串
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

/**
 * 通用的分隔符文件导出函数
 * 用于导出 CSV 和 TXT 文件
 */
function exportDelimitedFile(config: DelimitedExportConfig): void {
  const {
    data,
    filename,
    delimiter,
    headers,
    fileExtension,
    mimeType,
    addBOM = false,
    escapeDelimiter = false
  } = config;
  const keys = headers || Object.keys(data[0]);
  const content: string[] = [];

  // 添加表头
  content.push(keys.join(delimiter));

  // 添加数据行
  data.forEach(row => {
    const values = keys.map(key => {
      let value = formatValueForExport(row[key]);
      // 如果需要转义分隔符（主要用于CSV）
      if (escapeDelimiter && typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    content.push(values.join(delimiter));
  });

  // 创建 Blob 并下载
  const contentString = addBOM ? `\uFEFF${content.join('\n')}` : content.join('\n');
  const blob = new Blob([contentString], { type: `${mimeType};charset=utf-8;` });
  downloadBlob(blob, `${filename}.${fileExtension}`);
}

/**
 * 导出为 CSV 文件
 */
function exportCSV(config: { data: any[]; filename: string; delimiter: string; headers?: string[] }): void {
  exportDelimitedFile({
    ...config,
    fileExtension: 'csv',
    mimeType: 'text/csv',
    addBOM: true,
    escapeDelimiter: true
  });
}

/**
 * 导出为 TXT 文件
 */
function exportTXT(config: { data: any[]; filename: string; delimiter: string; headers?: string[] }): void {
  exportDelimitedFile({
    ...config,
    fileExtension: 'txt',
    mimeType: 'text/plain',
    addBOM: false,
    escapeDelimiter: false
  });
}

/**
 * JSON 导出配置
 */
interface JsonExportConfig {
  data: any[];
  filename: string;
  extension: string;
  indent?: number;
}

/**
 * 导出为 JSON 文件
 */
function exportJSON(config: JsonExportConfig): void {
  const { data, filename, extension, indent = 2 } = config;

  // 将数据转换为格式化的JSON字符串
  const jsonString = JSON.stringify(data, null, indent);

  // 创建 Blob 并下载
  const blob = new Blob([jsonString], {
    type: 'application/json;charset=utf-8;'
  });
  downloadBlob(blob, `${filename}.${extension}`);
}

/**
 * 下载 Blob
 * @param blob Blob 对象
 * @param filename 文件名
 */
function downloadBlob(blob: Blob, filename: string): void {
  console.log('downloadBlob', blob, filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 下载服务器导出的 Excel 文件(支持 xlsx 和 csv)
 * @param blob 服务器返回的 Blob 对象
 * @param filename 文件名(包含扩展名)
 *
 * @description
 * 该方法专门用于处理服务器端导出的 Excel 文件:
 * - 对于 CSV 文件,会自动添加 BOM 头(\uFEFF)以确保正确显示中文
 * - 对于 XLSX 文件,直接下载
 */
export function downloadExcelFile(blob: Blob, filename: string): void {
  // 如果是 CSV 文件，添加 BOM 头
  const targetBlob = filename.endsWith('.csv') ? new Blob(['\uFEFF', blob], { type: 'text/csv;charset=utf-8' }) : blob;

  downloadBlob(targetBlob, filename);
}

/**
 * 创建文件选择器
 * @param accept 接受的文件类型
 * @param multiple 是否多选
 * @returns Promise<FileList>
 */
export function selectFile(accept?: string, multiple = false): Promise<FileList> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || '.xlsx,.xls,.csv,.txt,.json';
    input.multiple = multiple;
    input.style.display = 'none';

    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        resolve(input.files);
      } else {
        reject(new Error('未选择文件'));
      }
      document.body.removeChild(input);
    };

    input.oncancel = () => {
      reject(new Error('取消选择文件'));
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  });
}
