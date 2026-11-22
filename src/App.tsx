import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Copy,
  Filter,
  FolderKanban,
  Gauge,
  GripVertical,
  Languages,
  LayoutGrid,
  ListChecks,
  Moon,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Sun,
  Target,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { addDays, categories, members, priorities, projects, statuses } from './data/seed';
import { daysUntil, formatDate, formatNumber, initials, isOverdue, person, taskDescription, taskName } from './lib/format';
import { useWorkspace } from './store/useWorkspace';
import type { Category, Locale, Priority, ProjectId, Status, Task, TaskForm, View } from './types';

type TextKey =
  | 'appName' | 'appTag' | 'board' | 'list' | 'insights' | 'newTask' | 'search' | 'searchPlaceholder'
  | 'allPriorities' | 'allCategories' | 'allAssignees' | 'priority' | 'category' | 'owner' | 'dueDate' | 'points'
  | 'status' | 'title' | 'description' | 'save' | 'cancel' | 'delete' | 'duplicate' | 'createTask' | 'editTask'
  | 'taskTitleFa' | 'taskDescriptionFa' | 'project' | 'overview' | 'workspaceHealth' | 'throughput' | 'upcoming'
  | 'emptyState' | 'emptyHint' | 'resetFilters' | 'tasks' | 'open' | 'done' | 'overdue' | 'completionRate'
  | 'filters' | 'activity' | 'export' | 'theme' | 'language' | 'light' | 'dark' | 'today' | 'tomorrow' | 'yesterday'
  | 'daysLate' | 'backlog' | 'progress' | 'review' | 'completed' | 'urgent' | 'high' | 'medium' | 'low'
  | 'design' | 'development' | 'research' | 'marketing' | 'qa' | 'requiredTitle' | 'projectPulse' | 'workload'
  | 'priorityMix' | 'kanbanHint' | 'tableHint' | 'insightHint' | 'taskCreated' | 'taskUpdated' | 'taskMoved'
  | 'taskDeleted' | 'latestActivity' | 'noActivity' | 'createdAt' | 'updatedAt' | 'clear' | 'member'
  | 'allProjects' | 'switchProject' | 'projectBoard' | 'productivity' | 'progressLabel' | 'dropToMove' | 'totalPoints'
  | 'taskCount' | 'activeSprint' | 'dueSoon' | 'commandCenter' | 'workspace';

