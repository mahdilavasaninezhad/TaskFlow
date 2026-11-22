import type { Category, Priority, ProjectId, Status, Task } from '../types';

export const projects: { id: ProjectId; name: string; nameFa: string; subtitle: string; subtitleFa: string; color: string; icon: string }[] = [
  { id: 'aurora', name: 'Aurora Website', nameFa: 'وب‌سایت آرورا', subtitle: 'Website redesign & launch', subtitleFa: 'بازطراحی و انتشار وب‌سایت', color: '#829889', icon: '✦' },
  { id: 'atlas', name: 'Atlas Mobile', nameFa: 'اپلیکیشن اطلس', subtitle: 'Mobile product experience', subtitleFa: 'تجربه محصول موبایل', color: '#7f9297', icon: '◈' },
  { id: 'orbit', name: 'Orbit Growth', nameFa: 'رشد اوربیت', subtitle: 'Marketing & acquisition', subtitleFa: 'بازاریابی و جذب کاربر', color: '#a49580', icon: '◉' }
];

export const members = [
  { id: 'alex', name: 'Alex Morgan', role: 'Product designer', roleFa: 'طراح محصول', color: 'lilac' },
  { id: 'sam', name: 'Sam Rivera', role: 'Frontend engineer', roleFa: 'توسعه‌دهنده فرانت‌اند', color: 'peach' },
  { id: 'jordan', name: 'Jordan Lee', role: 'Product manager', roleFa: 'مدیر محصول', color: 'mint' },
  { id: 'taylor', name: 'Taylor Kim', role: 'QA engineer', roleFa: 'مهندس تست', color: 'blue' },
  { id: 'casey', name: 'Casey Park', role: 'Growth lead', roleFa: 'مدیر رشد', color: 'pink' }
];

export const statuses: Status[] = ['backlog', 'progress', 'review', 'done'];
export const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
export const categories: Category[] = ['design', 'development', 'research', 'marketing', 'qa'];

