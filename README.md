# 番茄钟专注系统

![Pomodoro Focus System Logo](https://via.placeholder.com/150/4361ee/FFFFFF?text=🍅) <!-- 替换为您的项目Logo或图标 -->

一个美观、功能丰富的番茄钟专注系统，旨在帮助您提高工作效率、管理任务和追踪专注数据。

## 目录

-   [项目简介](#项目简介)
-   [主要功能](#主要功能)
-   [技术栈](#技术栈)
-   [安装与运行](#安装与运行)
-   [使用指南](#使用指南)
-   [配置选项](#配置选项)
-   [贡献](#贡献)
-   [许可证](#许可证)
-   [致谢](#致谢)

## 项目简介

本项目是一个基于 React 和 TypeScript 构建的现代化番茄钟应用。它不仅提供核心的番茄工作法计时功能，还集成了任务管理、专注数据统计、日历打卡、目标倒计时和在线音乐播放等多种实用工具，旨在为您打造一个一站式的专注工作环境。

## 主要功能

-   **番茄钟计时器**:
    -   自定义工作和休息时长。
    -   直观的计时显示和状态提示。
    -   支持暂停、继续和重置计时。
-   **任务管理**:
    -   添加、编辑、完成和删除任务。
    -   任务分组功能，方便分类管理。
    -   任务完成状态追踪。
-   **专注数据统计**:
    -   记录完成的番茄钟数量、专注总时长和完成任务数。
    -   通过柱状图和饼图展示每周专注数据和任务完成情况。
-   **日历打卡**:
    -   每日打卡功能，追踪您的专注习惯。
    -   显示连续打卡天数（专注连击）。
-   **目标倒计时**:
    -   创建自定义目标倒计时，激励您达成重要里程碑。
    -   支持多种预设目标类型（考试、工作、个人、节日等）。
-   **多功能侧边栏**:
    -   可拖拽排序的侧边栏组件，包括任务、倒计时、打卡和日历。
-   **个性化设置**:
    -   多种颜色主题切换。
    -   毛玻璃（Glassmorphism）效果开关。
    -   动画效果开关。
    -   **全屏时钟**: 支持数字、翻页和模拟三种样式，提供沉浸式专注体验。
    -   **多语言支持**: 简体中文、繁体中文、英文、新加坡中文。
-   **背景音乐与白噪音**:
    -   内置白噪音播放器（雨声、海浪、森林、火焰）。
    -   集成网易云音乐播放器，支持搜索、播放和控制音乐。
-   **数据管理**:
    -   支持将所有应用数据导出为 JSON 或 TXT 格式。
    -   支持从 JSON 文件导入数据，方便数据迁移和备份。

## 技术栈

-   **前端**:
    -   [React](https://react.dev/) (v18.x)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Vite](https://vitejs.dev/) (作为构建工具和开发服务器)
    -   [Tailwind CSS](https://tailwindcss.com/) (用于快速构建UI)
    -   [Lucide React](https://lucide.dev/icons/) (用于图标)
    -   [Chart.js](https://www.chartjs.org/) / [React Chart.js 2](https://react-chartjs-2.js.org/) (用于数据可视化)
-   **数据存储**:
    -   浏览器本地存储 (localStorage)
-   **外部API**:
    -   网易云音乐API (用于音乐播放功能)

## 安装与运行

请确保您的系统已安装 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/) (或 [Yarn](https://yarnpkg.com/))。

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/pomodoro-focus-system.git # 替换为您的仓库地址
    cd pomodoro-focus-system
    ```
2.  **安装依赖**:
    ```bash
    npm install
    # 或者 yarn install
    ```
3.  **启动开发服务器**:
    ```bash
    npm run dev
    # 或者 yarn dev
    ```
    应用将在 `http://localhost:5173` (或控制台显示的地址) 启动。

4.  **构建生产版本**:
    ```bash
    npm run build
    # 或者 yarn build
    ```
    构建后的文件将生成在 `dist` 目录下。

## 使用指南

-   **番茄钟**: 点击主界面的“开始”按钮启动计时，点击“暂停”暂停，点击“重置”回到初始状态。
-   **任务管理**: 在侧边栏的“任务”部分，输入任务内容后点击“+”添加。点击任务旁的复选框完成/取消完成。
-   **任务分组**: 点击任务管理部分的文件夹图标，可以创建新的任务组并切换查看。
-   **数据统计**: 点击顶部导航栏的“统计”图标，查看您的专注数据图表。
-   **日历打卡**: 在侧边栏的“打卡”部分，点击“打卡”按钮记录今日打卡。
-   **目标倒计时**: 在侧边栏的“目标倒计时”部分，点击“+”添加新的倒计时事件。
-   **音乐播放器**: 点击顶部导航栏的“音乐”图标，打开音乐播放器，搜索并播放您喜欢的音乐。
-   **设置**: 点击顶部导航栏的“设置”图标，调整番茄钟时长、界面主题、语言等。

## 配置选项

您可以在“设置”面板中调整以下选项：

-   **番茄钟时长**: 工作时间和休息时间（分钟）。
-   **界面效果**: 开启/关闭毛玻璃效果、动画效果。
-   **全屏时钟样式**: 数字、翻页、模拟。
-   **颜色主题**: 蓝色、白色、绿色、紫色、橙色。
-   **语言**: 简体中文、繁体中文、英文。
-   **数据管理**: 导出/导入应用数据。

## 贡献

欢迎所有形式的贡献！如果您有任何改进建议、新功能想法或发现Bug，请随时提交 [Issue](https://github.com/your-username/pomodoro-focus-system/issues) 或提交 [Pull Request](https://github.com/your-username/pomodoro-focus-system/pulls)。

在提交 Pull Request 之前，请确保您的代码符合项目规范，并通过了所有测试。

## 许可证

本项目采用 [MIT 许可证](LICENSE) 发布。

## 致谢

-   感谢 [React](https://react.dev/)、[TypeScript](https://www.typescriptlang.org/)、[Vite](https://vitejs.dev/)、[Tailwind CSS](https://tailwindcss.com/) 等优秀开源项目。
-   感谢 [Lucide React](https://lucide.dev/icons/) 提供的精美图标。
-   感谢 [Chart.js](https://www.chartjs.org/) 和 [React Chart.js 2](https://react-chartjs-2.js.org/) 提供的图表解决方案。
-   感谢 [落月API](https://doc.vkeys.cn/api-doc/v3/) 提供的网易云音乐API。
-   感谢所有为本项目提供灵感、建议和贡献的朋友们。


# Pomodoro Focus System

![Pomodoro Focus System Logo](https://via.placeholder.com/150/4361ee/FFFFFF?text=🍅) <!-- Replace with your project logo or icon -->

A beautiful and feature-rich Pomodoro focus system designed to help you improve work efficiency, manage tasks, and track focus data.

## Table of Contents

-   [Project Introduction](#project-introduction)
-   [Key Features](#key-features)
-   [Tech Stack](#tech-stack)
-   [Installation and Running](#installation-and-running)
-   [Usage Guide](#usage-guide)
-   [Configuration Options](#configuration-options)
-   [Contributing](#contributing)
-   [License](#license)
-   [Acknowledgements](#acknowledgements)

## Project Introduction

This project is a modern Pomodoro application built with React and TypeScript. It not only provides core Pomodoro timer functionality but also integrates various practical tools such as task management, focus data statistics, calendar check-ins, goal countdowns, and an online music player. It aims to create an all-in-one focused work environment for you.

## Key Features

-   **Pomodoro Timer**:
    -   Customizable work and break durations.
    -   Intuitive timer display and status indicators.
    -   Supports pause, resume, and reset functions.
-   **Task Management**:
    -   Add, edit, complete, and delete tasks.
    -   Task grouping feature for organized management.
    -   Task completion status tracking.
-   **Focus Data Statistics**:
    -   Records completed Pomodoros, total focus time, and completed tasks.
    -   Visualizes weekly focus data and task completion with bar and pie charts.
-   **Calendar Check-in**:
    -   Daily check-in feature to track your focus habits.
    -   Displays consecutive check-in days (focus streak).
-   **Goal Countdown**:
    -   Create custom goal countdowns to motivate you towards important milestones.
    -   Supports various preset goal types (exam, work, personal, holiday, etc.).
-   **Multi-functional Sidebar**:
    -   Draggable and reorderable sidebar components, including tasks, countdowns, check-ins, and calendar.
-   **Personalized Settings**:
    -   Multiple color themes.
    -   Toggle for Glassmorphism effect.
    -   Toggle for animation effects.
    -   **Fullscreen Clock**: Supports digital, flip, and analog styles for an immersive focus experience.
    -   **Multi-language Support**: Simplified Chinese, Traditional Chinese, English, Singaporean Chinese.
-   **Background Music & White Noise**:
    -   Built-in white noise player (rain, ocean, forest, fire).
    -   Integrated NetEase Cloud Music player, supporting search, playback, and control.
-   **Data Management**:
    -   Supports exporting all application data to JSON or TXT format.
    -   Supports importing data from JSON files for easy migration and backup.

## Tech Stack

-   **Frontend**:
    -   [React](https://react.dev/) (v18.x)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Vite](https://vitejs.dev/) (as build tool and dev server)
    -   [Tailwind CSS](https://tailwindcss.com/) (for rapid UI development)
    -   [Lucide React](https://lucide.dev/icons/) (for icons)
    -   [Chart.js](https://www.chartjs.org/) / [React Chart.js 2](https://react-chartjs-2.js.org/) (for data visualization)
-   **Data Storage**:
    -   Browser local storage (localStorage)
-   **External APIs**:
    -   NetEase Cloud Music API (for music playback functionality)

## Installation and Running

Please ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/)) installed on your system.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/pomodoro-focus-system.git # Replace with your repository URL
    cd pomodoro-focus-system
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # Or yarn install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    # Or yarn dev
    ```
    The application will start at `http://localhost:5173` (or the address shown in your console).

4.  **Build for production**:
    ```bash
    npm run build
    # Or yarn build
    ```
    The built files will be generated in the `dist` directory.

## Usage Guide

-   **Pomodoro Timer**: Click the "Start" button on the main interface to begin the timer, "Pause" to pause, and "Reset" to return to the initial state.
-   **Task Management**: In the "Tasks" section of the sidebar, enter task content and click "+" to add. Check the checkbox next to a task to mark it as complete/incomplete.
-   **Task Grouping**: Click the folder icon in the task management section to create new task groups and switch between them.
-   **Data Statistics**: Click the "Statistics" icon in the top navigation bar to view your focus data charts.
-   **Calendar Check-in**: In the "Check-in" section of the sidebar, click the "Check-in" button to record your daily check-in.
-   **Goal Countdown**: In the "Target Countdown" section of the sidebar, click "+" to add a new countdown event.
-   **Music Player**: Click the "Music" icon in the top navigation bar to open the music player, search, and play your favorite music.
-   **Settings**: Click the "Settings" icon in the top navigation bar to adjust Pomodoro durations, interface themes, language, and more.

## Configuration Options

You can adjust the following options in the "Settings" panel:

-   **Pomodoro Durations**: Work time and break time (in minutes).
-   **Interface Effects**: Toggle Glassmorphism effect, animation effects.
-   **Fullscreen Clock Style**: Digital, Flip, Analog.
-   **Color Theme**: Blue, White, Green, Purple, Orange.
-   **Language**: Simplified Chinese, Traditional Chinese, English, Singaporean Chinese.
-   **Data Management**: Export/Import application data.

## Contributing

Contributions of all kinds are welcome! If you have any suggestions for improvement, new feature ideas, or find bugs, please feel free to submit an [Issue](https://github.com/your-username/pomodoro-focus-system/issues) or a [Pull Request](https://github.com/your-username/pomodoro-focus-system/pulls).

Before submitting a Pull Request, please ensure your code adheres to project standards and passes all tests.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

-   Thanks to excellent open-source projects like [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).
-   Thanks to [Lucide React](https://lucide.dev/icons/) for providing beautiful icons.
-   Thanks to [Chart.js](https://www.chartjs.org/) and [React Chart.js 2](https://react-chartjs-2.js.org/) for the charting solutions.
-   Thanks to all friends who provided inspiration, suggestions, and contributions to this project.
