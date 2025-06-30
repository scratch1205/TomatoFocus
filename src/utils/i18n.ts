import { Language } from '../types';

export interface Translations {
  // App Title
  appTitle: string;
  
  // Timer
  working: string;
  resting: string;
  start: string;
  pause: string;
  reset: string;
  workTime: string;
  breakTime: string;
  minutes: string;
  seconds: string;
  
  // Tasks
  tasks: string;
  addTask: string;
  editTask: string;
  deleteTask: string;
  taskCompleted: string;
  taskAdded: string;
  taskDeleted: string;
  taskUpdated: string;
  noTasks: string;
  completedAt: string;
  
  // Task Groups
  taskGroups: string;
  createTaskGroup: string;
  taskGroupName: string;
  defaultTasks: string;
  taskGroupCreated: string;
  taskGroupDeleted: string;
  
  // Stats
  statistics: string;
  completedPomodoros: string;
  completedTasks: string;
  focusTime: string;
  todayPomodoros: string;
  barChart: string;
  pieChart: string;
  dataAnalysis: string;
  
  // Countdown
  countdown: string;
  targetCountdown: string;
  addCountdown: string;
  editCountdown: string;
  goalTitle: string;
  goalDescription: string;
  targetDate: string;
  targetTime: string;
  goalType: string;
  expired: string;
  days: string;
  hours: string;
  mins: string;
  secs: string;
  remaining: string;
  
  // Goal Categories
  exam: string;
  work: string;
  personal: string;
  holiday: string;
  other: string;
  
  // Preset Goals
  examCountdown: string;
  examCountdownDesc: string;
  graduateExam: string;
  graduateExamDesc: string;
  projectDeadline: string;
  projectDeadlineDesc: string;
  newYearGoal: string;
  newYearGoalDesc: string;
  springFestival: string;
  springFestivalDesc: string;
  
  // Check-in
  checkin: string;
  checkedIn: string;
  streak: string;
  checkinSuccess: string;
  
  // Calendar
  calendar: string;
  today: string;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  
  // Settings
  settings: string;
  pomodoroSettings: string;
  interfaceSettings: string;
  dataManagement: string;
  fullscreen: string;
  glassEffect: string;
  animations: string;
  clockStyle: string;
  colorTheme: string;
  language: string;
  digitalClock: string;
  flipClock: string;
  analogClock: string;
  exportJSON: string;
  exportTXT: string;
  importData: string;
  
  // Color Themes
  blueTheme: string;
  whiteTheme: string;
  greenTheme: string;
  purpleTheme: string;
  orangeTheme: string;
  
  // Languages
  simplifiedChinese: string;
  traditionalChinese: string;
  english: string;
  singaporeChinese: string;
  
  // White Noise
  whiteNoise: string;
  rain: string;
  ocean: string;
  forest: string;
  fire: string;
  
  // Fullscreen Clock
  fullscreenClock: string;
  viewCurrentTime: string;
  viewPomodoroCountdown: string;
  focusTime: string;
  restTime: string;
  focusMessage: string;
  restMessage: string;
  
  // Common
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  add: string;
  create: string;
  update: string;
  close: string;
  confirm: string;
  
  // Notifications
  timerReset: string;
  workTimeEnd: string;
  breakTimeEnd: string;
  dataExported: string;
  dataImported: string;
  importFailed: string;
}

