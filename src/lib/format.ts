import { addDays, members } from '../data/seed';
import type { Locale, Task } from '../types';

export function formatDate(date: string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  if (!date) return '—';
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', options || { day: 'numeric', month: 'short' }).format(d);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value);
}

export function isOverdue(task: Task) {
  return task.status !== 'done' && task.dueDate < addDays(0);
}

export function daysUntil(date: string) {
  const now = new Date();
  const target = new Date(`${date}T12:00:00`);
  now.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function taskName(task: Task, locale: Locale) {
  return locale === 'fa' ? task.titleFa || task.title : task.title;
}

export function taskDescription(task: Task, locale: Locale) {
  return locale === 'fa' ? task.descriptionFa || task.description : task.description;
}

export function initials(name: string) {
  return name.split(' ').map((v) => v[0]).join('').slice(0, 2).toUpperCase();
}

export function person(id: string) {
  return members.find((member) => member.id === id) || members[0];
}
