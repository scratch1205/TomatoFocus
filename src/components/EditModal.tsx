import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  created: Date;
  completedAt: Date | null;
}

interface EditModalProps {
  show: boolean;
  task: Task | null;
  onSave: (text: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  show,
  task,
  onSave,
  onClose
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (task) {
      setText(task.text);
    }
  }, [task]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      setText('');
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
    setText('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className={`fullscreen-edit-modal ${show ? 'active' : ''}`}>
      <div className="fullscreen-edit-overlay" onClick={handleClose}></div>
      <div className="fullscreen-edit-content">
        <div className="fullscreen-edit-header">
          <h2 className="fullscreen-edit-title">编辑任务</h2>
          <button className="fullscreen-edit-close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="fullscreen-edit-body">
          <div className="edit-form">
            <label className="edit-label">任务内容</label>
            <textarea
              className="fullscreen-edit-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入任务内容..."
              autoFocus
              rows={6}
            />
          </div>
        </div>

        <div className="fullscreen-edit-footer">
          <button className="btn btn-outline btn-large" onClick={handleClose}>
            <X size={20} />
            <span>取消</span>
          </button>
          <button className="btn btn-primary btn-large" onClick={handleSave}>
            <Check size={20} />
            <span>保存</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;