const text: Record<Locale, Record<TextKey, string>> = {
  en: {
    appName: 'TaskFlow',
    appTag: 'Thoughtful work, beautifully organized',
    board: 'Board',
    list: 'List',
    insights: 'Insights',
    newTask: 'New task',
    search: 'Search',
    searchPlaceholder: 'Search by title, ID or description',
    allPriorities: 'All priorities',
    allCategories: 'All categories',
    allAssignees: 'All owners',
    priority: 'Priority',
    category: 'Category',
    owner: 'Owner',
    dueDate: 'Due date',
    points: 'Points',
    status: 'Status',
    title: 'Title',
    description: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    duplicate: 'Duplicate',
    createTask: 'Create task',
    editTask: 'Task details',
    taskTitleFa: 'Persian title',
    taskDescriptionFa: 'Persian description',
    project: 'Project',
    overview: 'Overview',
    workspaceHealth: 'Workspace health',
    throughput: 'Throughput',
    upcoming: 'Upcoming deadlines',
    emptyState: 'No matching tasks found',
    emptyHint: 'Try a different search or clear the active filters.',
    resetFilters: 'Clear filters',
    tasks: 'Tasks',
    open: 'Open',
    done: 'Done',
    overdue: 'Overdue',
    completionRate: 'Completion rate',
    filters: 'Filters',
    activity: 'Activity',
    export: 'Export JSON',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    daysLate: 'days late',
    backlog: 'Backlog',
    progress: 'In progress',
    review: 'In review',
    completed: 'Completed',
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    design: 'Design',
    development: 'Development',
    research: 'Research',
    marketing: 'Marketing',
    qa: 'QA',
    requiredTitle: 'Title is required.',
    projectPulse: 'Project pulse',
    workload: 'Team workload',
    priorityMix: 'Priority mix',
    kanbanHint: 'Drag cards across stages to reflect delivery progress.',
    tableHint: 'Scan every task quickly and update status inline.',
    insightHint: 'Understand delivery speed, workload balance and deadlines.',
    taskCreated: 'created task',
    taskUpdated: 'updated task',
    taskMoved: 'moved task',
    taskDeleted: 'deleted task',
    latestActivity: 'Latest activity',
    noActivity: 'No recent activity yet.',
    createdAt: 'Created',
    updatedAt: 'Updated',
    clear: 'Clear',
    member: 'Member',
    allProjects: 'All projects',
    switchProject: 'Switch project',
    projectBoard: 'Project board',
    productivity: 'Productivity',
    progressLabel: 'Progress',
    dropToMove: 'Drop on a lane to move the task.',
    totalPoints: 'Total points',
    taskCount: 'Task count',
    activeSprint: 'Active sprint',
    dueSoon: 'Due soon',
    commandCenter: 'Command center',
    workspace: 'Workspace'
  },
  fa: {
    appName: 'TaskFlow',
    appTag: 'همه‌چیز، در جای درست خودش',
    board: 'برد',
    list: 'فهرست',
    insights: 'گزارش‌ها',
    newTask: 'وظیفه جدید',
    search: 'جست‌وجو',
    searchPlaceholder: 'جست‌وجو با عنوان، شناسه یا توضیح',
    allPriorities: 'همه اولویت‌ها',
    allCategories: 'همه دسته‌ها',
    allAssignees: 'همه مسئول‌ها',
    priority: 'اولویت',
    category: 'دسته',
    owner: 'مسئول',
    dueDate: 'تاریخ تحویل',
    points: 'امتیاز',
    status: 'وضعیت',
    title: 'عنوان',
    description: 'توضیحات',
    save: 'ذخیره',
    cancel: 'انصراف',
    delete: 'حذف',
    duplicate: 'کپی',
    createTask: 'ایجاد وظیفه',
    editTask: 'جزئیات وظیفه',
    taskTitleFa: 'عنوان فارسی',
    taskDescriptionFa: 'توضیحات فارسی',
    project: 'پروژه',
    overview: 'نمای کلی',
    workspaceHealth: 'سلامت ورک‌اسپیس',
    throughput: 'سرعت تحویل',
    upcoming: 'ددلاین‌های نزدیک',
    emptyState: 'وظیفه‌ای با این شرایط پیدا نشد',
    emptyHint: 'جست‌وجو را تغییر بده یا فیلترها را پاک کن.',
    resetFilters: 'پاک کردن فیلترها',
    tasks: 'وظیفه',
    open: 'باز',
    done: 'انجام‌شده',
    overdue: 'عقب‌افتاده',
    completionRate: 'نرخ تکمیل',
    filters: 'فیلترها',
    activity: 'فعالیت‌ها',
    export: 'خروجی JSON',
    theme: 'تم',
    language: 'زبان',
    light: 'روشن',
    dark: 'تیره',
    today: 'امروز',
    tomorrow: 'فردا',
    yesterday: 'دیروز',
    daysLate: 'روز تأخیر',
    backlog: 'صف انتظار',
    progress: 'در حال انجام',
    review: 'در بررسی',
    completed: 'تکمیل‌شده',
    urgent: 'فوری',
    high: 'زیاد',
    medium: 'متوسط',
    low: 'کم',
    design: 'طراحی',
    development: 'توسعه',
    research: 'تحقیق',
    marketing: 'مارکتینگ',
    qa: 'تست',
    requiredTitle: 'عنوان وظیفه الزامی است.',
    projectPulse: 'نبض پروژه',
    workload: 'حجم کار تیم',
    priorityMix: 'ترکیب اولویت‌ها',
    kanbanHint: 'کارت‌ها را بین مراحل جابه‌جا کن تا روند تحویل مشخص شود.',
    tableHint: 'همه وظایف را سریع بررسی کن و وضعیت را همان‌جا تغییر بده.',
    insightHint: 'تصویری روشن از سرعت تحویل، توازن تیم و ددلاین‌ها ببین.',
    taskCreated: 'وظیفه ایجاد کرد',
    taskUpdated: 'وظیفه را به‌روزرسانی کرد',
    taskMoved: 'وظیفه را جابه‌جا کرد',
    taskDeleted: 'وظیفه را حذف کرد',
    latestActivity: 'آخرین فعالیت‌ها',
    noActivity: 'هنوز فعالیتی ثبت نشده است.',
    createdAt: 'تاریخ ایجاد',
    updatedAt: 'آخرین تغییر',
    clear: 'پاک کردن',
    member: 'عضو',
    allProjects: 'همه پروژه‌ها',
    switchProject: 'تغییر پروژه',
    projectBoard: 'برد پروژه',
    productivity: 'بهره‌وری',
    progressLabel: 'پیشرفت',
    dropToMove: 'کارت را روی ستون رها کن تا منتقل شود.',
    totalPoints: 'مجموع امتیاز',
    taskCount: 'تعداد وظایف',
    activeSprint: 'اسپرینت فعال',
    dueSoon: 'نزدیک به موعد',
    commandCenter: 'مرکز فرمان',
    workspace: 'ورک‌اسپیس'
  }
};