const translations: Record<Language, Translations> = {
  'zh-CN': {
    appTitle: '番茄钟专注系统',
    working: '工作中',
    resting: '休息中',
    start: '开始',
    pause: '暂停',
    reset: '重置',
    workTime: '工作时间',
    breakTime: '休息时间',
    minutes: '分钟',
    seconds: '秒',
    tasks: '待办事项',
    addTask: '添加任务',
    editTask: '编辑任务',
    deleteTask: '删除任务',
    taskCompleted: '任务已完成！',
    taskAdded: '任务已添加',
    taskDeleted: '任务已删除',
    taskUpdated: '任务已更新',
    noTasks: '暂无任务，添加一个开始吧！',
    completedAt: '完成于',
    taskGroups: '任务集',
    createTaskGroup: '创建任务集',
    taskGroupName: '任务集名称',
    defaultTasks: '默认任务',
    taskGroupCreated: '任务集已创建',
    taskGroupDeleted: '任务集已删除',
    statistics: '统计信息',
    completedPomodoros: '完成番茄钟',
    completedTasks: '完成任务',
    focusTime: '专注时间',
    todayPomodoros: '今日番茄',
    barChart: '柱状图',
    pieChart: '饼图',
    dataAnalysis: '专注数据分析',
    countdown: '倒计时',
    targetCountdown: '目标倒计时',
    addCountdown: '添加倒计时',
    editCountdown: '编辑倒计时',
    goalTitle: '目标标题',
    goalDescription: '目标描述',
    targetDate: '目标日期',
    targetTime: '目标时间',
    goalType: '目标类型',
    expired: '已到期',
    days: '天',
    hours: '时',
    mins: '分',
    secs: '秒',
    remaining: '剩余',
    exam: '考试',
    work: '工作',
    personal: '个人',
    holiday: '节日',
    other: '其他',
    examCountdown: '高考倒计时',
    examCountdownDesc: '为梦想大学冲刺！',
    graduateExam: '考研倒计时',
    graduateExamDesc: '研究生入学考试',
    projectDeadline: '项目截止日',
    projectDeadlineDesc: '重要项目交付',
    newYearGoal: '新年目标',
    newYearGoalDesc: '新的一年，新的开始',
    springFestival: '春节回家',
    springFestivalDesc: '与家人团聚的日子',
    checkin: '早起打卡',
    checkedIn: '已打卡',
    streak: '连续',
    checkinSuccess: '早起打卡成功！',
    calendar: '日历',
    today: '今天',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
    settings: '设置',
    pomodoroSettings: '番茄钟设置',
    interfaceSettings: '界面设置',
    dataManagement: '数据管理',
    fullscreen: '浏览器全屏',
    glassEffect: '毛玻璃效果',
    animations: '动画效果',
    clockStyle: '全屏时钟样式',
    colorTheme: '颜色主题',
    language: '语言',
    digitalClock: '数字时钟',
    flipClock: '翻页时钟',
    analogClock: '模拟时钟',
    exportJSON: '导出JSON',
    exportTXT: '导出TXT',
    importData: '导入数据',
    blueTheme: '蓝色主题',
    whiteTheme: '白色主题',
    greenTheme: '绿色主题',
    purpleTheme: '紫色主题',
    orangeTheme: '橙色主题',
    simplifiedChinese: '简体中文',
    traditionalChinese: '繁体中文',
    english: 'English',
    singaporeChinese: '新加坡中文',
    whiteNoise: '白噪音',
    rain: '雨声',
    ocean: '海浪',
    forest: '森林',
    fire: '火焰',
    fullscreenClock: '全屏时钟',
    viewCurrentTime: '查看当前时间',
    viewPomodoroCountdown: '查看番茄钟倒计时',
    focusMessage: '🍅 专注时间，保持高效！',
    restMessage: '☕ 休息时间，放松一下！',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    create: '创建',
    update: '更新',
    close: '关闭',
    confirm: '确认',
    timerReset: '计时器已重置',
    workTimeEnd: '工作时间结束！该休息了',
    breakTimeEnd: '休息时间结束！开始工作吧',
    dataExported: '数据已导出',
    dataImported: '数据导入成功',
    importFailed: '数据导入失败'
  },
  
  'zh-TW': {
    appTitle: '番茄鐘專注系統',
    working: '工作中',
    resting: '休息中',
    start: '開始',
    pause: '暫停',
    reset: '重置',
    workTime: '工作時間',
    breakTime: '休息時間',
    minutes: '分鐘',
    seconds: '秒',
    tasks: '待辦事項',
    addTask: '新增任務',
    editTask: '編輯任務',
    deleteTask: '刪除任務',
    taskCompleted: '任務已完成！',
    taskAdded: '任務已新增',
    taskDeleted: '任務已刪除',
    taskUpdated: '任務已更新',
    noTasks: '暫無任務，新增一個開始吧！',
    completedAt: '完成於',
    taskGroups: '任務集',
    createTaskGroup: '建立任務集',
    taskGroupName: '任務集名稱',
    defaultTasks: '預設任務',
    taskGroupCreated: '任務集已建立',
    taskGroupDeleted: '任務集已刪除',
    statistics: '統計資訊',
    completedPomodoros: '完成番茄鐘',
    completedTasks: '完成任務',
    focusTime: '專注時間',
    todayPomodoros: '今日番茄',
    barChart: '長條圖',
    pieChart: '圓餅圖',
    dataAnalysis: '專注數據分析',
    countdown: '倒數計時',
    targetCountdown: '目標倒數計時',
    addCountdown: '新增倒數計時',
    editCountdown: '編輯倒數計時',
    goalTitle: '目標標題',
    goalDescription: '目標描述',
    targetDate: '目標日期',
    targetTime: '目標時間',
    goalType: '目標類型',
    expired: '已到期',
    days: '天',
    hours: '時',
    mins: '分',
    secs: '秒',
    remaining: '剩餘',
    exam: '考試',
    work: '工作',
    personal: '個人',
    holiday: '節日',
    other: '其他',
    examCountdown: '大學入學考試倒數',
    examCountdownDesc: '為夢想大學衝刺！',
    graduateExam: '研究所考試倒數',
    graduateExamDesc: '研究生入學考試',
    projectDeadline: '專案截止日',
    projectDeadlineDesc: '重要專案交付',
    newYearGoal: '新年目標',
    newYearGoalDesc: '新的一年，新的開始',
    springFestival: '春節回家',
    springFestivalDesc: '與家人團聚的日子',
    checkin: '早起打卡',
    checkedIn: '已打卡',
    streak: '連續',
    checkinSuccess: '早起打卡成功！',
    calendar: '行事曆',
    today: '今天',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
    settings: '設定',
    pomodoroSettings: '番茄鐘設定',
    interfaceSettings: '介面設定',
    dataManagement: '資料管理',
    fullscreen: '瀏覽器全螢幕',
    glassEffect: '毛玻璃效果',
    animations: '動畫效果',
    clockStyle: '全螢幕時鐘樣式',
    colorTheme: '顏色主題',
    language: '語言',
    digitalClock: '數位時鐘',
    flipClock: '翻頁時鐘',
    analogClock: '類比時鐘',
    exportJSON: '匯出JSON',
    exportTXT: '匯出TXT',
    importData: '匯入資料',
    blueTheme: '藍色主題',
    whiteTheme: '白色主題',
    greenTheme: '綠色主題',
    purpleTheme: '紫色主題',
    orangeTheme: '橙色主題',
    simplifiedChinese: '簡體中文',
    traditionalChinese: '繁體中文',
    english: 'English',
    singaporeChinese: '新加坡中文',
    whiteNoise: '白噪音',
    rain: '雨聲',
    ocean: '海浪',
    forest: '森林',
    fire: '火焰',
    fullscreenClock: '全螢幕時鐘',
    viewCurrentTime: '檢視目前時間',
    viewPomodoroCountdown: '檢視番茄鐘倒數計時',
    focusMessage: '🍅 專注時間，保持高效！',
    restMessage: '☕ 休息時間，放鬆一下！',
    save: '儲存',
    cancel: '取消',
    edit: '編輯',
    delete: '刪除',
    add: '新增',
    create: '建立',
    update: '更新',
    close: '關閉',
    confirm: '確認',
    timerReset: '計時器已重置',
    workTimeEnd: '工作時間結束！該休息了',
    breakTimeEnd: '休息時間結束！開始工作吧',
    dataExported: '資料已匯出',
    dataImported: '資料匯入成功',
    importFailed: '資料匯入失敗'
  },
  
  'en': {
    appTitle: 'Pomodoro Focus System',
    working: 'Working',
    resting: 'Resting',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    workTime: 'Work Time',
    breakTime: 'Break Time',
    minutes: 'minutes',
    seconds: 'seconds',
    tasks: 'Tasks',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    taskCompleted: 'Task completed!',
    taskAdded: 'Task added',
    taskDeleted: 'Task deleted',
    taskUpdated: 'Task updated',
    noTasks: 'No tasks yet, add one to get started!',
    completedAt: 'Completed at',
    taskGroups: 'Task Groups',
    createTaskGroup: 'Create Task Group',
    taskGroupName: 'Task Group Name',
    defaultTasks: 'Default Tasks',
    taskGroupCreated: 'Task group created',
    taskGroupDeleted: 'Task group deleted',
    statistics: 'Statistics',
    completedPomodoros: 'Completed Pomodoros',
    completedTasks: 'Completed Tasks',
    focusTime: 'Focus Time',
    todayPomodoros: 'Today\'s Pomodoros',
    barChart: 'Bar Chart',
    pieChart: 'Pie Chart',
    dataAnalysis: 'Focus Data Analysis',
    countdown: 'Countdown',
    targetCountdown: 'Target Countdown',
    addCountdown: 'Add Countdown',
    editCountdown: 'Edit Countdown',
    goalTitle: 'Goal Title',
    goalDescription: 'Goal Description',
    targetDate: 'Target Date',
    targetTime: 'Target Time',
    goalType: 'Goal Type',
    expired: 'Expired',
    days: 'days',
    hours: 'hours',
    mins: 'mins',
    secs: 'secs',
    remaining: 'remaining',
    exam: 'Exam',
    work: 'Work',
    personal: 'Personal',
    holiday: 'Holiday',
    other: 'Other',
    examCountdown: 'College Entrance Exam',
    examCountdownDesc: 'Sprint for your dream university!',
    graduateExam: 'Graduate Exam',
    graduateExamDesc: 'Graduate school entrance exam',
    projectDeadline: 'Project Deadline',
    projectDeadlineDesc: 'Important project delivery',
    newYearGoal: 'New Year Goal',
    newYearGoalDesc: 'New year, new beginning',
    springFestival: 'Spring Festival',
    springFestivalDesc: 'Family reunion time',
    checkin: 'Morning Check-in',
    checkedIn: 'Checked In',
    streak: 'streak',
    checkinSuccess: 'Morning check-in successful!',
    calendar: 'Calendar',
    today: 'Today',
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    settings: 'Settings',
    pomodoroSettings: 'Pomodoro Settings',
    interfaceSettings: 'Interface Settings',
    dataManagement: 'Data Management',
    fullscreen: 'Browser Fullscreen',
    glassEffect: 'Glass Effect',
    animations: 'Animations',
    clockStyle: 'Fullscreen Clock Style',
    colorTheme: 'Color Theme',
    language: 'Language',
    digitalClock: 'Digital Clock',
    flipClock: 'Flip Clock',
    analogClock: 'Analog Clock',
    exportJSON: 'Export JSON',
    exportTXT: 'Export TXT',
    importData: 'Import Data',
    blueTheme: 'Blue Theme',
    whiteTheme: 'White Theme',
    greenTheme: 'Green Theme',
    purpleTheme: 'Purple Theme',
    orangeTheme: 'Orange Theme',
    simplifiedChinese: '简体中文',
    traditionalChinese: '繁體中文',
    english: 'English',
    singaporeChinese: '新加坡中文',
    whiteNoise: 'White Noise',
    rain: 'Rain',
    ocean: 'Ocean',
    forest: 'Forest',
    fire: 'Fire',
    fullscreenClock: 'Fullscreen Clock',
    viewCurrentTime: 'View Current Time',
    viewPomodoroCountdown: 'View Pomodoro Countdown',
    focusMessage: '🍅 Focus time, stay productive!',
    restMessage: '☕ Break time, relax a bit!',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    close: 'Close',
    confirm: 'Confirm',
    timerReset: 'Timer reset',
    workTimeEnd: 'Work time ended! Time to rest',
    breakTimeEnd: 'Break time ended! Let\'s get back to work',
    dataExported: 'Data exported',
    dataImported: 'Data imported successfully',
    importFailed: 'Data import failed'
  },
  
  'zh-SG': {
    appTitle: '番茄钟专注系统',
    working: '工作中',
    resting: '休息中',
    start: '开始',
    pause: '暂停',
    reset: '重置',
    workTime: '工作时间',
    breakTime: '休息时间',
    minutes: '分钟',
    seconds: '秒',
    tasks: '待办事项',
    addTask: '添加任务',
    editTask: '编辑任务',
    deleteTask: '删除任务',
    taskCompleted: '任务已完成！',
    taskAdded: '任务已添加',
    taskDeleted: '任务已删除',
    taskUpdated: '任务已更新',
    noTasks: '暂无任务，添加一个开始吧！',
    completedAt: '完成于',
    taskGroups: '任务集',
    createTaskGroup: '创建任务集',
    taskGroupName: '任务集名称',
    defaultTasks: '默认任务',
    taskGroupCreated: '任务集已创建',
    taskGroupDeleted: '任务集已删除',
    statistics: '统计信息',
    completedPomodoros: '完成番茄钟',
    completedTasks: '完成任务',
    focusTime: '专注时间',
    todayPomodoros: '今日番茄',
    barChart: '柱状图',
    pieChart: '饼图',
    dataAnalysis: '专注数据分析',
    countdown: '倒计时',
    targetCountdown: '目标倒计时',
    addCountdown: '添加倒计时',
    editCountdown: '编辑倒计时',
    goalTitle: '目标标题',
    goalDescription: '目标描述',
    targetDate: '目标日期',
    targetTime: '目标时间',
    goalType: '目标类型',
    expired: '已到期',
    days: '天',
    hours: '时',
    mins: '分',
    secs: '秒',
    remaining: '剩余',
    exam: '考试',
    work: '工作',
    personal: '个人',
    holiday: '节日',
    other: '其他',
    examCountdown: 'A水准考试倒计时',
    examCountdownDesc: '为理想大学冲刺！',
    graduateExam: '研究生考试倒计时',
    graduateExamDesc: '研究生入学考试',
    projectDeadline: '项目截止日',
    projectDeadlineDesc: '重要项目交付',
    newYearGoal: '新年目标',
    newYearGoalDesc: '新的一年，新的开始',
    springFestival: '农历新年回家',
    springFestivalDesc: '与家人团聚的日子',
    checkin: '早起打卡',
    checkedIn: '已打卡',
    streak: '连续',
    checkinSuccess: '早起打卡成功！',
    calendar: '日历',
    today: '今天',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
    settings: '设置',
    pomodoroSettings: '番茄钟设置',
    interfaceSettings: '界面设置',
    dataManagement: '数据管理',
    fullscreen: '浏览器全屏',
    glassEffect: '毛玻璃效果',
    animations: '动画效果',
    clockStyle: '全屏时钟样式',
    colorTheme: '颜色主题',
    language: '语言',
    digitalClock: '数字时钟',
    flipClock: '翻页时钟',
    analogClock: '模拟时钟',
    exportJSON: '导出JSON',
    exportTXT: '导出TXT',
    importData: '导入数据',
    blueTheme: '蓝色主题',
    whiteTheme: '白色主题',
    greenTheme: '绿色主题',
    purpleTheme: '紫色主题',
    orangeTheme: '橙色主题',
    simplifiedChinese: '简体中文',
    traditionalChinese: '繁体中文',
    english: 'English',
    singaporeChinese: '新加坡中文',
    whiteNoise: '白噪音',
    rain: '雨声',
    ocean: '海浪',
    forest: '森林',
    fire: '火焰',
    fullscreenClock: '全屏时钟',
    viewCurrentTime: '查看当前时间',
    viewPomodoroCountdown: '查看番茄钟倒计时',
    focusMessage: '🍅 专注时间，保持高效！',
    restMessage: '☕ 休息时间，放松一下！',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    create: '创建',
    update: '更新',
    close: '关闭',
    confirm: '确认',
    timerReset: '计时器已重置',
    workTimeEnd: '工作时间结束！该休息了',
    breakTimeEnd: '休息时间结束！开始工作吧',
    dataExported: '数据已导出',
    dataImported: '数据导入成功',
    importFailed: '数据导入失败'
  }
};

export const useTranslation = (language: Language) => {
  return translations[language];
};

export const getAvailableLanguages = (): { code: Language; name: string }[] => [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'zh-SG', name: '新加坡中文' }
];