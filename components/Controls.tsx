import React from 'react';
import { Play, Pause, RotateCcw, Video, Sparkles, Download } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onExport: () => void;
  progress: number;
  isGenerating: boolean;
  isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  onReset, 
  onGenerate, 
  onExport,
  progress,
  isGenerating,
  isExporting
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col gap-4">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative group">
        <div 
          className={`h-full transition-all duration-75 ease-linear ${isExporting ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${progress * 100}%` }}
        />
        {/* Hover scrub hint (visual only for now) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            disabled={isExporting}
            className={`p-3 rounded-full text-white transition-colors
                ${isExporting ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'}`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          
          <button
            onClick={onReset}
            disabled={isExporting}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-200 transition-colors disabled:opacity-50"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button
            onClick={onExport}
            disabled={isGenerating || isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${isExporting 
                ? 'bg-red-900/50 text-red-300 animate-pulse cursor-wait' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            title="Download Video"
          >
            {isExporting ? <Video size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? "Recording..." : "Export Video"}
          </button>

           <button
            onClick={onGenerate}
            disabled={isGenerating || isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${isGenerating 
                ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
              }`}
          >
            <Sparkles size={16} />
            {isGenerating ? "Dreaming..." : "Generate AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