const statusAccent: Record<Status, string> = {
  backlog: 'var(--status-backlog)',
  progress: 'var(--status-progress)',
  review: 'var(--status-review)',
  done: 'var(--status-done)'
};

const priorityWeight: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
};

function useText(locale: Locale) {
  return (key: TextKey) => text[locale][key];
}

function projectName(projectId: ProjectId, locale: Locale) {
  const target = projects.find((item) => item.id === projectId) || projects[0];
  return locale === 'fa' ? target.nameFa : target.name;
}

function projectSubtitle(projectId: ProjectId, locale: Locale) {
  const target = projects.find((item) => item.id === projectId) || projects[0];
  return locale === 'fa' ? target.subtitleFa : target.subtitle;
}

function dueLabel(task: Task, locale: Locale, t: ReturnType<typeof useText>) {
  const days = daysUntil(task.dueDate);
  if (days === 0) return t('today');
  if (days === 1) return t('tomorrow');
  if (days === -1) return t('yesterday');
  if (days < 0) return `${formatNumber(Math.abs(days), locale)} ${t('daysLate')}`;
  return formatDate(task.dueDate, locale, { day: 'numeric', month: 'short' });
}

function laneStyle(status: Status): CSSProperties {
  return { ['--lane-accent' as string]: statusAccent[status] };
}

function ModernAvatar({ id }: { id: string }) {
  const member = person(id);
  return <span className={`modern-avatar avatar-${member.color}`}>{initials(member.name)}</span>;
}

function PriorityPill({ value, t }: { value: Priority; t: ReturnType<typeof useText> }) {
  return <span className={`priority-pill priority-${value}`}>{t(value)}</span>;
}

function MetricCard({ label, value, note, icon }: { label: string; value: string; note: string; icon: ReactNode }) {
  return <article className="metric-card-v2"><div className="metric-heading"><span>{label}</span><span className="metric-icon-v2">{icon}</span></div><strong>{value}</strong><small>{note}</small></article>;
}

function TaskMini({ task, locale, t, onEdit }: { task: Task; locale: Locale; t: ReturnType<typeof useText>; onEdit: (task: Task) => void }) {
  return <button className="deadline-item" onClick={() => onEdit(task)}>
    <div>
      <strong>{taskName(task, locale)}</strong>
      <span>{projectName(task.projectId, locale)}</span>
    </div>
    <span className={`deadline-date ${isOverdue(task) ? 'is-overdue' : ''}`}>{dueLabel(task, locale, t)}</span>
  </button>;
}

