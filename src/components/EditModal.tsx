import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Task, Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface EditModalProps {
  show: boolean;
  task: Task | null;
  onSave: (text: string) => void;
  onClose: () => void;
  language: Language;
}

const EditModal: React.FC<EditModalProps> = ({
  show,
  task,
  onSave,
  onClose,
  language
}) => {
  const [text, setText] = useState('');
  const t = useTranslation(language);

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
        <h2 className="edit-title">{t.editTask}</h2>
        <input
          type="text"
          className="edit-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={language === 'en' ? 'Enter task content' : '输入任务内容'}
          autoFocus
        />
        <div className="edit-buttons">
          <button className="btn btn-outline" onClick={handleClose}>
            <X size={16} />
            <span>{t.cancel}</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            <span>{t.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;