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
    <div className={`edit-modal ${show ? 'active' : ''}`}>
      <div className="edit-content">
        <h2 className="edit-title">编辑任务</h2>
        <input
          type="text"
          className="edit-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="输入任务内容"
          autoFocus
        />
        <div className="edit-buttons">
          <button className="btn btn-outline" onClick={handleClose}>
            <X size={16} />
            <span>取消</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>保存</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;