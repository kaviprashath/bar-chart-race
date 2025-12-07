import React, { useState, useEffect } from 'react';
import { RaceData } from '../types';
import { Check, AlertTriangle } from 'lucide-react';

interface DatasetEditorProps {
  data: RaceData;
  onChange: (newData: RaceData) => void;
}

const DatasetEditor: React.FC<DatasetEditorProps> = ({ data, onChange }) => {
  const [jsonString, setJsonString] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJsonString(JSON.stringify(data, null, 2));
  }, [data]);

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(jsonString);
      // Basic validation
      if (!parsed.timeline || !Array.isArray(parsed.timeline)) {
        throw new Error("Missing 'timeline' array.");
      }
      if (!parsed.entities || !Array.isArray(parsed.entities)) {
         throw new Error("Missing 'entities' array.");
      }
      setError(null);
      onChange(parsed);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-300">Data Source (JSON)</h3>
        {error ? (
          <span className="text-xs text-red-400 flex items-center gap-1">
            <AlertTriangle size={12} /> {error}
          </span>
        ) : (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <Check size={12} /> Valid
          </span>
        )}
      </div>
      <textarea
        className="flex-1 w-full bg-[#0d1117] text-slate-300 font-mono text-xs p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={jsonString}
        onChange={(e) => setJsonString(e.target.value)}
        onBlur={handleBlur}
        spellCheck={false}
      />
      <div className="bg-slate-800 px-4 py-2 text-[10px] text-slate-500 border-t border-slate-700">
        Edit JSON directly to update the chart. Ensure format matches the schema.
      </div>
    </div>
  );
};

export default DatasetEditor;
