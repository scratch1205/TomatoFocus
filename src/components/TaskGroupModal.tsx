import React, { useState } from 'react';
import { X, Check, Folder } from 'lucide-react';

interface TaskGroupModalProps {
  show: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

const TaskGroupModal: React.FC<TaskGroupModalProps> = ({
  show,
  onSave,
  onClose
}) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
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

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className={`fullscreen-edit-modal ${show ? 'active' : ''}`}>
      <div className="fullscreen-edit-overlay" onClick={handleClose}></div>
      <div className="fullscreen-edit-content">
        <div className="fullscreen-edit-header">
          <h2 className="fullscreen-edit-title">
            <Folder size={28} />
            <span>创建任务集</span>
          </h2>
          <button className="fullscreen-edit-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="fullscreen-edit-body">
          <div className="edit-form">
            <label className="edit-label">任务集名称</label>
            <input
              type="text"
              className="fullscreen-edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入任务集名称"
              autoFocus
            />
            <div className="edit-hint">
              任务集可以帮助你更好地组织和管理相关的任务
            </div>
          </div>
        </div>

        <div className="fullscreen-edit-footer">
          <button className="btn btn-outline btn-large" onClick={handleClose}>
            <X size={20} />
            <span>取消</span>
          </button>
          <button className="btn btn-primary btn-large" onClick={handleSave}>
            <Check size={20} />
            <span>创建</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskGroupModal;