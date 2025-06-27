import React, { useState, useEffect, useRef } from 'react';
import { Clock, Settings, BarChart3, Music, Upload, Download, Play, Pause, RotateCcw, Plus, Edit, Trash2, Check, X, Calendar, Target } from 'lucide-react';
import StatsPanel from './StatsPanel';
import TaskManager from './TaskManager';
import CalendarWidget from './CalendarWidget';
import SettingsPanel from './SettingsPanel';
import EditModal from './EditModal';
import WhiteNoisePlayer from './WhiteNoisePlayer';
import Notification from './Notification';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  created: Date;
  completedAt: Date | null;
}

interface CheckinData {
  date: string;
  time: string;
}

interface AppData {
  tasks: Task[];
  completedPomodoros: number;
  focusTime: number;
  completedTasks: number;
  workTime: number;
  breakTime: number;
  checkins: CheckinData[];
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Task states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Check-in states
  const [checkins, setCheckins] = useState<CheckinData[]>([]);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pomodoroAppData');
    if (savedData) {
      try {
        const data: AppData = JSON.parse(savedData);
        setTasks(data.tasks.map(task => ({
          ...task,
          created: new Date(task.created),
          completedAt: task.completedAt ? new Date(task.completedAt) : null
        })));
        setCompletedPomodoros(data.completedPomodoros || 0);
        setFocusTime(data.focusTime || 0);
        setCompletedTasks(data.completedTasks || 0);
        setWorkTime(data.workTime || 25 * 60);
        setBreakTime(data.breakTime || 5 * 60);
        setCheckins(data.checkins || []);
        
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
      completedPomodoros,
      focusTime,
      completedTasks,
      workTime,
      breakTime,
      checkins
    };
    localStorage.setItem('pomodoroAppData', JSON.stringify(data));
  }, [tasks, completedPomodoros, focusTime, completedTasks, workTime, breakTime, checkins]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
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
  }, [isRunning, timeLeft, isWorkTime, workTime, breakTime]);

  // Update timeLeft when work/break time changes
  useEffect(() => {
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

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      created: new Date(),
      completedAt: null
    };
    setTasks([...tasks, newTask]);
    showNotificationMessage('任务已添加');
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
      completedPomodoros,
      focusTime,
      completedTasks,
      workTime,
      breakTime,
      checkins
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotificationMessage('数据已导出');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: AppData = JSON.parse(e.target?.result as string);
          setTasks(data.tasks.map(task => ({
            ...task,
            created: new Date(task.created),
            completedAt: task.completedAt ? new Date(task.completedAt) : null
          })));
          setCompletedPomodoros(data.completedPomodoros || 0);
          setFocusTime(data.focusTime || 0);
          setCompletedTasks(data.completedTasks || 0);
          setWorkTime(data.workTime || 25 * 60);
          setBreakTime(data.breakTime || 5 * 60);
          setCheckins(data.checkins || []);
          
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

  return (
    <>
      {/* Hidden audio for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBzWOzvLJe" type="audio/wav" />
      </audio>

      {/* macOS风格顶部任务栏 */}
      <div className="macos-dock">
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
          className={`dock-item ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={24} />
          <span className="tooltip">设置</span>
        </div>
      </div>

      <div className="container">
        <div className="main-panel">
          {/* 番茄钟计时器 */}
          <div className="pomodoro-container">
            <div className="timer-display">
              {/* 水波纹效果 */}
              {isRunning && (
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
              <button className="btn btn-primary" onClick={toggleTimer}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span>{isRunning ? '暂停' : '开始'}</span>
              </button>
              <button className="btn btn-outline" onClick={resetTimer}>
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
          />
        </div>

        {/* 侧边面板 */}
        <div className="tasks-container">
          <TaskManager
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
          />
          
          {/* 早起打卡部分 */}
          <div className="checkin-section">
            <div className="checkin-header">
              <div>
                <h3>早起打卡</h3>
                <div className="checkin-streak">
                  <span>🔥 连续 {streak} 天</span>
                </div>
              </div>
              <button
                className="checkin-btn"
                onClick={handleCheckin}
                disabled={todayCheckedIn}
              >
                {todayCheckedIn ? '已打卡' : '打卡'}
              </button>
            </div>
          </div>
          
          <CalendarWidget checkins={checkins} />
        </div>
      </div>

      {/* 设置面板 */}
      <SettingsPanel
        show={showSettings}
        workTime={Math.floor(workTime / 60)}
        breakTime={Math.floor(breakTime / 60)}
        onWorkTimeChange={(minutes) => setWorkTime(minutes * 60)}
        onBreakTimeChange={(minutes) => setBreakTime(minutes * 60)}
        onExport={exportData}
        onImport={importData}
        onClose={() => setShowSettings(false)}
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