function BoardCard({ task, locale, t, onEdit }: { task: Task; locale: Locale; t: ReturnType<typeof useText>; onEdit: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1
  };
  return <article ref={setNodeRef} style={style} className="board-card-modern">
    <div className="board-card-top">
      <span className={`mini-badge mini-${task.category}`}>{t(task.category)}</span>
      <button ref={setActivatorNodeRef} {...attributes} {...listeners} className="drag-button" aria-label={taskName(task, locale)}><GripVertical size={16} /></button>
    </div>
    <button className="task-main" onClick={() => onEdit(task)}>
      <strong>{taskName(task, locale)}</strong>
      <p>{taskDescription(task, locale)}</p>
    </button>
    <div className="board-card-bottom">
      <PriorityPill value={task.priority} t={t} />
      <span className="point-badge">{formatNumber(task.points, locale)} pt</span>
    </div>
    <div className="board-card-footer">
      <span className={`date-badge ${isOverdue(task) ? 'is-overdue' : ''}`}><CalendarDays size={14} />{dueLabel(task, locale, t)}</span>
      <ModernAvatar id={task.assignee} />
    </div>
  </article>;
}

function BoardLane({ status, tasks, locale, t, onEdit, onCreate }: { status: Status; tasks: Task[]; locale: Locale; t: ReturnType<typeof useText>; onEdit: (task: Task) => void; onCreate: (status: Status) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `lane:${status}` });
  return <section ref={setNodeRef} style={laneStyle(status)} className={`board-lane ${isOver ? 'is-over' : ''}`}>
    <header className="lane-header">
      <div>
        <span className="lane-kicker">{t('projectBoard')}</span>
        <div className="lane-title-row"><span className="lane-dot" /><h3>{status === 'done' ? t('completed') : t(status)}</h3><span className="lane-count">{formatNumber(tasks.length, locale)}</span></div>
      </div>
      <button className="lane-add" onClick={() => onCreate(status)} aria-label={t('newTask')}><Plus size={17} /></button>
    </header>
    <div className="lane-body">
      {tasks.length ? tasks.map((task) => <BoardCard key={task.id} task={task} locale={locale} t={t} onEdit={onEdit} />) : <div className="lane-empty"><CircleDashed size={18} /><span>{t('dropToMove')}</span></div>}
    </div>
  </section>;
}

function EmptyBlock({ t, onClear }: { t: ReturnType<typeof useText>; onClear: () => void }) {
  return <div className="empty-block"><div className="empty-orb"><Search size={22} /></div><strong>{t('emptyState')}</strong><p>{t('emptyHint')}</p><button className="ghost-button" onClick={onClear}>{t('resetFilters')}</button></div>;
}

function ProgressBar({ value }: { value: number }) {
  return <span className="progress-track"><span className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></span>;
}

