import React, { useState, useEffect } from 'react';
import { Target, Calendar, Clock, Edit, Trash2, Plus, Star, X } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface CountdownEvent {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  color: string;
  category: 'exam' | 'work' | 'personal' | 'holiday' | 'other';
  created: Date;
}

interface CountdownWidgetProps {
  glassEffect: boolean;
  animations: boolean;
  language: Language;
}

const CountdownWidget: React.FC<CountdownWidgetProps> = ({ glassEffect, animations, language }) => {
  const [countdowns, setCountdowns] = useState<CountdownEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState<CountdownEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = useTranslation(language);

  // 预设的励志目标
  const getPresetGoals = () => [
    { title: t.examCountdown, description: t.examCountdownDesc, category: 'exam' as const, days: 100 },
    { title: t.graduateExam, description: t.graduateExamDesc, category: 'exam' as const, days: 200 },
    { title: t.projectDeadline, description: t.projectDeadlineDesc, category: 'work' as const, days: 30 },
    { title: t.newYearGoal, description: t.newYearGoalDesc, category: 'personal' as const, days: 365 },
    { title: t.springFestival, description: t.springFestivalDesc, category: 'holiday' as const, days: 60 },
  ];

  const categoryColors = {
    exam: '#ff6b6b',
    work: '#4ecdc4', 
    personal: '#45b7d1',
    holiday: '#f39c12',
    other: '#9b59b6'
  };

  const categoryIcons = {
    exam: '📚',
    work: '💼',
    personal: '🎯',
    holiday: '🎉',
    other: '⭐'
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'exam': return t.exam;
      case 'work': return t.work;
      case 'personal': return t.personal;
      case 'holiday': return t.holiday;
      default: return t.other;
    }
  };

  // 加载数据
  useEffect(() => {
    const savedCountdowns = localStorage.getItem('countdownEvents');
    if (savedCountdowns) {
      try {
        const data = JSON.parse(savedCountdowns);
        setCountdowns(data.map((item: any) => ({
          ...item,
          targetDate: new Date(item.targetDate),
          created: new Date(item.created)
        })));
      } catch (error) {
        console.error('Error loading countdown data:', error);
      }
    }
  }, []);

  // 保存数据
  useEffect(() => {
    localStorage.setItem('countdownEvents', JSON.stringify(countdowns));
  }, [countdowns]);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addCountdown = (countdown: Omit<CountdownEvent, 'id' | 'created'>) => {
    const newCountdown: CountdownEvent = {
      ...countdown,
      id: Date.now(),
      created: new Date()
    };
    setCountdowns([...countdowns, newCountdown]);
  };

  const deleteCountdown = (id: number) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
  };

  const editCountdown = (countdown: CountdownEvent) => {
    setEditingCountdown(countdown);
    setShowAddModal(true);
  };

  const updateCountdown = (updatedCountdown: Omit<CountdownEvent, 'id' | 'created'>) => {
    if (editingCountdown) {
      setCountdowns(countdowns.map(c => 
        c.id === editingCountdown.id 
          ? { ...c, ...updatedCountdown }
          : c
      ));
      setEditingCountdown(null);
    }
  };

  const calculateTimeLeft = (targetDate: Date) => {
    const now = currentTime.getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  };

  const addPresetGoal = (preset: ReturnType<typeof getPresetGoals>[0]) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + preset.days);
    
    addCountdown({
      title: preset.title,
      description: preset.description,
      targetDate,
      color: categoryColors[preset.category],
      category: preset.category
    });
  };

  // 排序倒计时：未过期的在前，按剩余时间排序
  const sortedCountdowns = [...countdowns].sort((a, b) => {
    const timeLeftA = calculateTimeLeft(a.targetDate);
    const timeLeftB = calculateTimeLeft(b.targetDate);
    
    if (timeLeftA.isExpired && !timeLeftB.isExpired) return 1;
    if (!timeLeftA.isExpired && timeLeftB.isExpired) return -1;
    
    if (timeLeftA.isExpired && timeLeftB.isExpired) {
      return b.targetDate.getTime() - a.targetDate.getTime();
    }
    
    return a.targetDate.getTime() - b.targetDate.getTime();
  });

  return (
    <>
      <div className={`countdown-widget ${glassEffect ? 'glass-panel' : 'solid-panel'}`}>
        <div className="countdown-header">
          <h3>
            <Target size={20} />
            <span>{t.targetCountdown}</span>
          </h3>
          <button 
            className={`btn btn-sm btn-primary ${animations ? 'animated-btn' : ''}`}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 快速添加预设目标 */}
        {countdowns.length === 0 && (
          <div className="preset-goals">
            <div className="preset-title">{language === 'en' ? 'Quick add goals:' : '快速添加目标：'}</div>
            <div className="preset-grid">
              {getPresetGoals().map((preset, index) => (
                <button
                  key={index}
                  className={`preset-goal-btn ${animations ? 'animated-btn' : ''}`}
                  onClick={() => addPresetGoal(preset)}
                  style={{ borderLeftColor: categoryColors[preset.category] }}
                >
                  <span className="preset-icon">{categoryIcons[preset.category]}</span>
                  <div className="preset-info">
                    <div className="preset-name">{preset.title}</div>
                    <div className="preset-desc">{preset.days}{t.days}{language === 'en' ? ' later' : '后'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 倒计时列表 */}
        <div className="countdown-list">
          {sortedCountdowns.map((countdown) => {
            const timeLeft = calculateTimeLeft(countdown.targetDate);
            return (
              <div
                key={countdown.id}
                className={`countdown-item ${timeLeft.isExpired ? 'expired' : ''} ${animations ? 'animated-card' : ''}`}
                style={{ borderLeftColor: countdown.color }}
              >
                <div className="countdown-main">
                  <div className="countdown-info">
                    <div className="countdown-title">
                      <span className="category-icon">{categoryIcons[countdown.category]}</span>
                      {countdown.title}
                    </div>
                    <div className="countdown-description">{countdown.description}</div>
                    <div className="countdown-target-date">
                      {t.targetTime}: {countdown.targetDate.toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN')} {countdown.targetDate.toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="countdown-display">
                    {timeLeft.isExpired ? (
                      <div className="expired-badge">{t.expired}</div>
                    ) : (
                      <div className="time-blocks">
                        <div className="time-block">
                          <div className="time-value">{timeLeft.days}</div>
                          <div className="time-label">{t.days}</div>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-block">
                          <div className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</div>
                          <div className="time-label">{t.hours}</div>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-block">
                          <div className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                          <div className="time-label">{t.mins}</div>
                        </div>
                        <div className="time-separator">:</div>
                        <div className="time-block">
                          <div className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                          <div className="time-label">{t.secs}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="countdown-actions">
                  <button
                    className="countdown-btn"
                    onClick={() => editCountdown(countdown)}
                    title={t.edit}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="countdown-btn"
                    onClick={() => deleteCountdown(countdown.id)}
                    title={t.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          
          {countdowns.length === 0 && (
            <div className="empty-state">
              <Star size={48} />
              <div className="empty-title">{language === 'en' ? 'No goals set yet' : '还没有设定目标'}</div>
              <div className="empty-desc">{language === 'en' ? 'Add a countdown to motivate yourself!' : '添加一个倒计时来激励自己吧！'}</div>
            </div>
          )}
        </div>
      </div>

      {/* 添加/编辑模态框 */}
      <CountdownModal
        show={showAddModal}
        countdown={editingCountdown}
        onSave={editingCountdown ? updateCountdown : addCountdown}
        onClose={() => {
          setShowAddModal(false);
          setEditingCountdown(null);
        }}
        language={language}
      />
    </>
  );
};

// 倒计时模态框组件
interface CountdownModalProps {
  show: boolean;
  countdown: CountdownEvent | null;
  onSave: (countdown: Omit<CountdownEvent, 'id' | 'created'>) => void;
  onClose: () => void;
  language: Language;
}

const CountdownModal: React.FC<CountdownModalProps> = ({
  show,
  countdown,
  onSave,
  onClose,
  language
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [category, setCategory] = useState<CountdownEvent['category']>('personal');
  const t = useTranslation(language);

  const categoryColors = {
    exam: '#ff6b6b',
    work: '#4ecdc4', 
    personal: '#45b7d1',
    holiday: '#f39c12',
    other: '#9b59b6'
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'exam': return `📚 ${t.exam}`;
      case 'work': return `💼 ${t.work}`;
      case 'personal': return `🎯 ${t.personal}`;
      case 'holiday': return `🎉 ${t.holiday}`;
      default: return `⭐ ${t.other}`;
    }
  };

  useEffect(() => {
    if (countdown) {
      setTitle(countdown.title);
      setDescription(countdown.description);
      setTargetDate(countdown.targetDate.toISOString().split('T')[0]);
      setTargetTime(countdown.targetDate.toTimeString().slice(0, 5));
      setCategory(countdown.category);
    } else {
      setTitle('');
      setDescription('');
      setTargetDate('');
      setTargetTime('');
      setCategory('personal');
    }
  }, [countdown]);

  const handleSave = () => {
    if (title.trim() && targetDate && targetTime) {
      const dateTime = new Date(`${targetDate}T${targetTime}`);
      onSave({
        title: title.trim(),
        description: description.trim(),
        targetDate: dateTime,
        color: categoryColors[category],
        category
      });
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className={`edit-modal ${show ? 'active' : ''}`}>
      <div className="edit-content countdown-modal">
        <h2 className="edit-title">
          <Target size={24} />
          <span>{countdown ? t.editCountdown : t.addCountdown}</span>
        </h2>
        
        <div className="form-group">
          <label>{t.goalTitle}</label>
          <input
            type="text"
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={language === 'en' ? 'Enter goal title' : '输入目标标题'}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>{t.goalDescription}</label>
          <input
            type="text"
            className="edit-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={language === 'en' ? 'Enter goal description (optional)' : '输入目标描述（可选）'}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t.targetDate}</label>
            <input
              type="date"
              className="edit-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>{t.targetTime}</label>
            <input
              type="time"
              className="edit-input"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>{t.goalType}</label>
          <div className="category-grid">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <button
                key={cat}
                className={`category-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat as CountdownEvent['category'])}
                style={{ borderColor: color, backgroundColor: category === cat ? `${color}20` : 'transparent' }}
              >
                <span style={{ color }}>{getCategoryName(cat)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="edit-buttons">
          <button className="btn btn-outline" onClick={onClose}>
            <X size={16} />
            <span>{t.cancel}</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Target size={16} />
            <span>{countdown ? t.update : t.add}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownWidget;