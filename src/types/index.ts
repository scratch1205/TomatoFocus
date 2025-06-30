export interface Task {
  id: number;
  text: string;
  completed: boolean;
  created: Date;
  completedAt: Date | null;
  color: string;
  groupId?: number;
}

export interface TaskGroup {
  id: number;
  name: string;
  color: string;
  created: Date;
}

export interface CheckinData {
  date: string;
  time: string;
}

export interface AppSettings {
  enableFullscreen: boolean;
  enableGlassEffect: boolean;
  enableAnimations: boolean;
  clockStyle: 'digital' | 'flip' | 'analog';
  colorTheme: 'blue' | 'white' | 'green' | 'purple' | 'orange';
  language: 'zh-CN' | 'zh-TW' | 'en' | 'zh-SG';
}

export interface AppData {
  tasks: Task[];
  taskGroups: TaskGroup[];
  completedPomodoros: number;
  focusTime: number;
  completedTasks: number;
  workTime: number;
  breakTime: number;
  checkins: CheckinData[];
  settings: AppSettings;
  dailyFocusData: { [key: string]: number };
}

export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'zh-SG';
export type ColorTheme = 'blue' | 'white' | 'green' | 'purple' | 'orange';