function TaskDialog({
  open,
  task,
  locale,
  t,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
  currentProject,
  initialStatus
}: {
  open: boolean;
  task: Task | null;
  locale: Locale;
  t: ReturnType<typeof useText>;
  onClose: () => void;
  onSave: (task: Task | null, form: TaskForm, faTitle: string, faDescription: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  currentProject: ProjectId;
  initialStatus: Status;
}) {
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    category: 'development',
    assignee: members[0].id,
    dueDate: addDays(3),
    points: 3
  });
  const [titleFa, setTitleFa] = useState('');
  const [descriptionFa, setDescriptionFa] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        assignee: task.assignee,
        dueDate: task.dueDate,
        points: task.points
      });
      setTitleFa(task.titleFa || '');
      setDescriptionFa(task.descriptionFa || '');
    } else {
      setForm({
        title: '',
        description: '',
        status: initialStatus,
        priority: 'medium',
        category: 'development',
        assignee: members[0].id,
        dueDate: addDays(3),
        points: 3
      });
      setTitleFa('');
      setDescriptionFa('');
    }
    setError('');
  }, [task, open, currentProject, initialStatus]);

  if (!open) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError(t('requiredTitle'));
      return;
    }
    onSave(task, { ...form, points: Number(form.points) || 0 }, titleFa, descriptionFa);
  };

  return <div className="dialog-shell" role="dialog" aria-modal="true">
    <div className="dialog-backdrop" onClick={onClose} />
    <form className="dialog-card" onSubmit={submit}>
      <div className="dialog-header">
        <div>
          <span className="panel-kicker">{t('workspace')}</span>
          <h3>{task ? t('editTask') : t('createTask')}</h3>
        </div>
        <button type="button" className="icon-ghost" onClick={onClose} aria-label={t('cancel')}><X size={18} /></button>
      </div>
      <div className="dialog-grid">
        <label><span>{t('title')}</span><input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} /></label>
        <label><span>{t('taskTitleFa')}</span><input value={titleFa} onChange={(e) => setTitleFa(e.target.value)} /></label>
        <label className="field-wide"><span>{t('description')}</span><textarea rows={4} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} /></label>
        <label className="field-wide"><span>{t('taskDescriptionFa')}</span><textarea rows={3} value={descriptionFa} onChange={(e) => setDescriptionFa(e.target.value)} /></label>
        <label><span>{t('status')}</span><select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Status }))}>{statuses.map((value) => <option key={value} value={value}>{value === 'done' ? t('completed') : t(value)}</option>)}</select></label>
        <label><span>{t('priority')}</span><select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as Priority }))}>{priorities.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select></label>
        <label><span>{t('category')}</span><select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as Category }))}>{categories.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select></label>
        <label><span>{t('owner')}</span><select value={form.assignee} onChange={(e) => setForm((s) => ({ ...s, assignee: e.target.value }))}>{members.map((value) => <option key={value.id} value={value.id}>{locale === 'fa' ? `${value.name} · ${value.roleFa}` : `${value.name} · ${value.role}`}</option>)}</select></label>
        <label><span>{t('dueDate')}</span><input type="date" value={form.dueDate} onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))} /></label>
        <label><span>{t('points')}</span><input type="number" min={0} value={form.points} onChange={(e) => setForm((s) => ({ ...s, points: Number(e.target.value) || 0 }))} /></label>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="dialog-actions">
        <div className="inline-actions">
          {task ? <>
            <button type="button" className="ghost-button danger-text" onClick={() => onDelete(task.id)}><Trash2 size={16} />{t('delete')}</button>
            <button type="button" className="ghost-button" onClick={() => onDuplicate(task.id)}><Copy size={16} />{t('duplicate')}</button>
          </> : null}
        </div>
        <div className="inline-actions">
          <button type="button" className="ghost-button" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="primary-button">{t('save')}</button>
        </div>
      </div>
    </form>
  </div>;
}

