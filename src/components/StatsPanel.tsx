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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

interface StatsPanelProps {
  completedPomodoros: number;
  completedTasks: number;
  focusTime: number;
  tasks: Task[];
  checkins: CheckinData[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  completedPomodoros,
  completedTasks,
  focusTime,
  tasks,
  checkins
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Generate weekly focus data
  const getWeeklyFocusData = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const data = Array(7).fill(0);
    
    // Simulate some data based on current focus time
    const dailyAverage = focusTime / 7;
    data.forEach((_, index) => {
      data[index] = Math.floor(dailyAverage + (Math.random() - 0.5) * dailyAverage * 0.5);
    });
    
    return {
      labels: days,
      datasets: [
        {
          label: '专注时间（分钟）',
          data: data.map(seconds => Math.floor(seconds / 60)),
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
      labels: ['已完成', '进行中'],
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
    <div className="data-panel">
      <h2><TrendingUp size={20} /> 专注数据分析</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{completedPomodoros}</div>
          <div className="stat-label">今日番茄</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">完成任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.floor(focusTime / 60)}m</div>
          <div className="stat-label">专注时间</div>
        </div>
      </div>

      <div className="chart-tabs">
        <button
          className={`chart-tab ${chartType === 'bar' ? 'active' : ''}`}
          onClick={() => setChartType('bar')}
        >
          <BarChart3 size={16} />
          <span>柱状图</span>
        </button>
        <button
          className={`chart-tab ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          <PieChart size={16} />
          <span>饼图</span>
        </button>
      </div>

      <div className="chart-container">
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