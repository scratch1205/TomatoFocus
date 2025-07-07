import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Settings, BarChart3, Music, Upload, Download, Play, Pause, RotateCcw, Plus, Edit, Trash2, Check, X, Calendar, Target, Maximize, Folder, FolderOpen } from 'lucide-react';
import StatsPanel from './StatsPanel';
import DraggableSidebar from './DraggableSidebar';
import SettingsPanel from './SettingsPanel';
import EditModal from './EditModal';
import TaskGroupModal from './TaskGroupModal';
import WhiteNoisePlayer from './WhiteNoisePlayer';
import MusicPlayer from './MusicPlayer';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import Notification from './Notification';
import FullscreenClock from './FullscreenClock';
import { Task, TaskGroup, CheckinData, AppSettings, AppData, Language, ColorTheme } from '../types';
import { useTranslation } from '../utils/i18n';

// 定义歌曲接口
interface Song {
  id: string;
  song: string;
  singer: string;
  album: string;
  cover: string;
  url: string;
  quality: string;
  interval: string;
}

const PomodoroApp: React.FC = () => {
  // Timer states
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [focusTime, setFocusTime] = useState(0);

  // UI states
  const [activePanel, setActivePanel] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskGroupModal, setShowTaskGroupModal] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [showFullscreenClock, setShowFullscreenClock] = useState(false);

  // Music states - 移到顶层组件
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicPlaylist, setMusicPlaylist] = useState<Song[]>([]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(-1);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isShuffled, setIsShuffled] = useState(false);

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
    clockStyle: 'flip',
    colorTheme: 'blue',
    language: 'zh-CN'
  });

  // Daily focus data for charts
  const [dailyFocusData, setDailyFocusData] = useState<{ [key: string]: number }>({});

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null); // 音乐播放器的音频元素

  // Get translations
  const t = useTranslation(settings.language);

  // Apply color theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.colorTheme);
  }, [settings.colorTheme]);

  // Apply language to document
  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.title = t.appTitle;
  }, [settings.language, t.appTitle]);

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
          clockStyle: 'flip',
          colorTheme: 'blue',
          language: 'zh-CN'
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

  // Initialize timer when work/break time changes and timer is not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isWorkTime ? workTime : breakTime);
    }
  }, [workTime, breakTime, isWorkTime, isRunning]);

  // 音乐播放器音频事件处理
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    const updateTime = () => setMusicCurrentTime(audio.currentTime);
    const updateDuration = () => setMusicDuration(audio.duration);
    
    const handlePlay = () => {
      setIsMusicPlaying(true);
      if (currentSong) {
        showNotificationMessage(`${settings.language === 'en' ? 'Now playing' : '正在播放'}: ${currentSong.song}`);
      }
    };
    
    const handlePause = () => {
      setIsMusicPlaying(false);
    };
    
    const handleEnded = () => {
      setIsMusicPlaying(false);
      
      // 根据循环模式处理播放结束
      if (repeatMode === 'one') {
        // 单曲循环
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || (repeatMode === 'none' && currentMusicIndex < musicPlaylist.length - 1)) {
        // 列表循环或顺序播放未到最后一首
        playNextSong();
      }
    };
    
    const handleError = () => {
      console.error('播放错误:', audio.error);
      showNotificationMessage(`${settings.language === 'en' ? 'Play error' : '播放错误'}: ${audio.error?.message || settings.language === 'en' ? 'Unknown error' : '未知错误'}`);
      setIsMusicPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong, settings.language, repeatMode, currentMusicIndex, musicPlaylist.length]);

  // 初始化音频设置
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume;
      musicAudioRef.current.muted = isMusicMuted;
    }
  }, [musicVolume, isMusicMuted]);

  // Timer logic - Fixed to prevent infinite loops and reset issues
  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Timer finished
        setIsRunning(false);
        if (isWorkTime) {
          setCompletedPomodoros(prev => prev + 1);
          showNotificationMessage(t.workTimeEnd);
          playSound();
        } else {
          showNotificationMessage(t.breakTimeEnd);
          playSound();
        }
        
        // Switch to next phase
        const nextIsWorkTime = !isWorkTime;
        setIsWorkTime(nextIsWorkTime);
        
        // Set next timer duration
        setTimeout(() => {
          setTimeLeft(nextIsWorkTime ? workTime : breakTime);
        }, 100);
        
        return 0;
      }
      return prev - 1;
    });
    
    if (isWorkTime) {
      setFocusTime(prev => prev + 1);
    }
  }, [isWorkTime, workTime, breakTime, t.workTimeEnd, t.breakTimeEnd]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(tick, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, tick]);

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

  // Fixed toggle timer - no reset on pause
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setTimeLeft(workTime);
    showNotificationMessage(t.timerReset);
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
    showNotificationMessage(t.taskAdded);
  };

  const addTaskGroup = (name: string) => {
    const newGroup: TaskGroup = {
      id: Date.now(),
      name,
      color: generateRandomColor(),
      created: new Date()
    };
    setTaskGroups([...taskGroups, newGroup]);
    showNotificationMessage(t.taskGroupCreated);
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
          showNotificationMessage(t.taskCompleted);
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
    showNotificationMessage(t.taskDeleted);
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
    
    showNotificationMessage(t.taskGroupDeleted);
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
      showNotificationMessage(t.taskUpdated);
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
    showNotificationMessage(t.checkinSuccess);
  };

  // 音乐播放器控制方法
  const loadSong = async (songId: string, index: number) => {
    try {
      const response = await fetch(`https://api.vkeys.cn/v2/music/netease?id=${songId}&quality=4`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setCurrentSong(data.data);
        setCurrentMusicIndex(index);
        
        // 设置新的音频源
        if (musicAudioRef.current) {
          musicAudioRef.current.src = data.data.url;
          musicAudioRef.current.load();
        }
        
        showNotificationMessage(settings.language === 'en' ? 'Music loaded' : '音乐已加载');
      } else {
        showNotificationMessage(data.message || (settings.language === 'en' ? 'Failed to load music' : '获取音乐失败'));
      }
    } catch (error) {
      console.error('获取音乐失败:', error);
      showNotificationMessage(`${settings.language === 'en' ? 'Failed to load music' : '获取音乐失败'}: ${error.message}`);
    }
  };

  const toggleMusicPlay = () => {
    if (!currentSong) {
      showNotificationMessage(settings.language === 'en' ? 'Please select a song first' : '请先选择音乐');
      return;
    }

    if (musicAudioRef.current) {
      if (isMusicPlaying) {
        musicAudioRef.current.pause();
      } else {
        musicAudioRef.current.play().catch(error => {
          console.error('播放失败:', error);
          showNotificationMessage(`${settings.language === 'en' ? 'Play failed' : '播放失败'}: ${error.message}`);
        });
      }
    }
  };

  const playPreviousSong = () => {
    if (musicPlaylist.length === 0 || currentMusicIndex === -1) return;
    
    const newIndex = currentMusicIndex > 0 ? currentMusicIndex - 1 : musicPlaylist.length - 1;
    loadSong(musicPlaylist[newIndex].id, newIndex);
  };

  const playNextSong = () => {
    if (musicPlaylist.length === 0 || currentMusicIndex === -1) return;
    
    let newIndex;
    if (isShuffled) {
      // 随机播放
      do {
        newIndex = Math.floor(Math.random() * musicPlaylist.length);
      } while (newIndex === currentMusicIndex && musicPlaylist.length > 1);
    } else {
      // 顺序播放
      newIndex = currentMusicIndex < musicPlaylist.length - 1 ? currentMusicIndex + 1 : 0;
    }
    
    loadSong(musicPlaylist[newIndex].id, newIndex);
  };

  // Music player handlers
  const handleSongChange = (song: Song | null) => {
    setCurrentSong(song);
  };

  const handlePlayStateChange = (isPlaying: boolean) => {
    setIsMusicPlaying(isPlaying);
    // 如果音乐开始播放且音乐窗口关闭，显示悬浮播放器
    if (isPlaying && !showMusicPlayer && currentSong) {
      setShowFloatingPlayer(true);
    }
  };

  const handlePlaylistChange = (playlist: Song[], currentIndex: number) => {
    setMusicPlaylist(playlist);
    setCurrentMusicIndex(currentIndex);
  };

  const handleMusicPlayerMinimize = () => {
    setShowMusicPlayer(false);
    if (currentSong && isMusicPlaying) {
      setShowFloatingPlayer(true);
    }
  };

  // 悬浮播放器控制方法
  const handleFloatingTogglePlay = () => {
    toggleMusicPlay();
  };

  const handleFloatingPrevious = () => {
    playPreviousSong();
  };

  const handleFloatingNext = () => {
    playNextSong();
  };

  const handleFloatingClose = () => {
    setShowFloatingPlayer(false);
    // 停止音乐播放
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
    }
    setIsMusicPlaying(false);
    setCurrentSong(null);
  };

  const handleFloatingExpand = () => {
    setShowFloatingPlayer(false);
    setShowMusicPlayer(true);
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
    showNotificationMessage(t.dataExported);
  };

  const exportDataAsTxt = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN');
    const timeStr = now.toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'zh-CN');
    
    let txtContent = `${t.appTitle} - ${t.statistics}
${t.exportTXT}: ${dateStr} ${timeStr}
========================================

📊 ${t.statistics}
----------------------------------------
• ${t.completedPomodoros}: ${completedPomodoros}
• ${t.focusTime}: ${Math.floor(focusTime / 3600)}${t.hours}${Math.floor((focusTime % 3600) / 60)}${t.mins}
• ${t.completedTasks}: ${completedTasks}
• ${t.tasks}: ${tasks.length}
• ${t.streak}: ${streak} ${t.days}

⚙️ ${t.settings}
----------------------------------------
• ${t.workTime}: ${Math.floor(workTime / 60)} ${t.minutes}
• ${t.breakTime}: ${Math.floor(breakTime / 60)} ${t.minutes}
• ${t.glassEffect}: ${settings.enableGlassEffect ? '✓' : '✗'}
• ${t.animations}: ${settings.enableAnimations ? '✓' : '✗'}
• ${t.clockStyle}: ${settings.clockStyle === 'digital' ? t.digitalClock : settings.clockStyle === 'flip' ? t.flipClock : t.analogClock}
• ${t.colorTheme}: ${settings.colorTheme}
• ${t.language}: ${settings.language}

`;

    // Task groups info
    if (taskGroups.length > 0) {
      txtContent += `📁 ${t.taskGroups} (${taskGroups.length})
----------------------------------------
`;
      taskGroups.forEach((group, index) => {
        const groupTasks = tasks.filter(task => task.groupId === group.id);
        const completedGroupTasks = groupTasks.filter(task => task.completed).length;
        txtContent += `${index + 1}. ${group.name}
   • ${t.tasks}: ${groupTasks.length}
   • ${t.completedTasks}: ${completedGroupTasks}
   • ${t.create}: ${new Date(group.created).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')}

`;
      });
    }

    // Task details
    txtContent += `📝 ${t.tasks} (${tasks.length})
----------------------------------------
`;

    // Default tasks
    const defaultTasks = tasks.filter(task => !task.groupId);
    if (defaultTasks.length > 0) {
      txtContent += `【${t.defaultTasks}】
`;
      defaultTasks.forEach((task, index) => {
        txtContent += `${index + 1}. ${task.completed ? '✅' : '⏳'} ${task.text}
   • ${task.completed ? t.completedAt : t.tasks}: ${task.completed ? 'completed' : 'pending'}
   • ${t.create}: ${new Date(task.created).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')} ${new Date(task.created).toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
        if (task.completed && task.completedAt) {
          txtContent += `   • ${t.completedAt}: ${new Date(task.completedAt).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')} ${new Date(task.completedAt).toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
        }
        txtContent += '\n';
      });
    }

    // Tasks in groups
    taskGroups.forEach(group => {
      const groupTasks = tasks.filter(task => task.groupId === group.id);
      if (groupTasks.length > 0) {
        txtContent += `【${group.name}】
`;
        groupTasks.forEach((task, index) => {
          txtContent += `${index + 1}. ${task.completed ? '✅' : '⏳'} ${task.text}
   • ${task.completed ? t.completedAt : t.tasks}: ${task.completed ? 'completed' : 'pending'}
   • ${t.create}: ${new Date(task.created).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')} ${new Date(task.created).toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
          if (task.completed && task.completedAt) {
            txtContent += `   • ${t.completedAt}: ${new Date(task.completedAt).toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')} ${new Date(task.completedAt).toLocaleTimeString(settings.language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
`;
          }
          txtContent += '\n';
        });
      }
    });

    // Check-in records
    if (checkins.length > 0) {
      txtContent += `🌅 ${t.checkin} (${checkins.length})
----------------------------------------
`;
      const sortedCheckins = [...checkins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      sortedCheckins.forEach((checkin, index) => {
        const checkinDate = new Date(checkin.date);
        txtContent += `${index + 1}. ${checkinDate.toLocaleDateString(settings.language === 'en' ? 'en-US' : 'zh-CN')} ${checkin.time}
`;
      });
      txtContent += '\n';
    }

    txtContent += `
========================================
${t.dataExported} - ${t.appTitle}
`;

    const dataBlob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${t.appTitle}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotificationMessage(t.dataExported);
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
            clockStyle: 'flip',
            colorTheme: 'blue',
            language: 'zh-CN'
          });
          setDailyFocusData(data.dailyFocusData || {});
          
          // Check if today is already checked in
          const today = new Date().toDateString();
          const todayCheckin = data.checkins?.find(c => new Date(c.date).toDateString() === today);
          setTodayCheckedIn(!!todayCheckin);
          
          calculateStreak(data.checkins || []);
          showNotificationMessage(t.dataImported);
        } catch (error) {
          console.error('Import error:', error);
          showNotificationMessage(t.importFailed);
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

      {/* 音乐播放器的音频元素 - 移到顶层 */}
      <audio ref={musicAudioRef} />

      {/* macOS风格顶部任务栏 */}
      <div className={`macos-dock ${settings.enableGlassEffect ?'glass-effect' : 'solid-bg'} ${settings.enableAnimations ? 'animated' : ''}`}>
        <div
          className={`dock-item ${activePanel === 'pomodoro' ? 'active' : ''}`}
          onClick={() => setActivePanel('pomodoro')}
        >
          <Clock size={24} />
          <span className="tooltip">{t.appTitle}</span>
        </div>
        <div
          className={`dock-item ${activePanel === 'tasks' ? 'active' : ''}`}
          onClick={() => setActivePanel('tasks')}
        >
          <Target size={24} />
          <span className="tooltip">{t.tasks}</span>
        </div>
        <div
          className={`dock-item ${activePanel === 'stats' ? 'active' : ''}`}
          onClick={() => setActivePanel('stats')}
        >
          <BarChart3 size={24} />
          <span className="tooltip">{t.statistics}</span>
        </div>
        <div
          className={`dock-item ${showMusicPlayer ? 'active' : ''}`}
          onClick={() => setShowMusicPlayer(true)}
        >
          <Music size={24} />
          <span className="tooltip">{settings.language === 'en' ? 'Music Player' : '音乐播放器'}</span>
        </div>
        <div
          className={`dock-item ${showFullscreenClock ? 'active' : ''}`}
          onClick={() => setShowFullscreenClock(true)}
        >
          <Maximize size={24} />
          <span className="tooltip">{t.fullscreenClock}</span>
        </div>
        <div
          className={`dock-item ${showSettings ? 'active' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={24} />
          <span className="tooltip">{t.settings}</span>
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
                    {isWorkTime ? t.working : t.resting}
                  </div>
                </div>
              </div>
            </div>

            <div className="timer-controls">
              <button className={`btn btn-primary ${settings.enableAnimations ? 'animated-btn' : ''}`} onClick={toggleTimer}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                <span>{isRunning ? t.pause : t.start}</span>
              </button>
              <button className={`btn btn-outline ${settings.enableAnimations ? 'animated-btn' : ''}`} onClick={resetTimer}>
                <RotateCcw size={20} />
                <span>{t.reset}</span>
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
            language={settings.language}
          />
        </div>

        {/* 可拖拽的侧边栏 */}
        <DraggableSidebar
          tasks={tasks}
          taskGroups={taskGroups}
          selectedGroupId={selectedGroupId}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
          onAddTaskGroup={addTaskGroup}
          onDeleteTaskGroup={deleteTaskGroup}
          onSelectGroup={setSelectedGroupId}
          checkins={checkins}
          todayCheckedIn={todayCheckedIn}
          streak={streak}
          onCheckin={handleCheckin}
          glassEffect={settings.enableGlassEffect}
          animations={settings.enableAnimations}
          language={settings.language}
        />
      </div>

      {/* 全屏翻页时钟 */}
      <FullscreenClock
        show={showFullscreenClock}
        onClose={() => setShowFullscreenClock(false)}
        isTimerRunning={isRunning}
        timerTime={formatTime(timeLeft)}
        timerStatus={isWorkTime ? t.working : t.resting}
        clockStyle={settings.clockStyle}
        enableAnimations={settings.enableAnimations}
        language={settings.language}
      />

      {/* 音乐播放器 */}
      <MusicPlayer
        show={showMusicPlayer}
        onClose={() => setShowMusicPlayer(false)}
        glassEffect={settings.enableGlassEffect}
        animations={settings.enableAnimations}
        language={settings.language}
        onMinimize={handleMusicPlayerMinimize}
        onSongChange={handleSongChange}
        onPlayStateChange={handlePlayStateChange}
        onPlaylistChange={handlePlaylistChange}
        // 传递音频引用和控制方法
        audioRef={musicAudioRef}
        loadSong={loadSong}
        togglePlay={toggleMusicPlay}
        playPrevious={playPreviousSong}
        playNext={playNextSong}
        currentSong={currentSong}
        isPlaying={isMusicPlaying}
        playlist={musicPlaylist}
        currentIndex={currentMusicIndex}
        volume={musicVolume}
        setVolume={setMusicVolume}
        isMuted={isMusicMuted}
        setIsMuted={setIsMusicMuted}
        currentTime={musicCurrentTime}
        duration={musicDuration}
        repeatMode={repeatMode}
        setRepeatMode={setRepeatMode}
        isShuffled={isShuffled}
        setIsShuffled={setIsShuffled}
      />

      {/* 悬浮音乐播放器 */}
      <FloatingMusicPlayer
        show={showFloatingPlayer}
        currentSong={currentSong}
        isPlaying={isMusicPlaying}
        onTogglePlay={handleFloatingTogglePlay}
        onPrevious={handleFloatingPrevious}
        onNext={handleFloatingNext}
        onClose={handleFloatingClose}
        onExpand={handleFloatingExpand}
        language={settings.language}
        glassEffect={settings.enableGlassEffect}
        animations={settings.enableAnimations}
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
        language={settings.language}
      />

      {/* 任务集模态框 */}
      <TaskGroupModal
        show={showTaskGroupModal}
        onSave={addTaskGroup}
        onClose={() => setShowTaskGroupModal(false)}
        language={settings.language}
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
        language={settings.language}
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