import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import TaskManager from './TaskManager';
import CalendarWidget from './CalendarWidget';
import CountdownWidget from './CountdownWidget';

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

interface SidebarComponent {
  id: string;
  name: string;
  component: React.ReactNode;
}

interface DraggableSidebarProps {
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
  checkins: CheckinData[];
  todayCheckedIn: boolean;
  streak: number;
  onCheckin: () => void;
  glassEffect: boolean;
  animations: boolean;
}

const DraggableSidebar: React.FC<DraggableSidebarProps> = ({
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
  checkins,
  todayCheckedIn,
  streak,
  onCheckin,
  glassEffect,
  animations
}) => {
  const [componentOrder, setComponentOrder] = useState(['tasks', 'countdown', 'checkin', 'calendar']);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // 保存组件顺序到localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('sidebarComponentOrder');
    if (savedOrder) {
      try {
        setComponentOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error('Error loading component order:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarComponentOrder', JSON.stringify(componentOrder));
  }, [componentOrder]);

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    setDraggedItem(componentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, componentId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(componentId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetId) {
      const newOrder = [...componentOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetId);
      
      // 移除拖拽的项目
      newOrder.splice(draggedIndex, 1);
      // 插入到目标位置
      newOrder.splice(targetIndex, 0, draggedItem);
      
      setComponentOrder(newOrder);
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getComponents = (): SidebarComponent[] => {
    const allComponents: { [key: string]: SidebarComponent } = {
      tasks: {
        id: 'tasks',
        name: '待办事项',
        component: (
          <TaskManager
            tasks={tasks}
            taskGroups={taskGroups}
            selectedGroupId={selectedGroupId}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onAddTaskGroup={onAddTaskGroup}
            onDeleteTaskGroup={onDeleteTaskGroup}
            onSelectGroup={onSelectGroup}
            glassEffect={glassEffect}
            animations={animations}
          />
        )
      },
      countdown: {
        id: 'countdown',
        name: '目标倒计时',
        component: (
          <CountdownWidget
            glassEffect={glassEffect}
            animations={animations}
          />
        )
      },
      checkin: {
        id: 'checkin',
        name: '早起打卡',
        component: (
          <div className={`checkin-section ${glassEffect ? 'glass-section' : 'solid-section'}`}>
            <div className="checkin-header">
              <div>
                <h3>早起打卡</h3>
                <div className="checkin-streak">
                  <span>🔥 连续 {streak} 天</span>
                </div>
              </div>
              <button
                className={`checkin-btn ${animations ? 'animated-btn' : ''}`}
                onClick={onCheckin}
                disabled={todayCheckedIn}
              >
                {todayCheckedIn ? '已打卡' : '打卡'}
              </button>
            </div>
          </div>
        )
      },
      calendar: {
        id: 'calendar',
        name: '日历',
        component: (
          <CalendarWidget 
            checkins={checkins} 
            glassEffect={glassEffect}
            animations={animations}
          />
        )
      }
    };

    return componentOrder.map(id => allComponents[id]).filter(Boolean);
  };

  return (
    <div className={`draggable-sidebar ${glassEffect ? 'glass-panel' : 'solid-panel'}`}>
      {getComponents().map((comp) => (
        <div
          key={comp.id}
          className={`draggable-component ${draggedItem === comp.id ? 'dragging' : ''} ${dragOverItem === comp.id ? 'drag-over' : ''} ${animations ? 'animated' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, comp.id)}
          onDragOver={(e) => handleDragOver(e, comp.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, comp.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="drag-handle">
            <GripVertical size={16} />
            <span className="component-name">{comp.name}</span>
          </div>
          <div className="component-content">
            {comp.component}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableSidebar;