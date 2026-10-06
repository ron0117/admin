import { localStg } from '@/utils/storage';

const getNestBaseURL = () => {
  const target = import.meta.env.VITE_NEST_BASE_URL || 'http://localhost:3000';
  const useProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
  return useProxy ? '/proxy-nest' : target;
};

export async function getNestBaseURLForExport(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<void> {
  const base = getNestBaseURL();
  const token = localStg.get('token');
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      qs.set(key, String(value));
    }
  }
  const url = `${base}${path}${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    throw new Error('导出失败');
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = 'recharge-cards.txt';
  a.click();
  URL.revokeObjectURL(objectUrl);
}
