import React from 'react';
import { Settings, Download, Upload } from 'lucide-react';

interface SettingsPanelProps {
  show: boolean;
  workTime: number;
  breakTime: number;
  onWorkTimeChange: (minutes: number) => void;
  onBreakTimeChange: (minutes: number) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  show,
  workTime,
  breakTime,
  onWorkTimeChange,
  onBreakTimeChange,
  onExport,
  onImport,
  onClose
}) => {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = onImport;
    input.click();
  };

  return (
    <div className={`settings-panel ${show ? 'active' : ''}`}>
      <h2 className="panel-title">
        <Settings size={20} />
        <span>设置</span>
      </h2>

      <div className="setting-group">
        <label className="setting-label">工作时间（分钟）</label>
        <div className="input-group">
          <input
            type="number"
            className="input-field"
            value={workTime}
            onChange={(e) => onWorkTimeChange(parseInt(e.target.value) || 25)}
            min="1"
            max="60"
          />
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">休息时间（分钟）</label>
        <div className="input-group">
          <input
            type="number"
            className="input-field"
            value={breakTime}
            onChange={(e) => onBreakTimeChange(parseInt(e.target.value) || 5)}
            min="1"
            max="30"
          />
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn btn-outline" onClick={onExport}>
          <Download size={16} />
          <span>导出数据</span>
        </button>
        <button className="btn btn-outline" onClick={handleImportClick}>
          <Upload size={16} />
          <span>导入数据</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;