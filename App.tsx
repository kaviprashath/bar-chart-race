import React, { useState, useEffect, useRef } from 'react';
import BarChartRace from './components/BarChartRace';
import Controls from './components/Controls';
import DatasetEditor from './components/DatasetEditor';
import ConfigPanel from './components/ConfigPanel';
import { generateDataset } from './services/geminiService';
import { DEFAULT_DATA } from './utils/defaults';
import { RaceData, ChartConfig } from './types';
import { Layout, X, Video } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<RaceData>(DEFAULT_DATA);
  const [config, setConfig] = useState<ChartConfig>({
    duration: 15,
    topN: 10,
    barHeight: 50,
    gap: 20,
    showIcons: true,
    backgroundColor: '#1e293b', 
    textColor: '#f8fafc',
  });

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const pausedProgressRef = useRef<number>(0);
  
  // Recording Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Animation Loop
  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    
    const runtime = time - startTimeRef.current; 
    const totalDurationMs = config.duration * 1000;
    
    const newProgress = (runtime / totalDurationMs) + pausedProgressRef.current;

    if (newProgress >= 1) {
      setProgress(1);
      setIsPlaying(false);
      pausedProgressRef.current = 1;
    } else {
      setProgress(newProgress);
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current !== undefined) {
          cancelAnimationFrame(requestRef.current);
      }
      pausedProgressRef.current = progress;
      if (progress >= 1 && !isExporting) pausedProgressRef.current = 0;
    }

    return () => {
      if (requestRef.current !== undefined) {
          cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying]);

  // Recording Logic Hook
  useEffect(() => {
    if (isExporting && !isPlaying && progress >= 1) {
        // Recording finished naturally
        stopExport();
    }
  }, [isExporting, isPlaying, progress]);

  const handlePlayPause = () => {
    if (progress >= 1) {
        setProgress(0);
        pausedProgressRef.current = 0;
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    pausedProgressRef.current = 0;
  };

  const handleGenerate = async () => {
    const topic = prompt("What topic do you want to visualize? (e.g., 'Richest People 2000-2023' or 'Top CO2 Emitting Countries')");
    if (!topic) return;

    setIsPlaying(false);
    setIsGenerating(true);
    try {
      const newData = await generateDataset(topic);
      setData(newData);
      setProgress(0);
      pausedProgressRef.current = 0;
    } catch (err) {
      alert("Failed to generate data. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const startExport = () => {
    if (!canvasRef.current) {
        alert("Canvas not found");
        return;
    }

    // Capability Checks
    if (typeof MediaRecorder === 'undefined') {
        alert("Video recording is not supported in this browser (MediaRecorder missing).");
        return;
    }
    
    const canvasAny = canvasRef.current as any;
    if (typeof canvasAny.captureStream !== 'function') {
        alert("Video recording is not supported in this browser (captureStream missing).");
        return;
    }
    
    // 1. Reset
    setIsPlaying(false);
    setProgress(0);
    pausedProgressRef.current = 0;
    recordedChunksRef.current = [];

    // 2. Setup Recorder
    try {
        const stream = canvasAny.captureStream(60); // 60 FPS
        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/webm' };
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
             // Fallback
             options = { mimeType: '' }; 
        }

        const recorder = options.mimeType ? new MediaRecorder(stream, options) : new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `datarace-${Date.now()}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
            setIsExporting(false);
        };

        // 3. Start
        setIsExporting(true);
        mediaRecorderRef.current = recorder;
        recorder.start();

        // 4. Play
        setTimeout(() => {
            setIsPlaying(true);
        }, 100);
    } catch (e) {
        console.error("Export failed:", e);
        setIsExporting(false);
        alert("Failed to start video export. Check console for details.");
    }
  };

  const stopExport = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar */}
      <div 
        className={`shrink-0 flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out
          ${showEditor ? 'w-full md:w-[400px] translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}
        `}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Video size={20} className="text-white"/>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">DataRace Studio</h1>
          </div>
          <button onClick={() => setShowEditor(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <section>
             <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Controls</h2>
             <Controls 
               isPlaying={isPlaying} 
               onPlayPause={handlePlayPause} 
               onReset={handleReset} 
               onGenerate={handleGenerate}
               onExport={startExport}
               progress={progress}
               isGenerating={isGenerating}
               isExporting={isExporting}
             />
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Appearance</h2>
            <ConfigPanel config={config} onChange={setConfig} />
          </section>

          <section className="flex-1 flex flex-col min-h-[300px]">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Data</h2>
            <div className="flex-1">
                <DatasetEditor data={data} onChange={setData} />
            </div>
          </section>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative bg-slate-950 flex flex-col">
        {!showEditor && (
            <button 
                onClick={() => setShowEditor(true)}
                className="absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
                <Layout size={20} />
            </button>
        )}
        
        {!showEditor && (
             <button 
                onClick={() => setShowEditor(true)}
                className="md:hidden absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
                <Layout size={20} />
            </button>
        )}

        <div className="flex-1 flex items-center justify-center p-4 md:p-12 overflow-hidden relative">
          
          {/* Aspect Ratio Container (16:9) */}
          <div 
            className="relative w-full max-w-[1280px] aspect-video shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-800"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
             <BarChartRace 
               ref={canvasRef}
               data={data} 
               config={config} 
               progress={progress} 
             />
          </div>
        </div>

        <div className="p-4 text-center text-slate-600 text-xs">
           {isExporting 
             ? "Recording in progress... Please do not switch tabs."
             : "Click 'Export Video' to download a WebM video file."}
        </div>
      </div>
    </div>
  );
};

export default App;