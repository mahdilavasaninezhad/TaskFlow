export type Locale = 'en' | 'fa';
export type Theme = 'light' | 'dark';
export type View = 'board' | 'list' | 'insights';
export type Status = 'backlog' | 'progress' | 'review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Category = 'design' | 'development' | 'research' | 'marketing' | 'qa';
export type ProjectId = 'aurora' | 'atlas' | 'orbit';

export interface Task {
  id: string;
  projectId: ProjectId;
  title: string;
  titleFa?: string;
  description: string;
  descriptionFa?: string;
  status: Status;
  priority: Priority;
  category: Category;
  assignee: string;
  dueDate: string;
  createdAt: number;
  updatedAt: number;
  points: number;
}

export interface Activity {
  id: string;
  at: number;
  type: 'created' | 'updated' | 'moved' | 'deleted';
  taskTitle: string;
  taskTitleFa?: string;
  projectId: ProjectId;
}

export type TaskForm = Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'category' | 'assignee' | 'dueDate' | 'points'>;