export const addDays = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const seedRows: [ProjectId, string, string, string, string, Status, Priority, Category, string, number, number][] = [
  ['aurora', 'Revamp landing page hero', 'بازطراحی هدر صفحه اصلی', 'Design a compelling first impression with concise copy and accessible interactions.', 'طراحی یک معرفی جذاب با متن مختصر و تعاملات دسترس‌پذیر.', 'progress', 'urgent', 'design', 'alex', 2, 5],
  ['aurora', 'Implement authentication UI', 'پیاده‌سازی رابط ورود کاربران', 'Build sign-in, reset password and validation states for the new portal.', 'ساخت فرم ورود، بازیابی رمز و حالت‌های اعتبارسنجی.', 'progress', 'high', 'development', 'sam', 5, 8],
  ['aurora', 'Audit mobile experience', 'بررسی تجربه موبایل', 'Find layout issues across common mobile viewport widths.', 'شناسایی مشکلات چیدمان در نمایشگرهای موبایل.', 'review', 'high', 'qa', 'taylor', 1, 3],
  ['aurora', 'Create component library', 'ساخت کتابخانه کامپوننت', 'Define reusable buttons, badges, inputs and empty states.', 'تعریف دکمه‌ها، نشان‌ها، ورودی‌ها و حالت‌های خالی.', 'backlog', 'medium', 'design', 'alex', 7, 8],
  ['aurora', 'Optimize image loading', 'بهینه‌سازی بارگذاری تصاویر', 'Apply modern formats and responsive images to key pages.', 'استفاده از فرمت‌های جدید و تصاویر ریسپانسیو.', 'backlog', 'medium', 'development', 'sam', 8, 5],
  ['aurora', 'Map user journey', 'ترسیم مسیر کاربر', 'Review navigation paths and identify friction points.', 'بررسی مسیرهای ناوبری و نقاط اصطکاک تجربه کاربری.', 'done', 'medium', 'research', 'jordan', -3, 3],
  ['aurora', 'Set up project foundations', 'آماده‌سازی زیرساخت پروژه', 'Prepare project structure, shared tokens and deployment workflow.', 'آماده‌سازی ساختار پروژه، توکن‌ها و روند انتشار.', 'done', 'low', 'development', 'sam', -8, 5],
  ['aurora', 'Review release checklist', 'بازبینی چک‌لیست انتشار', 'Verify accessibility, SEO, analytics and major user flows.', 'بررسی دسترس‌پذیری، سئو، آنالیتیکس و مسیرهای اصلی.', 'review', 'urgent', 'qa', 'taylor', -1, 3],
  ['aurora', 'Write onboarding content', 'نگارش محتوای شروع کار', 'Draft welcome screens and onboarding microcopy.', 'نوشتن صفحات خوش‌آمدگویی و متن‌های راهنما.', 'backlog', 'low', 'marketing', 'casey', 11, 2],
  ['atlas', 'Prototype new navigation', 'نمونه‌سازی ناوبری جدید', 'Explore bottom-tab patterns and navigation consistency.', 'بررسی الگوهای نوار پایین و یکپارچگی ناوبری.', 'progress', 'high', 'design', 'alex', 3, 5],
  ['atlas', 'Implement offline banners', 'پیاده‌سازی پیام آفلاین', 'Communicate network and retry states clearly.', 'نمایش روشن وضعیت شبکه و تلاش مجدد.', 'backlog', 'medium', 'development', 'sam', 10, 3],
  ['atlas', 'Accessibility audit', 'ارزیابی دسترس‌پذیری', 'Check contrast, touch targets and screen-reader labels.', 'بررسی کنتراست، نواحی لمس و برچسب‌های صفحه‌خوان.', 'review', 'urgent', 'qa', 'taylor', -2, 5],
  ['atlas', 'Define feature milestones', 'تعریف نقاط عطف محصول', 'Agree on product milestones and sprint acceptance criteria.', 'تعیین نقاط عطف و معیارهای پذیرش اسپرینت.', 'done', 'medium', 'research', 'jordan', -5, 2],
  ['atlas', 'Research mobile usability', 'پژوهش کاربردپذیری موبایل', 'Summarize user testing observations for design iteration.', 'خلاصه‌سازی نتایج آزمون کاربران برای بهبود طراحی.', 'backlog', 'low', 'research', 'alex', 14, 3],
  ['orbit', 'Build campaign landing page', 'ساخت صفحه فرود کمپین', 'Create a conversion-focused page with analytics events.', 'ساخت صفحه تبدیل با رویدادهای تحلیلی.', 'progress', 'high', 'marketing', 'casey', 4, 5],
  ['orbit', 'Draft email nurture flows', 'طراحی مسیر ایمیل‌های پیگیری', 'Plan useful onboarding emails and simple segmentation.', 'برنامه‌ریزی ایمیل‌های شروع کار و دسته‌بندی کاربران.', 'backlog', 'low', 'marketing', 'casey', 9, 3],
  ['orbit', 'Review acquisition funnel', 'بررسی قیف جذب کاربر', 'Inspect conversion points and track key drop-offs.', 'بررسی نرخ تبدیل و نقاط ریزش کاربر.', 'review', 'medium', 'research', 'jordan', 6, 5],
  ['orbit', 'Prepare launch assets', 'آماده‌سازی محتوای انتشار', 'Build social graphics and finalize campaign copy.', 'ساخت تصاویر اجتماعی و نهایی‌سازی متن کمپین.', 'done', 'medium', 'design', 'alex', -4, 3]
];

export const initialTasks = (): Task[] => seedRows.map((item, i) => {
  const [projectId, title, titleFa, description, descriptionFa, status, priority, category, assignee, days, points] = item;
  const now = Date.now();
  return { id: `TF-${201 + i}`, projectId, title, titleFa, description, descriptionFa, status, priority, category, assignee, dueDate: addDays(days), createdAt: now - (28 - i) * 86400000, updatedAt: now - Math.max(0, 6 - i % 7) * 86400000, points };
});
