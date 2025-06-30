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
    <div className={`edit-modal ${show ? 'active' : ''}`}>
      <div className="edit-content">
        <h2 className="edit-title">
          <Folder size={24} />
          <span>创建任务集</span>
        </h2>
        <input
          type="text"
          className="edit-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="输入任务集名称"
          autoFocus
        />
        <div className="edit-buttons">
          <button className="btn btn-outline" onClick={handleClose}>
            <X size={16} />
            <span>取消</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>创建</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskGroupModal;