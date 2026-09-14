import { request } from '../request';

/**
 * 上传文件
 * @param file - 要上传的文件
 * @returns { data, error } - 成功返回文件URL，失败返回错误对象
 */
export function fetchUploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<Api.Common.CommonRecord>({
    url: '/public/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
