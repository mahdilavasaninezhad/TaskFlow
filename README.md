# TaskFlow Pro

> **Move work forward, one clear task at a time.**

**React 19 · TypeScript · Vite · Zustand · dnd-kit**

## Overview

TaskFlow Pro turns scattered to-dos into a visual workflow. Its drag-and-drop Kanban board, list view, and project insights help users organize work, prioritize tasks, and understand progress without unnecessary complexity.

### Highlights

- Four-stage Kanban board with drag-and-drop
- Create, edit, duplicate, and delete tasks
- Board, list, and project-insights views
- Search and filters by priority, assignee, and category
- Persian/English interface, dark/light modes, and persistent local data
- JSON export and reset for the demo workspace

**Scope:** Frontend workflow demo powered by browser storage. It does not offer multi-user syncing, cloud accounts, or a production backend.

---

<div dir="rtl" align="right">

## معرفی فارسی

تسک‌فلو پرو وظایف پراکنده را به یک جریان کاری قابل مشاهده تبدیل می‌کند. برد کانبان با جابه‌جایی کشیدنی، نمایش فهرستی و گزارش‌های پروژه کمک می‌کنند کاربر وضعیت کارها، اولویت‌ها و پیشرفت را سریع و بدون پیچیدگی اضافه مدیریت کند.

### ویژگی‌های اصلی

- برد کانبان چهارمرحله‌ای با جابه‌جایی Drag & Drop
- ساخت، ویرایش، تکثیر و حذف وظایف
- نمایش برد، فهرست و تحلیل وضعیت پروژه
- جست‌وجو و فیلتر بر اساس اولویت، مسئول و دسته‌بندی
- رابط فارسی/انگلیسی، تم روشن/تاریک و ذخیره داده‌ها در مرورگر
- خروجی JSON و امکان بازنشانی داده‌های آزمایشی

**محدوده پروژه:** این پروژه یک نمونه نمایشی فرانت‌اند است و اطلاعات را در مرورگر نگه می‌دارد؛ همگام‌سازی چندکاربره یا بک‌اند واقعی ندارد.

</div>

---

## Technical documentation / مستندات فنی

## Features

- Kanban with four workflow stages and drag-and-drop between stages
- Board, list and insights views
- Three sample project workspaces and five demo team members
- Create, edit, duplicate and remove tasks
- Search, priority, assignee and category filters
- English/Farsi switching, RTL/LTR and Persian calendar display
- Light/dark themes with saved preferences
- Demo data stored locally in the browser
- JSON export and reset of the local demo
- Responsive design, keyboard shortcut for search and mobile navigation

## Development

Install dependencies with `npm install`, then start the dev server with `npm run dev`. Use `npm run build` for a production bundle.

The application uses browser localStorage and sample data. It has no backend, real authentication, multiuser synchronization or external API integration. Exporting JSON creates a local file and does not transmit data to a server.

## GitHub Pages

This project is configured for a repository named `TaskFlow-Pro` under `https://USERNAME.github.io/TaskFlow-Pro/`. The Vite base path in `vite.config.ts` is `/TaskFlow-Pro/`. Create an independent public repository with that exact name and push to the `main` branch. In repository Settings > Pages select GitHub Actions as the source.

The workflow installs packages in GitHub Actions. Commit `package-lock.json` after installing locally if you want reproducible dependency versions. If you use a different repository name, change the Vite base path to match.

## Portfolio context

This is a frontend demonstration. Screens, charts and metrics are calculated from the local task dataset. Interface translations do not automatically translate user-entered text.
