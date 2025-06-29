import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target, Folder, FolderOpen } from 'lucide-react';

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
  onAddTaskGroup: (name: string) => void;
  onDeleteTaskGroup: (id: number) => void;
  onSelectGroup: (id: number | null) => void;
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
  onAddTaskGroup,
  onDeleteTaskGroup,
  onSelectGroup,
  glassEffect,
  animations
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupInput, setGroupInput] = useState('');

  const handleAddTask = () => {
    if (taskInput.trim()) {
      onAddTask(taskInput.trim(), selectedGroupId || undefined);
      setTaskInput('');
    }
  };

  const handleAddGroup = () => {
    if (groupInput.trim()) {
      onAddTaskGroup(groupInput.trim());
      setGroupInput('');
      setShowGroupModal(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleGroupKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    } else if (e.key === 'Escape') {
      setShowGroupModal(false);
      setGroupInput('');
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

  const filteredTasks = selectedGroupId 
    ? tasks.filter(task => task.groupId === selectedGroupId)
    : tasks.filter(task => !task.groupId);

  return (
    <div className="task-manager-container">
      {/* 任务集选择 */}
      <div className="task-groups-section">
        <div className="task-group-header">
          <h3>任务集</h3>
          <button 
            className={`btn btn-sm btn-primary ${animations ? 'animated-btn' : ''}`}
            onClick={() => setShowGroupModal(true)}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="task-group-list">
          <div 
            className={`task-group-item ${selectedGroupId === null ? 'active' : ''}`}
            onClick={() => onSelectGroup(null)}
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
              <div className="task-group-main" onClick={() => onSelectGroup(group.id)}>
                <FolderOpen size={16} />
                <span>{group.name}</span>
                <span className="task-count">{tasks.filter(t => t.groupId === group.id).length}</span>
              </div>
              <button 
                className="task-group-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTaskGroup(group.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 任务管理 */}
      <div className="task-section">
        <div className="task-header">
          <h2><Target size={20} /> {getCurrentGroupName()}</h2>
          <span>{filteredTasks.length} 任务</span>
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
          {filteredTasks.map((task) => (
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
          
          {filteredTasks.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              暂无任务，添加一个开始吧！
            </div>
          )}
        </div>
      </div>

      {/* 任务集创建模态框 */}
      {showGroupModal && (
        <div className="group-modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="group-modal" onClick={(e) => e.stopPropagation()}>
            <h3>创建任务集</h3>
            <input
              type="text"
              value={groupInput}
              onChange={(e) => setGroupInput(e.target.value)}
              onKeyDown={handleGroupKeyPress}
              placeholder="输入任务集名称"
              autoFocus
            />
            <div className="group-modal-buttons">
              <button onClick={() => setShowGroupModal(false)}>取消</button>
              <button onClick={handleAddGroup}>创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;