export default function App() {
  const {
    tasks,
    activity,
    locale,
    theme,
    projectId,
    setLocale,
    setTheme,
    setProjectId,
    addTask,
    updateTask,
    removeTask,
    duplicateTask
  } = useWorkspace();

  const [view, setView] = useState<View>('board');
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<'all' | string>('all');
  const [selected, setSelected] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<Status>('backlog');
  const searchRef = useRef<HTMLInputElement>(null);
  const t = useText(locale);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }));

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.body.dataset.theme = theme;
  }, [locale, theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape' && dialogOpen) {
        setDialogOpen(false);
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dialogOpen]);

  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === projectId), [projectId, tasks]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return projectTasks.filter((task) => {
      const matchesSearch = !value || [task.title, task.titleFa || '', task.description, task.descriptionFa || '', task.id].some((item) => item.toLowerCase().includes(value));
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
      return matchesSearch && matchesPriority && matchesCategory && matchesAssignee;
    }).sort((a, b) => {
      if (a.status !== b.status) return statuses.indexOf(a.status) - statuses.indexOf(b.status);
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) return priorityWeight[b.priority] - priorityWeight[a.priority];
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [assigneeFilter, categoryFilter, priorityFilter, projectTasks, query]);

  const completion = projectTasks.length ? Math.round(projectTasks.filter((task) => task.status === 'done').length * 100 / projectTasks.length) : 0;
  const openCount = projectTasks.filter((task) => task.status !== 'done').length;
  const overdueCount = projectTasks.filter(isOverdue).length;
  const totalPoints = projectTasks.reduce((sum, task) => sum + task.points, 0);
  const dueSoon = [...projectTasks].filter((task) => task.status !== 'done' && daysUntil(task.dueDate) <= 7).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const priorityMix = priorities.map((item) => ({ key: item, count: projectTasks.filter((task) => task.priority === item).length }));
  const workload = members.map((member) => ({ member, count: projectTasks.filter((task) => task.assignee === member.id && task.status !== 'done').length }));
  const activeTask = tasks.find((task) => task.id === draggingId) || null;
  const activityFeed = activity.filter((item) => item.projectId === projectId).slice(0, 7);

  const openNew = (status: Status = 'backlog') => {
    setCreateStatus(status);
    setSelected(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setSelected(task);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setSelected(null);
    setDialogOpen(false);
  };

  const handleSave = (task: Task | null, form: TaskForm, titleFa: string, descriptionFa: string) => {
    if (task) {
      updateTask(task.id, { ...form, titleFa: titleFa || undefined, descriptionFa: descriptionFa || undefined, projectId });
    } else {
      addTask({
        id: `TF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        projectId,
        title: form.title,
        titleFa: titleFa || undefined,
        description: form.description,
        descriptionFa: descriptionFa || undefined,
        status: form.status,
        priority: form.priority,
        category: form.category,
        assignee: form.assignee,
        dueDate: form.dueDate,
        points: form.points,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    closeDialog();
  };

  const handleDelete = (id: string) => {
    removeTask(id);
    closeDialog();
  };

  const handleDuplicate = (id: string) => {
    duplicateTask(id);
    closeDialog();
  };

  const moveTask = (id: string, status: Status) => updateTask(id, { status });

  const clearFilters = () => {
    setQuery('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setAssigneeFilter('all');
  };

  const onDragStart = ({ active }: DragStartEvent) => setDraggingId(String(active.id));
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingId(null);
    const target = String(over?.id || '').replace('lane:', '') as Status;
    if (statuses.includes(target)) moveTask(String(active.id), target);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'taskflow-data.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderBoard = () => {
    if (!filtered.length) return <EmptyBlock t={t} onClear={clearFilters} />;
    return <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDraggingId(null)}>
      <div className="board-shell-modern">
        {statuses.map((status) => <BoardLane key={status} status={status} tasks={filtered.filter((task) => task.status === status)} locale={locale} t={t} onEdit={openEdit} onCreate={openNew} />)}
      </div>
      <DragOverlay dropAnimation={null}>{activeTask ? <div className="drag-preview-modern"><div className="board-card-modern"><span className="mini-badge">{t(activeTask.category)}</span><strong className="preview-title">{taskName(activeTask, locale)}</strong><PriorityPill value={activeTask.priority} t={t} /></div></div> : null}</DragOverlay>
    </DndContext>;
  };

  const renderList = () => {
    if (!filtered.length) return <EmptyBlock t={t} onClear={clearFilters} />;
    return <div className="list-shell">
      {filtered.map((task) => <article key={task.id} className="list-card">
        <div className="list-card-head">
          <div>
            <div className="task-line-top"><span className="task-code">{task.id}</span><span className="list-project-name">{projectName(task.projectId, locale)}</span></div>
            <button className="list-title" onClick={() => openEdit(task)}><strong>{taskName(task, locale)}</strong><p>{taskDescription(task, locale)}</p></button>
          </div>
          <ModernAvatar id={task.assignee} />
        </div>
        <div className="list-card-tags">
          <span className="inline-tag">{task.status === 'done' ? t('completed') : t(task.status)}</span>
          <PriorityPill value={task.priority} t={t} />
          <span className="inline-tag">{t(task.category)}</span>
        </div>
        <div className="list-card-foot">
          <div className="list-meta"><span><CalendarDays size={14} />{formatDate(task.dueDate, locale)}</span><span><Target size={14} />{formatNumber(task.points, locale)} pt</span></div>
          <div className="inline-actions">
            <select className="status-dropdown" value={task.status} onChange={(e) => moveTask(task.id, e.target.value as Status)}>{statuses.map((value) => <option key={value} value={value}>{value === 'done' ? t('completed') : t(value)}</option>)}</select>
            <button className="icon-ghost" onClick={() => openEdit(task)} aria-label={t('editTask')}><PencilLine size={17} /></button>
          </div>
        </div>
      </article>)}
    </div>;
  };

  const renderInsights = () => <div className="insight-grid">
    <section className="panel-card wide-panel">
      <div className="panel-head"><div><span className="panel-kicker">{t('overview')}</span><h3>{t('projectPulse')}</h3></div><Sparkles size={18} /></div>
      <div className="priority-stack">{statuses.map((status) => {
        const count = projectTasks.filter((task) => task.status === status).length;
        const percent = projectTasks.length ? Math.round(count * 100 / projectTasks.length) : 0;
        return <div key={status} className="stack-row"><div className="stack-label"><span className="stack-dot" style={{ background: statusAccent[status] }} />{status === 'done' ? t('completed') : t(status)}</div><ProgressBar value={percent} /><strong>{formatNumber(count, locale)}</strong></div>;
      })}</div>
    </section>
    <section className="panel-card">
      <div className="panel-head"><div><span className="panel-kicker">{t('productivity')}</span><h3>{t('priorityMix')}</h3></div><Gauge size={18} /></div>
      <div className="priority-mix">{priorityMix.map((item) => <div key={item.key} className="mix-item"><div className="mix-top"><PriorityPill value={item.key} t={t} /><strong>{formatNumber(item.count, locale)}</strong></div><ProgressBar value={projectTasks.length ? Math.round(item.count * 100 / projectTasks.length) : 0} /></div>)}</div>
    </section>
    <section className="panel-card">
      <div className="panel-head"><div><span className="panel-kicker">{t('workspaceHealth')}</span><h3>{t('workload')}</h3></div><UserRound size={18} /></div>
      <div className="workload-list">{workload.map(({ member, count }) => <div key={member.id} className="workload-item"><div className="workload-person"><span className={`modern-avatar avatar-${member.color}`}>{initials(member.name)}</span><div><strong>{member.name}</strong><span>{locale === 'fa' ? member.roleFa : member.role}</span></div></div><strong>{formatNumber(count, locale)}</strong></div>)}</div>
    </section>
    <section className="panel-card wide-panel">
      <div className="panel-head"><div><span className="panel-kicker">{t('activity')}</span><h3>{t('latestActivity')}</h3></div><Activity size={18} /></div>
      <div className="activity-feed">{activityFeed.length ? activityFeed.map((item) => <div key={item.id} className="activity-row"><span className="activity-time">{new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(item.at))}</span><div><strong>{locale === 'fa' ? item.taskTitleFa || item.taskTitle : item.taskTitle}</strong><span>{item.type === 'created' ? t('taskCreated') : item.type === 'updated' ? t('taskUpdated') : item.type === 'moved' ? t('taskMoved') : t('taskDeleted')}</span></div></div>) : <div className="activity-empty">{t('noActivity')}</div>}</div>
    </section>
  </div>;

  return <div className="tf-shell">
    <aside className="side-rail">
      <div className="brand-card">
        <div className="brand-mark"><FolderKanban size={19} strokeWidth={2.2} /></div>
        <div>
          <strong>{t('appName')}</strong>
          <span>{t('appTag')}</span>
        </div>
      </div>
      <section className="rail-section">
        <div className="section-title"><span>{t('switchProject')}</span><ChevronRight size={15} /></div>
        <div className="project-list">{projects.map((item) => <button key={item.id} className={`project-tile ${projectId === item.id ? 'is-active' : ''}`} onClick={() => setProjectId(item.id)}>
          <span className="project-icon" style={{ background: item.color }}>{item.icon}</span>
          <div><strong>{locale === 'fa' ? item.nameFa : item.name}</strong><span>{locale === 'fa' ? item.subtitleFa : item.subtitle}</span></div>
        </button>)}</div>
      </section>
      <section className="rail-section rail-insights">
        <div className="section-title"><span>{t('workspaceHealth')}</span><Activity size={15} /></div>
        <div className="rail-progress-panel">
          <div className="rail-progress-top"><span>{t('completionRate')}</span><strong>{formatNumber(completion, locale)}%</strong></div>
          <ProgressBar value={completion} />
          <p>{formatNumber(projectTasks.filter((task) => task.status === 'done').length, locale)} / {formatNumber(projectTasks.length, locale)} {t('tasks')}</p>
          <div className="rail-progress-foot"><span>{t('open')} <strong>{formatNumber(openCount, locale)}</strong></span><span>{t('overdue')} <strong>{formatNumber(overdueCount, locale)}</strong></span></div>
        </div>
      </section>
      <section className="rail-section">
        <div className="section-title"><span>{t('upcoming')}</span><CalendarDays size={15} /></div>
        <div className="deadline-list">{dueSoon.length ? dueSoon.map((task) => <TaskMini key={task.id} task={task} locale={locale} t={t} onEdit={openEdit} />) : <div className="deadline-empty">{t('noActivity')}</div>}</div>
      </section>
    </aside>

    <main className="main-stage">
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="hero-kicker">{t('activeSprint')}</span>
          <h1>{projectName(projectId, locale)}</h1>
          <p>{projectSubtitle(projectId, locale)}</p>
        </div>
        <div className="hero-actions">
          <button className="soft-icon" onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}><Languages size={17} /><span>{locale === 'en' ? 'FA' : 'EN'}</span></button>
          <button className="soft-icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><span>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</span><span>{theme === 'light' ? t('dark') : t('light')}</span></button>
          <button className="soft-icon" onClick={exportJson}><ArrowDownToLine size={17} /><span>{t('export')}</span></button>
          <button className="primary-button" onClick={() => openNew()}><Plus size={18} />{t('newTask')}</button>
        </div>
      </header>

      <section className="surface-card top-summary">
        <div className="summary-metrics">
          <MetricCard label={t('tasks')} value={formatNumber(projectTasks.length, locale)} note={t('projectPulse')} icon={<BriefcaseBusiness size={18} />} />
          <MetricCard label={t('totalPoints')} value={formatNumber(totalPoints, locale)} note={t('throughput')} icon={<Target size={18} />} />
          <MetricCard label={t('done')} value={formatNumber(projectTasks.filter((task) => task.status === 'done').length, locale)} note={t('completionRate')} icon={<CheckCircle2 size={18} />} />
          <MetricCard label={t('overdue')} value={formatNumber(overdueCount, locale)} note={t('workspaceHealth')} icon={<AlertTriangle size={18} />} />
        </div>
      </section>

      <section className="toolbar-surface">
        <div className="toolbar-row">
          <div className="search-box"><Search size={18} /><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchPlaceholder')} /></div>
          <div className="toolbar-selects">
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}><option value="all">{t('allPriorities')}</option>{priorities.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as 'all' | Category)}><option value="all">{t('allCategories')}</option>{categories.map((value) => <option key={value} value={value}>{t(value)}</option>)}</select>
            <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}><option value="all">{t('allAssignees')}</option>{members.map((value) => <option key={value.id} value={value.id}>{value.name}</option>)}</select>
            <button className="ghost-button" onClick={clearFilters}><Filter size={16} />{t('clear')}</button>
          </div>
        </div>
        <div className="toolbar-row toolbar-views">
          <div className="view-tabs">
            {[{ key: 'board', icon: <LayoutGrid size={16} /> }, { key: 'list', icon: <ListChecks size={16} /> }, { key: 'insights', icon: <Activity size={16} /> }].map((item) => <button key={item.key} className={`view-tab ${view === item.key ? 'is-active' : ''}`} onClick={() => setView(item.key as View)}>{item.icon}<span>{t(item.key as 'board' | 'list' | 'insights')}</span></button>)}
          </div>
          <p className="view-hint">{view === 'board' ? t('kanbanHint') : view === 'list' ? t('tableHint') : t('insightHint')}</p>
        </div>
      </section>

      <section className="workspace-canvas">
        {view === 'board' ? renderBoard() : view === 'list' ? renderList() : renderInsights()}
      </section>
    </main>

    <TaskDialog open={dialogOpen} task={selected} locale={locale} t={t} onClose={closeDialog} onSave={handleSave} onDelete={handleDelete} onDuplicate={handleDuplicate} currentProject={projectId} initialStatus={createStatus} />
  </div>;
}
