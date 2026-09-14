import dayjs from 'dayjs';
/**
 * 時間戳減去當前時間，返回時分秒
 *
 * @param timestamp 傳入的時間戳
 * @returns 如果超過當前時間返回空, 未超過返回時分秒, 格式化為 HH:MM:SS, 如果超过24小时,则返回DD天HH:MM:SS,以24小时为一天累加天数
 */
export function getTimeDifference(timestamp: number) {
  // 获取当前时间
  const now = dayjs();
  const targetTime = dayjs(timestamp);

  // 计算时间差（毫秒）
  const diff = targetTime.diff(now);

  // 如果时间戳已经过期，返回空字符串
  if (diff <= 0) {
    return '';
  }

  // 计算天、小时、分钟、秒
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 格式化为两位数
  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  // 如果超过24小时，返回 DD天HH:MM:SS 格式
  if (days > 0) {
    return `${days}天${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
  }

  // 否则返回 HH:MM:SS 格式
  return `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
}

// 时间格式化 转成东8区时间
export const formatTime = (time: string | number | null | undefined) => {
  if (time === null || time === undefined || time === '') return '';

  // 约定：后端时间按 UTC 返回 -> 转成上海时间展示
  return dayjs.utc(time).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 获取当前时间的“微秒级时间戳”字符串（Unix epoch microseconds）。
 * - 格式为1770084980572.9001
 * - **优先**使用 `performance.timeOrigin + performance.now()` 获取带小数的 epoch 毫秒，再转微秒
 * - 环境不支持时降级为 `Date.now() * 1000`（无补 0 格式化）
 */
export function getCurrentMicrosecondTimestampString() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const perf: any = typeof performance !== 'undefined' ? performance : undefined;

  if (perf && typeof perf.now === 'function') {
    const timeOrigin = typeof perf.timeOrigin === 'number' ? perf.timeOrigin : undefined;
    if (typeof timeOrigin === 'number') {
      // epoch 微秒（安全整数范围内：~1.7e15）
      const us = timeOrigin + perf.now();
      return String(us);
    }

    // fallback：用 Date.now() 的毫秒部分做 epoch，再叠加 performance.now() 提供的“微秒内偏移”
    const baseUs = Date.now();
    const offsetUs = Math.floor(perf.now() % 1000);
    return String(`${baseUs}.${offsetUs}`);
  }

  return String(Math.floor(Date.now() * 1000));
}
