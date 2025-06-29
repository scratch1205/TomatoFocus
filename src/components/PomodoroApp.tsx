import React, { useState, useEffect, useRef } from 'react';
import { Clock, Settings, BarChart3, Music, Upload, Download, Play, Pause, RotateCcw, Plus, Edit, Trash2, Check, X, Calendar, Target, Maximize, Folder, FolderOpen } from 'lucide-react';
import StatsPanel from './StatsPanel';
import TaskManager from './TaskManager';
import CalendarWidget from './CalendarWidget';
import CountdownWidget from './CountdownWidget';
import SettingsPanel from './SettingsPanel';
import EditModal from './EditModal';
import WhiteNoisePlayer from './WhiteNoisePlayer';
import Notification from './Notification';
import FullscreenClock from './FullscreenClock';
import TaskGroupModal from './TaskGroupModal';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  created: Date;
  completedAt: Date | null;
  color: string;
  groupId?: number;
}

interface TaskGroup {
  id: number;
  name: string;
  color: string;
  created: Date;
}

interface CheckinData {
  date: string;
  time: string;
}

interface AppSettings {
  enableFullscreen: boolean;
  enableGlassEffect: boolean;
  enableAnimations: boolean;
  clockStyle: 'digital' | 'flip' | 'analog';
}

interface AppData {
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

const PomodoroApp: React.FC = () => {
  // Timer states
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);

  // UI states
  const [activePanel, setActivePanel] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskGroupModal, setShowTaskGroupModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [showFullscreenClock, setShowFullscreenClock] = useState(false);

