import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTasks } from '../data/seed';
import type { Activity, Locale, ProjectId, Task, Theme } from '../types';

type WorkspaceState = {
  tasks: Task[];
  activity: Activity[];
  locale: Locale;
  theme: Theme;
  projectId: ProjectId;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  setProjectId: (projectId: ProjectId) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, change: Partial<Task>) => void;
  removeTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  reset: () => void;
};

function event(type: Activity['type'], task: Task): Activity {
  return { id: crypto.randomUUID(), at: Date.now(), type, taskTitle: task.title, taskTitleFa: task.titleFa, projectId: task.projectId };
}

export const useWorkspace = create<WorkspaceState>()(persist((set) => ({
  tasks: initialTasks(),
  activity: [],
  locale: 'en',
  theme: 'light',
  projectId: 'aurora',
  setLocale: (locale) => set({ locale }),
  setTheme: (theme) => set({ theme }),
  setProjectId: (projectId) => set({ projectId }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks], activity: [event('created', task), ...s.activity].slice(0, 40) })),
  updateTask: (id, change) => set((s) => {
    const original = s.tasks.find((task) => task.id === id);
    if (!original) return s;
    const updated = { ...original, ...change, updatedAt: Date.now() };
    return { tasks: s.tasks.map((task) => task.id === id ? updated : task), activity: [event(change.status && change.status !== original.status ? 'moved' : 'updated', updated), ...s.activity].slice(0, 40) };
  }),
  removeTask: (id) => set((s) => {
    const task = s.tasks.find((item) => item.id === id);
    return { tasks: s.tasks.filter((item) => item.id !== id), activity: task ? [event('deleted', task), ...s.activity].slice(0, 40) : s.activity };
  }),
  duplicateTask: (id) => set((s) => {
    const original = s.tasks.find((item) => item.id === id);
    if (!original) return s;
    const copy = { ...original, id: `TF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, title: `${original.title} (copy)`, titleFa: original.titleFa ? `${original.titleFa} (کپی)` : undefined, status: 'backlog' as const, createdAt: Date.now(), updatedAt: Date.now() };
    return { tasks: [copy, ...s.tasks], activity: [event('created', copy), ...s.activity].slice(0, 40) };
  }),
  reset: () => set({ tasks: initialTasks(), activity: [] })
}), { name: 'taskflow-workspace' }));
