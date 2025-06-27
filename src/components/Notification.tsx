import React from 'react';
import { Check } from 'lucide-react';

interface NotificationProps {
  show: boolean;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ show, message }) => {
  return (
    <div className={`notification ${show ? 'active' : ''}`}>
      <Check size={16} />
      <span>{message}</span>
    </div>
  );
};

export default Notification;