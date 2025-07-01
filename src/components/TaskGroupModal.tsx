import React, { useState } from 'react';
import { X, Check, Folder } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface TaskGroupModalProps {
  show: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  language: Language;
}

const TaskGroupModal: React.FC<TaskGroupModalProps> = ({
  show,
  onSave,
  onClose,
  language
}) => {
  const [name, setName] = useState('');
  const t = useTranslation(language);

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
      <div className="edit-content large-modal">
        <h2 className="edit-title">
          <Folder size={24} />
          <span>{t.createTaskGroup}</span>
        </h2>
        <div className="modal-body">
          <div className="modal-scroll">
            <div className="form-group">
              <label className="form-label">{t.taskGroupName}</label>
              <input
                type="text"
                className="edit-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={language === 'en' ? 'Enter task group name' : '输入任务集名称'}
                autoFocus
              />
            </div>
          </div>
        </div>
        <div className="edit-buttons">
          <button className="btn btn-outline" onClick={handleClose}>
            <X size={16} />
            <span>{t.cancel}</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            <Check size={16} />
            <span>{t.create}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskGroupModal;