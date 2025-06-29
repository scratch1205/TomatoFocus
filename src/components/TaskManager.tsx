import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target } from 'lucide-react';

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

interface TaskManagerProps {
  tasks: Task[];
  taskGroups: TaskGroup[];
  selectedGroupId: number | null;
  onAddTask: (text: string, groupId?: number) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  glassEffect: boolean;
  animations: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  taskGroups,
  selectedGroupId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  glassEffect,
  animations
}) => {
  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = () => {
    if (taskInput.trim()) {
      onAddTask(taskInput.trim(), selectedGroupId || undefined);
      setTaskInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentGroupName = () => {
    if (selectedGroupId === null) return '默认任务';
    const group = taskGroups.find(g => g.id === selectedGroupId);
    return group ? group.name : '默认任务';
  };

  return (
    <>
      <div className="task-header">
        <h2><Target size={20} /> {getCurrentGroupName()}</h2>
        <span>{tasks.length} 任务</span>
      </div>

      <div className="task-input">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="添加新任务..."
          className={glassEffect ? 'glass-input' : 'solid-input'}
        />
        <button 
          className={`btn btn-primary ${animations ? 'animated-btn' : ''}`} 
          onClick={handleAddTask}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''} ${animations ? 'animated-task' : ''}`}
            style={{ borderLeftColor: task.color }}
          >
            <input
              type="checkbox"
              className="task-check"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
            />
            <div className="flex-1">
              <div className="task-text">{task.text}</div>
              {task.completed && task.completedAt && (
                <div className="task-time">
                  完成于: {formatTime(task.completedAt)}
                </div>
              )}
            </div>
            <div className="task-color-indicator" style={{ backgroundColor: task.color }}></div>
            <div className="task-actions">
              <button
                className="task-btn"
                onClick={() => onEditTask(task)}
                title="编辑"
              >
                <Edit size={16} />
              </button>
              <button
                className="task-btn"
                onClick={() => onDeleteTask(task.id)}
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            暂无任务，添加一个开始吧！
          </div>
        )}
      </div>
    </>
  );
};

export default TaskManager;