  // Task states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Check-in states
  const [checkins, setCheckins] = useState<CheckinData[]>([]);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    enableFullscreen: false,
    enableGlassEffect: true,
    enableAnimations: true,
    clockStyle: 'flip'
  });

  // Daily focus data for charts
  const [dailyFocusData, setDailyFocusData] = useState<{ [key: string]: number }>({});

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate random color for tasks
  const generateRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pomodoroAppData');
    if (savedData) {
      try {
        const data: AppData = JSON.parse(savedData);
        setTasks(data.tasks?.map(task => ({
          ...task,
          created: new Date(task.created),
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          color: task.color || generateRandomColor()
        })) || []);
        setTaskGroups(data.taskGroups?.map(group => ({
          ...group,
          created: new Date(group.created)
        })) || []);
        setCompletedPomodoros(data.completedPomodoros || 0);
        setFocusTime(data.focusTime || 0);
        setCompletedTasks(data.completedTasks || 0);
        setWorkTime(data.workTime || 25 * 60);
        setBreakTime(data.breakTime || 5 * 60);
        setCheckins(data.checkins || []);
        setSettings(data.settings || {
          enableFullscreen: false,
          enableGlassEffect: true,
          enableAnimations: true,
          clockStyle: 'flip'
        });
        setDailyFocusData(data.dailyFocusData || {});
        
        // Check if today is already checked in
        const today = new Date().toDateString();
        const todayCheckin = data.checkins?.find(c => new Date(c.date).toDateString() === today);
        setTodayCheckedIn(!!todayCheckin);
        
        // Calculate streak
        calculateStreak(data.checkins || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const data: AppData = {
      tasks,
      taskGroups,
      completedPomodoros,
      focusTime,
      completedTasks,
      workTime,
      breakTime,
      checkins,
      settings,
      dailyFocusData
    };
    localStorage.setItem('pomodoroAppData', JSON.stringify(data));
  }, [tasks, taskGroups, completedPomodoros, focusTime, completedTasks, workTime, breakTime, checkins, settings, dailyFocusData]);

  // Update daily focus data
  useEffect(() => {
    const today = new Date().toDateString();
    if (isRunning && isWorkTime) {
      setDailyFocusData(prev => ({
        ...prev,
        [today]: (prev[today] || 0) + 1
      }));
    }
  }, [focusTime, isRunning, isWorkTime]);

  // Apply fullscreen setting
  useEffect(() => {
    if (settings.enableFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [settings.enableFullscreen]);

  // 核心计时器逻辑 - 移除workTime和breakTime依赖
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        if (isWorkTime) {
          setFocusTime(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer finished
      setIsRunning(false);
      if (isWorkTime) {
        setCompletedPomodoros(prev => prev + 1);
        showNotificationMessage('工作时间结束！该休息了');
        playSound();
      } else {
        showNotificationMessage('休息时间结束！开始工作吧');
        playSound();
      }
      
      // Switch to next phase
      setIsWorkTime(!isWorkTime);
      setTimeLeft(!isWorkTime ? workTime : breakTime);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, isWorkTime]); // 移除workTime和breakTime依赖

  // 单独处理工作/休息时间变化时的重置逻辑
  useEffect(() => {
    // 只有在计时器未运行时才重置时间
    if (!isRunning) {
      setTimeLeft(isWorkTime ? workTime : breakTime);
    }
  }, [workTime, breakTime, isWorkTime, isRunning]);

  const calculateStreak = (checkinData: CheckinData[]) => {
    if (checkinData.length === 0) {
      setStreak(0);
      return;
    }

    // Sort checkins by date
    const sortedCheckins = checkinData
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const checkinDate of sortedCheckins) {
      const checkinDay = new Date(checkinDate);
      checkinDay.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() === checkinDay.getTime()) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (currentDate.getTime() - checkinDay.getTime() === 24 * 60 * 60 * 1000) {
        currentStreak++;
        currentDate = checkinDay;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setTimeLeft(workTime);
    showNotificationMessage('计时器已重置');
  };

  const showNotificationMessage = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const addTask = (text: string, groupId?: number) => {
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      created: new Date(),
      completedAt: null,
      color: generateRandomColor(),
      groupId
    };
    setTasks([...tasks, newTask]);
    showNotificationMessage('任务已添加');
  };

  const addTaskGroup = (name: string) => {
    const newGroup: TaskGroup = {
      id: Date.now(),
      name,
      color: generateRandomColor(),
      created: new Date()
    };
    setTaskGroups([...taskGroups, newGroup]);
    showNotificationMessage('任务集已创建');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : null
        };
        
        if (!task.completed) {
          setCompletedTasks(prev => prev + 1);
          showNotificationMessage('任务已完成！');
        } else {
          setCompletedTasks(prev => prev - 1);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.completed) {
      setCompletedTasks(prev => prev - 1);
    }
    setTasks(tasks.filter(task => task.id !== id));
    showNotificationMessage('任务已删除');
  };

  const deleteTaskGroup = (id: number) => {
    // Delete all tasks in the group
    const tasksInGroup = tasks.filter(task => task.groupId === id);
    const completedTasksInGroup = tasksInGroup.filter(task => task.completed).length;
    
    setTasks(tasks.filter(task => task.groupId !== id));
    setTaskGroups(taskGroups.filter(group => group.id !== id));
    setCompletedTasks(prev => prev - completedTasksInGroup);
    
    if (selectedGroupId === id) {
      setSelectedGroupId(null);
    }
    
    showNotificationMessage('任务集已删除');
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const saveEditedTask = (text: string) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, text }
          : task
      ));
      showNotificationMessage('任务已更新');
    }
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleCheckin = () => {
    const now = new Date();
    const newCheckin: CheckinData = {
      date: now.toISOString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedCheckins = [...checkins, newCheckin];
    setCheckins(updatedCheckins);
    setTodayCheckedIn(true);
    calculateStreak(updatedCheckins);
    showNotificationMessage('早起打卡成功！');
  };

  const exportData = () => {
    const data: AppData = {
      tasks,
      taskGroups,
      completedPomodoros,
      focusTime,
      completedTasks,
      workTime,
      breakTime,
      checkins,
      settings,
      dailyFocusData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotificationMessage('JSON数据已导出');
  };

  const exportDataAsTxt = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN');
    const timeStr = now.toLocaleTimeString('zh-CN');
    
    let txtContent = `番茄钟专注系统 - 数据报告
导出时间: ${dateStr} ${timeStr}
========================================

📊 统计概览
----------------------------------------
• 完成番茄钟: ${completedPomodoros} 个
• 总专注时间: ${Math.floor(focusTime / 3600)}小时${Math.floor((focusTime % 3600) / 60)}分钟
• 完成任务数: ${completedTasks} 个
• 总任务数: ${tasks.length} 个
• 任务完成率: ${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
• 连续打卡: ${streak} 天

⚙️ 当前设置
----------------------------------------
• 工作时间: ${Math.floor(workTime / 60)} 分钟
• 休息时间: ${Math.floor(breakTime / 60)} 分钟
• 毛玻璃效果: ${settings.enableGlassEffect ? '开启' : '关闭'}
• 动画效果: ${settings.enableAnimations ? '开启' : '关闭'}
• 时钟样式: ${settings.clockStyle === 'digital' ? '数字时钟' : settings.clockStyle === 'flip' ? '翻页时钟' : '模拟时钟'}

`;

    // 任务集信息
    if (taskGroups.length > 0) {
      txtContent += `📁 任务集列表 (${taskGroups.length}个)
----------------------------------------
`;
      taskGroups.forEach((group, index) => {
        const groupTasks = tasks.filter(task => task.groupId === group.id);
        const completedGroupTasks = groupTasks.filter(task => task.completed).length;
        txtContent += `${index + 1}. ${group.name}
   • 任务数量: ${groupTasks.length}
   • 已完成: ${completedGroupTasks}
   • 完成率: ${groupTasks.length > 0 ? Math.round((completedGroupTasks / groupTasks.length) * 100) : 0}%
   • 创建时间: ${new Date(group.created).toLocaleDateString('zh-CN')}

`;
      });
    }

    // 任务详情
    txtContent += `📝 任务详情 (${tasks.length}个)
----------------------------------------
`;

    // 默认任务
    const defaultTasks = tasks.filter(task => !task.groupId);
    if (defaultTasks.length > 0) {
      txtContent += `【默认任务】
`;
      defaultTasks.forEach((task, index) => {
        txtContent += `${index + 1}. ${task.completed ? '✅' : '⏳'} ${task.text}
   • 状态: ${task.completed ? '已完成' : '进行中'}
   • 创建时间: ${new Date(task.created).toLocaleDateString('zh-CN')} ${new Date(task.created).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
        if (task.completed && task.completedAt) {
          txtContent += `   • 完成时间: ${new Date(task.completedAt).toLocaleDateString('zh-CN')} ${new Date(task.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
        }
        txtContent += '\n';
      });
    }

    // 任务集中的任务
    taskGroups.forEach(group => {
      const groupTasks = tasks.filter(task => task.groupId === group.id);
      if (groupTasks.length > 0) {
        txtContent += `【${group.name}】
`;
        groupTasks.forEach((task, index) => {
          txtContent += `${index + 1}. ${task.completed ? '✅' : '⏳'} ${task.text}
   • 状态: ${task.completed ? '已完成' : '进行中'}
   • 创建时间: ${new Date(task.created).toLocaleDateString('zh-CN')} ${new Date(task.created).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
          if (task.completed && task.completedAt) {
            txtContent += `   • 完成时间: ${new Date(task.completedAt).toLocaleDateString('zh-CN')} ${new Date(task.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
          }
          txtContent += '\n';
        });
      }
    });

    // 打卡记录
    if (checkins.length > 0) {
      txtContent += `🌅 早起打卡记录 (${checkins.length}次)
----------------------------------------
`;
      // 按日期排序，最新的在前
      const sortedCheckins = [...checkins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      sortedCheckins.forEach((checkin, index) => {
        const checkinDate = new Date(checkin.date);
        txtContent += `${index + 1}. ${checkinDate.toLocaleDateString('zh-CN')} ${checkin.time}
`;
      });
      txtContent += '\n';
    }

    // 每日专注数据
    const focusDataEntries = Object.entries(dailyFocusData).filter(([_, minutes]) => minutes > 0);
    if (focusDataEntries.length > 0) {
      txtContent += `📈 每日专注时间记录
----------------------------------------
`;
      // 按日期排序
      focusDataEntries
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .forEach(([dateStr, seconds]) => {
          const date = new Date(dateStr);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          
          let timeStr = '';
          if (hours > 0) {
            timeStr = `${hours}小时${remainingMinutes}分钟`;
          } else {
            timeStr = `${remainingMinutes}分钟`;
          }
          
          txtContent += `• ${date.toLocaleDateString('zh-CN')}: ${timeStr}
`;
        });
    }

    txtContent += `
========================================
导出完成 - 番茄钟专注系统
感谢使用！继续保持专注！🍅
`;

    const dataBlob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `番茄钟数据报告-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotificationMessage('TXT报告已导出');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: AppData = JSON.parse(e.target?.result as string);
          setTasks(data.tasks?.map(task => ({
            ...task,
            created: new Date(task.created),
            completedAt: task.completedAt ? new Date(task.completedAt) : null,
            color: task.color || generateRandomColor()
          })) || []);
          setTaskGroups(data.taskGroups?.map(group => ({
            ...group,
            created: new Date(group.created)
          })) || []);
          setCompletedPomodoros(data.completedPomodoros || 0);
          setFocusTime(data.focusTime || 0);
          setCompletedTasks(data.completedTasks || 0);
          setWorkTime(data.workTime || 25 * 60);
          setBreakTime(data.breakTime || 5 * 60);
          setCheckins(data.checkins || []);
          setSettings(data.settings || {
            enableFullscreen: false,
            enableGlassEffect: true,
            enableAnimations: true,
            clockStyle: 'flip'
          });
          setDailyFocusData(data.dailyFocusData || {});
          
          // Check if today is already checked in
          const today = new Date().toDateString();
          const todayCheckin = data.checkins?.find(c => new Date(c.date).toDateString() === today);
          setTodayCheckedIn(!!todayCheckin);
          
          calculateStreak(data.checkins || []);
          showNotificationMessage('数据导入成功');
        } catch (error) {
          console.error('Import error:', error);
          showNotificationMessage('数据导入失败');
        }
      };
      reader.readAsText(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = isWorkTime ? workTime : breakTime;
    return ((total - timeLeft) / total) * 283; // 283 is circumference for r=45
  };

  const filteredTasks = selectedGroupId 
    ? tasks.filter(task => task.groupId === selectedGroupId)
    : tasks.filter(task => !task.groupId);

  return (
    <>
      {/* Hidden audio for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBzWOzvLJe" type="audio/wav" />
      </audio>

      {/* macOS风格顶部任务栏 */}
      <div className={`macos-dock ${settings.enableGlassEffect ? 'glass-effect' : 'solid-bg'} ${settings.enableAnimations ? 'animated' : ''}`}>
        <div
          className={`dock-item ${activePanel === 'pomodoro' ? 'active' : ''}`}
          onClick={() => setActivePanel('pomodoro')}
        >
          <Clock size={24} />
          <span className="tooltip">番茄钟</span>
        </div>
        <div
          className={`dock-item ${activePanel === 'tasks' ? 'active' : ''}`}
          onClick={() => setActivePanel('tasks')}
        >
          <Target size={24} />
          <span className="tooltip">待办事项</span>
        </div>
        <div
          className={`dock-item ${activePanel === 'stats' ? 'active' : ''}`}
          onClick={() => setActivePanel('stats')}
        >
          <BarChart3 size={24} />
          <span className="tooltip">统计信息</span>
        </div>
        <div
          className={`dock-item ${activePanel === 'noise' ? 'active' : ''}`}
          onClick={() => setActivePanel('noise')}
        >
          <Music size={24} />
          <span className="tooltip">白噪音</span>
        </div>
        <div
          className={`dock-item ${showFullscreenClock ? 'active' : ''}`}
          onClick={() => setShowFullscreenClock(true)}
        >
          <Maximize size={24} />
          <span className="tooltip">全屏时钟</span>
        </div>
        <div
          className={`dock-item ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={24} />
          <span className="tooltip">设置</span>
        </div>
      </div>

      <div className={`container ${settings.enableGlassEffect ? 'glass-container' : 'solid-container'}`}>
        <div className="main-panel">
          {/* 番茄钟计时器 */}
          <div className={`pomodoro-container ${settings.enableGlassEffect ? 'glass-panel' : 'solid-panel'}`}>
            <div className="timer-display">
              {/* 水波纹效果 */}
              {isRunning && settings.enableAnimations && (
                <div className="ripple-container">
                  <div className="ripple"></div>
                  <div className="ripple"></div>
                  <div className="ripple"></div>
                  <div className="ripple"></div>
                </div>
              )}
              
              <div className="timer-circle">
                <svg className="timer-svg" viewBox="0 0 100 100">
                  <circle className="timer-circle-bg" cx="50" cy="50" r="45"></circle>
                  <circle
                    className="timer-progress"
                    cx="50"
                    cy="50"
                    r="45"
                    strokeDasharray="283"
                    strokeDashoffset={283 - getProgress()}
                    style={{ stroke: isWorkTime ? 'var(--work)' : 'var(--break)' }}
                  ></circle>
                </svg>
                <div className="timer-text">
                  <div className="timer-time">{formatTime(timeLeft)}</div>
                  <div
                    className="timer-status"
                    style={{ color: isWorkTime ? 'var(--work)' : 'var(--break)' }}
                  >
                    {isWorkTime ? '工作中' : '休息中'}
                  </div>
                </div>
              </div>
            </div>

            <div className="timer-controls">
              <button className={`btn btn-primary ${settings.enableAnimations ? 'animated-btn' : ''}`} onClick={toggleTimer}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span>{isRunning ? '暂停' : '开始'}</span>
              </button>
              <button className={`btn btn-outline ${settings.enableAnimations ? 'animated-btn' : ''}`} onClick={resetTimer}>
                <RotateCcw size={20} />
                <span>重置</span>
              </button>
            </div>

            {/* 白噪音控制 */}
            <WhiteNoisePlayer />
          </div>

          {/* 统计面板 */}
          <StatsPanel
            completedPomodoros={completedPomodoros}
            completedTasks={completedTasks}
            focusTime={focusTime}
            tasks={tasks}
            checkins={checkins}
            dailyFocusData={dailyFocusData}
            glassEffect={settings.enableGlassEffect}
            animations={settings.enableAnimations}
          />
        </div>

        {/* 侧边面板 */}
        <div className={`tasks-container ${settings.enableGlassEffect ? 'glass-panel' : 'solid-panel'}`}>
          {/* 任务集选择 */}
          <div className="task-groups">
            <div className="task-group-header">
              <h3>任务集</h3>
              <button 
                className={`btn btn-sm btn-primary ${settings.enableAnimations ? 'animated-btn' : ''}`}
                onClick={() => setShowTaskGroupModal(true)}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="task-group-list">
              <div 
                className={`task-group-item ${selectedGroupId === null ? 'active' : ''}`}
                onClick={() => setSelectedGroupId(null)}
              >
                <Folder size={16} />
                <span>默认任务</span>
                <span className="task-count">{tasks.filter(t => !t.groupId).length}</span>
              </div>
              {taskGroups.map(group => (
                <div 
                  key={group.id}
                  className={`task-group-item ${selectedGroupId === group.id ? 'active' : ''}`}
                  style={{ borderLeftColor: group.color }}
                >
                  <div className="task-group-main" onClick={() => setSelectedGroupId(group.id)}>
                    <FolderOpen size={16} />
                    <span>{group.name}</span>
                    <span className="task-count">{tasks.filter(t => t.groupId === group.id).length}</span>
                  </div>
                  <button 
                    className="task-group-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTaskGroup(group.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <TaskManager
            tasks={filteredTasks}
            taskGroups={taskGroups}
            selectedGroupId={selectedGroupId}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            glassEffect={settings.enableGlassEffect}
            animations={settings.enableAnimations}
          />
          
          {/* 早起打卡部分 */}
          <div className={`checkin-section ${settings.enableGlassEffect ? 'glass-section' : 'solid-section'}`}>
            <div className="checkin-header">
              <div>
                <h3>早起打卡</h3>
                <div className="checkin-streak">
                  <span>🔥 连续 {streak} 天</span>
                </div>
              </div>
              <button
                className={`checkin-btn ${settings.enableAnimations ? 'animated-btn' : ''}`}
                onClick={handleCheckin}
                disabled={todayCheckedIn}
              >
                {todayCheckedIn ? '已打卡' : '打卡'}
              </button>
            </div>
          </div>
          
          {/* 目标倒计时组件 */}
          <CountdownWidget 
            glassEffect={settings.enableGlassEffect}
            animations={settings.enableAnimations}
          />
          
          <CalendarWidget 
            checkins={checkins} 
            glassEffect={settings.enableGlassEffect}
            animations={settings.enableAnimations}
          />
        </div>
      </div>

      {/* 全屏翻页时钟 */}
      <FullscreenClock
        show={showFullscreenClock}
        onClose={() => setShowFullscreenClock(false)}
        isTimerRunning={isRunning}
        timerTime={formatTime(timeLeft)}
        timerStatus={isWorkTime ? '工作中' : '休息中'}
        clockStyle={settings.clockStyle}
        enableAnimations={settings.enableAnimations}
      />

      {/* 设置面板 */}
      <SettingsPanel
        show={showSettings}
        workTime={Math.floor(workTime / 60)}
        breakTime={Math.floor(breakTime / 60)}
        settings={settings}
        onWorkTimeChange={(minutes) => setWorkTime(minutes * 60)}
        onBreakTimeChange={(minutes) => setBreakTime(minutes * 60)}
        onSettingsChange={setSettings}
        onExport={exportData}
        onExportTxt={exportDataAsTxt}
        onImport={importData}
        onClose={() => setShowSettings(false)}
      />

      {/* 任务集模态框 */}
      <TaskGroupModal
        show={showTaskGroupModal}
        onSave={addTaskGroup}
        onClose={() => setShowTaskGroupModal(false)}
      />

      {/* 编辑模态框 */}
      <EditModal
        show={showEditModal}
        task={editingTask}
        onSave={saveEditedTask}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
      />

      {/* 通知 */}
      <Notification
        show={notification.show}
        message={notification.message}
      />
    </>
  );
};

export default PomodoroApp;