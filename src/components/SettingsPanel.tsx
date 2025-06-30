import React from 'react';
import { Settings, Download, Upload, Monitor, Sparkles, Eye, FileText, Clock, Palette, Database } from 'lucide-react';

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
      {/* 设置面板头部 */}
      <div className="settings-panel-header">
        <h2 className="panel-title">
          <Settings size={24} />
          <span>系统设置</span>
        </h2>
      </div>

      {/* 设置面板内容 */}
      <div className="settings-panel-content">
        {/* 番茄钟设置 */}
        <div className="setting-section">
          <h3 className="section-title">
            <Clock size={20} />
            <span>番茄钟设置</span>
          </h3>
          
          <div className="setting-group">
            <label className="setting-label">
              <span>工作时间</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                className="input-field"
                value={workTime}
                onChange={(e) => onWorkTimeChange(parseInt(e.target.value) || 25)}
                min="1"
                max="60"
              />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>分钟</span>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <span>休息时间</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                className="input-field"
                value={breakTime}
                onChange={(e) => onBreakTimeChange(parseInt(e.target.value) || 5)}
                min="1"
                max="30"
              />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>分钟</span>
            </div>
          </div>
        </div>

        {/* 界面设置 */}
        <div className="setting-section">
          <h3 className="section-title">
            <Palette size={20} />
            <span>界面设置</span>
          </h3>
          
          <div className="setting-group">
            <label className="setting-label">
              <Monitor size={18} />
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
              <Eye size={18} />
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
              <Sparkles size={18} />
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

          <div className="setting-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <label className="setting-label" style={{ marginBottom: '15px' }}>
              <span>全屏时钟样式</span>
            </label>
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
          <h3 className="section-title">
            <Database size={20} />
            <span>数据管理</span>
          </h3>
          
          <div className="export-buttons">
            <button className="btn btn-outline" onClick={onExport}>
              <Download size={18} />
              <span>导出JSON</span>
            </button>
            <button className="btn btn-outline" onClick={onExportTxt}>
              <FileText size={18} />
              <span>导出TXT</span>
            </button>
          </div>
          
          <div className="import-section">
            <button className="btn btn-outline" onClick={handleImportClick}>
              <Upload size={18} />
              <span>导入数据</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;