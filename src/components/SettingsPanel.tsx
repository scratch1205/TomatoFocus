import React from 'react';
import { Settings, Download, Upload, Monitor, Sparkles, Eye, FileText, Clock, Palette, Database, Globe } from 'lucide-react';
import { AppSettings, Language, ColorTheme } from '../types';
import { useTranslation, getAvailableLanguages } from '../utils/i18n';

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
  language: Language;
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
  onClose,
  language
}) => {
  const t = useTranslation(language);
  const availableLanguages = getAvailableLanguages();

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

  const colorThemes: { id: ColorTheme; name: string; preview: string }[] = [
    { id: 'blue', name: t.blueTheme, preview: 'blue-theme' },
    { id: 'white', name: t.whiteTheme, preview: 'white-theme' },
    { id: 'green', name: t.greenTheme, preview: 'green-theme' },
    { id: 'purple', name: t.purpleTheme, preview: 'purple-theme' },
    { id: 'orange', name: t.orangeTheme, preview: 'orange-theme' }
  ];

  return (
    <div className={`settings-panel ${show ? 'active' : ''}`}>
      {/* 设置面板头部 */}
      <div className="settings-panel-header">
        <h2 className="panel-title">
          <Settings size={24} />
          <span>{t.settings}</span>
        </h2>
      </div>

      {/* 设置面板内容 */}
      <div className="settings-panel-content">
        {/* 番茄钟设置 */}
        <div className="setting-section">
          <h3 className="section-title">
            <Clock size={20} />
            <span>{t.pomodoroSettings}</span>
          </h3>
          
          <div className="setting-group">
            <label className="setting-label">
              <span>{t.workTime}</span>
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
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t.minutes}</span>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <span>{t.breakTime}</span>
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
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{t.minutes}</span>
            </div>
          </div>
        </div>

        {/* 界面设置 */}
        <div className="setting-section">
          <h3 className="section-title">
            <Palette size={20} />
            <span>{t.interfaceSettings}</span>
          </h3>
          
          <div className="setting-group">
            <label className="setting-label">
              <Monitor size={18} />
              <span>{t.fullscreen}</span>
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="fullscreen-toggle"
                checked={settings.enableFullscreen}
                onChange={(e) => updateSetting('enableFullscreen', e.target.checked)}
              />
              <label htmlFor="fullscreen-toggle" className="toggle-slider"></label>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <Eye size={18} />
              <span>{t.glassEffect}</span>
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="glass-toggle"
                checked={settings.enableGlassEffect}
                onChange={(e) => updateSetting('enableGlassEffect', e.target.checked)}
              />
              <label htmlFor="glass-toggle" className="toggle-slider"></label>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <Sparkles size={18} />
              <span>{t.animations}</span>
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="animations-toggle"
                checked={settings.enableAnimations}
                onChange={(e) => updateSetting('enableAnimations', e.target.checked)}
              />
              <label htmlFor="animations-toggle" className="toggle-slider"></label>
            </div>
          </div>

          <div className="setting-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <label className="setting-label" style={{ marginBottom: '15px' }}>
              <span>{t.clockStyle}</span>
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
                <span>{t.digitalClock}</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="clockStyle"
                  value="flip"
                  checked={settings.clockStyle === 'flip'}
                  onChange={(e) => updateSetting('clockStyle', e.target.value)}
                />
                <span>{t.flipClock}</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="clockStyle"
                  value="analog"
                  checked={settings.clockStyle === 'analog'}
                  onChange={(e) => updateSetting('clockStyle', e.target.value)}
                />
                <span>{t.analogClock}</span>
              </label>
            </div>
          </div>

          <div className="setting-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <label className="setting-label" style={{ marginBottom: '15px' }}>
              <span>{t.colorTheme}</span>
            </label>
            <div className="theme-selector">
              {colorThemes.map((theme) => (
                <div 
                  key={theme.id}
                  className={`theme-option ${settings.colorTheme === theme.id ? 'active' : ''}`}
                  onClick={() => updateSetting('colorTheme', theme.id)}
                >
                  <div className={`theme-preview ${theme.preview}`}>
                    <div className="theme-circle"></div>
                    <div className="theme-circle"></div>
                    <div className="theme-circle"></div>
                  </div>
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="setting-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <label className="setting-label" style={{ marginBottom: '15px' }}>
              <Globe size={18} />
              <span>{t.language}</span>
            </label>
            <div className="language-selector">
              {availableLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language-option ${settings.language === lang.code ? 'active' : ''}`}
                  onClick={() => updateSetting('language', lang.code)}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="setting-section">
          <h3 className="section-title">
            <Database size={20} />
            <span>{t.dataManagement}</span>
          </h3>
          
          <div className="export-buttons">
            <button className="btn btn-outline" onClick={onExport}>
              <Download size={18} />
              <span>{t.exportJSON}</span>
            </button>
            <button className="btn btn-outline" onClick={onExportTxt}>
              <FileText size={18} />
              <span>{t.exportTXT}</span>
            </button>
          </div>
          
          <div className="import-section">
            <button className="btn btn-outline" onClick={handleImportClick}>
              <Upload size={18} />
              <span>{t.importData}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;