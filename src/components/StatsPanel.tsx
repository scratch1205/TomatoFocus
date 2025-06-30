import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Task, CheckinData, Language } from '../types';
import { useTranslation } from '../utils/i18n';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatsPanelProps {
  completedPomodoros: number;
  completedTasks: number;
  focusTime: number;
  tasks: Task[];
  checkins: CheckinData[];
  dailyFocusData: { [key: string]: number };
  glassEffect: boolean;
  animations: boolean;
  language: Language;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  completedPomodoros,
  completedTasks,
  focusTime,
  tasks,
  checkins,
  dailyFocusData,
  glassEffect,
  animations,
  language
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const t = useTranslation(language);

  // Generate weekly focus data from real data
  const getWeeklyFocusData = () => {
    const days = language === 'en' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const data = Array(7).fill(0);
    
    // Get last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      data[6 - i] = Math.floor((dailyFocusData[dateStr] || 0) / 60); // Convert to minutes
    }
    
    return {
      labels: days,
      datasets: [
        {
          label: `${t.focusTime}（${t.minutes}）`,
          data: data,
          backgroundColor: 'rgba(67, 97, 238, 0.8)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1,
          borderRadius: 8,
        }
      ]
    };
  };

  // Generate task completion pie chart data
  const getTaskPieData = () => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    
    return {
      labels: [t.completedTasks, language === 'en' ? 'Pending' : '进行中'],
      datasets: [
        {
          data: [completed, pending],
          backgroundColor: [
            'rgba(76, 201, 240, 0.8)',
            'rgba(255, 107, 107, 0.8)',
          ],
          borderColor: [
            'rgba(76, 201, 240, 1)',
            'rgba(255, 107, 107, 1)',
          ],
          borderWidth: 2,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        }
      }
    },
    scales: chartType === 'bar' ? {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      }
    } : undefined
  };

  return (
    <div className={`data-panel ${glassEffect ? 'glass-panel' : 'solid-panel'}`}>
      <h2><TrendingUp size={20} /> {t.dataAnalysis}</h2>
      
      <div className="stats-container">
        <div className={`stat-card ${animations ? 'animated-card' : ''}`}>
          <div className="stat-value">{completedPomodoros}</div>
          <div className="stat-label">{t.todayPomodoros}</div>
        </div>
        <div className={`stat-card ${animations ? 'animated-card' : ''}`}>
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">{t.completedTasks}</div>
        </div>
        <div className={`stat-card ${animations ? 'animated-card' : ''}`}>
          <div className="stat-value">{Math.floor(focusTime / 60)}m</div>
          <div className="stat-label">{t.focusTime}</div>
        </div>
      </div>

      <div className="chart-tabs">
        <button
          className={`chart-tab ${chartType === 'bar' ? 'active' : ''} ${animations ? 'animated-btn' : ''}`}
          onClick={() => setChartType('bar')}
        >
          <BarChart3 size={16} />
          <span>{t.barChart}</span>
        </button>
        <button
          className={`chart-tab ${chartType === 'pie' ? 'active' : ''} ${animations ? 'animated-btn' : ''}`}
          onClick={() => setChartType('pie')}
        >
          <PieChart size={16} />
          <span>{t.pieChart}</span>
        </button>
      </div>

      <div className={`chart-container ${glassEffect ? 'glass-chart' : 'solid-chart'}`}>
        {chartType === 'bar' ? (
          <Bar data={getWeeklyFocusData()} options={chartOptions} />
        ) : (
          <Pie data={getTaskPieData()} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default StatsPanel;