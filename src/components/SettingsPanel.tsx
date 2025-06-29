import React from 'react';
import { Settings, Download, Upload, Monitor, Sparkles, Eye, FileText } from 'lucide-react';

interface AppSettings {
  enableFullscreen: boolean;
  enableGlassEffect: boolean;
  enableAnimations: boolean;
  clockStyle: 'digital' | 'flip' | 'analog';
}

interface SettingsPanelProps {
  show: boolean;
  workTime: number;
  breakTime: number;
  settings: AppSettings;
  onWorkTimeChange: (minutes: number) => void;
  onBreakTimeChange: (minutes: number) => void;
  onSettingsChange: (settings: AppSettings) => void;
  onExport: () => void;
  onExportTxt: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  show,
  workTime,
  breakTime,
  settings,
  onWorkTimeChange,
  onBreakTimeChange,
  onSettingsChange,
  onExport,
  onExportTxt,
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

  const updateSetting = (key: keyof AppSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className={`settings-panel ${show ? 'active' : ''}`}>
      <h2 className="panel-title">
        <Settings size={20} />
        <span>设置</span>
      </h2>

      {/* 番茄钟设置 */}
      <div className="setting-section">
        <h3 className="section-title">番茄钟设置</h3>
        
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
      </div>

      {/* 界面设置 */}
      <div className="setting-section">
        <h3 className="section-title">界面设置</h3>
        
        <div className="setting-group">
          <label className="setting-label">
            <Monitor size={16} />
            <span>浏览器全屏</span>
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enableFullscreen}
              onChange={(e) => updateSetting('enableFullscreen', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            <Eye size={16} />
            <span>毛玻璃效果</span>
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enableGlassEffect}
              onChange={(e) => updateSetting('enableGlassEffect', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            <Sparkles size={16} />
            <span>动画效果</span>
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enableAnimations}
              onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">全屏时钟样式</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="clockStyle"
                value="digital"
                checked={settings.clockStyle === 'digital'}
                onChange={(e) => updateSetting('clockStyle', e.target.value)}
              />
              <span>数字时钟</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="clockStyle"
                value="flip"
                checked={settings.clockStyle === 'flip'}
                onChange={(e) => updateSetting('clockStyle', e.target.value)}
              />
              <span>翻页时钟</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="clockStyle"
                value="analog"
                checked={settings.clockStyle === 'analog'}
                onChange={(e) => updateSetting('clockStyle', e.target.value)}
              />
              <span>模拟时钟</span>
            </label>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="setting-section">
        <h3 className="section-title">数据管理</h3>
        
        <div className="export-buttons">
          <button className="btn btn-outline" onClick={onExport}>
            <Download size={16} />
            <span>导出JSON</span>
          </button>
          <button className="btn btn-outline" onClick={onExportTxt}>
            <FileText size={16} />
            <span>导出TXT</span>
          </button>
        </div>
        
        <div className="import-section">
          <button className="btn btn-outline" onClick={handleImportClick}>
            <Upload size={16} />
            <span>导入数据</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;