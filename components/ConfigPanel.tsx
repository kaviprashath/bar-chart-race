import React from 'react';
import { ChartConfig } from '../types';

interface ConfigPanelProps {
  config: ChartConfig;
  onChange: (newConfig: ChartConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof ChartConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
      
      <div className="space-y-1">
        <label className="text-xs text-slate-400 block">Duration (sec)</label>
        <input 
          type="number" 
          value={config.duration}
          onChange={(e) => handleChange('duration', Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 block">Top N Items</label>
        <input 
          type="number" 
          value={config.topN}
          onChange={(e) => handleChange('topN', Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 block">Bar Height (px)</label>
        <input 
          type="number" 
          value={config.barHeight}
          onChange={(e) => handleChange('barHeight', Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 block">Gap (px)</label>
        <input 
          type="number" 
          value={config.gap}
          onChange={(e) => handleChange('gap', Number(e.target.value))}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

       <div className="flex items-center gap-2 pt-4">
        <input 
          type="checkbox"
          id="showIcons"
          checked={config.showIcons}
          onChange={(e) => handleChange('showIcons', e.target.checked)}
          className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-offset-slate-800"
        />
        <label htmlFor="showIcons" className="text-sm text-slate-300 select-none cursor-pointer">Show Icons</label>
      </div>
      
       <div className="space-y-1 pt-2 col-span-2">
        <label className="text-xs text-slate-400 block">Background</label>
        <div className="flex gap-2">
            <input 
            type="color" 
            value={config.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="h-8 w-12 bg-transparent cursor-pointer rounded overflow-hidden"
            />
             <input 
            type="text" 
            value={config.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
        </div>
      </div>

    </div>
  );
};

export default ConfigPanel;
