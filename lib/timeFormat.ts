const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function toBJ(date: Date) {
  const utc = date.getTime() + date.getTimezoneOffset() * MIN;
  return new Date(utc + 8 * HOUR);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function isSameBJDay(a: Date, b: Date) {
  const ba = toBJ(a);
  const bb = toBJ(b);
  return (
    ba.getUTCFullYear() === bb.getUTCFullYear() &&
    ba.getUTCMonth() === bb.getUTCMonth() &&
    ba.getUTCDate() === bb.getUTCDate()
  );
}

export function formatBJTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const bj = toBJ(d);
  const h = bj.getUTCHours();
  const m = bj.getUTCMinutes();
  const period = h < 6 ? "凌晨" : h < 12 ? "上午" : h < 18 ? "下午" : "晚上";
  return `${period} ${pad(h)}:${pad(m)}`;
}

export function formatBJDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const bj = toBJ(d);
  return `${bj.getUTCFullYear()}-${pad(bj.getUTCMonth() + 1)}-${pad(bj.getUTCDate())}`;
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < MIN) return "刚刚";
  if (diff < HOUR) return `${Math.floor(diff / MIN)} 分钟前`;
  if (diff < DAY && isSameBJDay(d, now)) {
    return `${Math.floor(diff / HOUR)} 小时前`;
  }
  const oneDayAgo = new Date(now.getTime() - DAY);
  if (isSameBJDay(d, oneDayAgo)) return "昨天";
  const bj = toBJ(d);
  return `${bj.getUTCMonth() + 1}/${bj.getUTCDate()} ${pad(bj.getUTCHours())}:${pad(bj.getUTCMinutes())}`;
}

export function formatItemTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const rel = formatRelative(iso);
  return rel;
}

export function formatWindow(sinceIso: string | null | undefined): string {
  if (!sinceIso) return "";
  const start = formatBJDate(sinceIso);
  const end = formatBJDate(new Date().toISOString());
  if (!start) return "";
  if (start === end) return `今天（${start}）`;
  return `${start} ~ ${end}`;
}
