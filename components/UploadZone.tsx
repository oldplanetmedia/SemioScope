import React, { useCallback, useState } from 'react';
import { Upload, Film, Link } from './Icons';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  onUrlSelected: (url: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, onUrlSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  }, [onImageSelected]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSelected(urlInput.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div 
        className={`relative group w-full border-2 border-dashed rounded-xl p-12 transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-cinema-accent bg-cinema-accent/5 scale-[1.02]' 
            : 'border-cinema-800 hover:border-gray-600 bg-cinema-900/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4 pointer-events-none">
          <div className={`p-4 rounded-full bg-cinema-800 transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
            <Film className={`w-8 h-8 text-gray-300 transition-colors ${isDragging ? 'text-cinema-accent' : ''}`} />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-serif text-gray-100">Upload a Frame</h3>
            <p className="text-sm text-gray-500 font-light">
              Drag and drop a film still, or click to browse.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-2 text-xs text-cinema-accent uppercase tracking-widest font-bold opacity-80">
            <Upload className="w-3 h-3" />
            <span>Analyze Semiotics</span>
          </div>
        </div>
      </div>

      <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-cinema-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-cinema-950 px-2 text-sm text-gray-500 font-serif">or paste URL</span>
          </div>
      </div>

      <form onSubmit={handleUrlSubmit} className="relative flex items-center group">
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Link className="w-5 h-5 text-gray-600 group-focus-within:text-cinema-accent transition-colors" />
          </div>
          <input 
            type="url"
            placeholder="https://..."
            className="w-full bg-cinema-900/30 border border-cinema-800 rounded-full py-3 pl-12 pr-28 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cinema-accent/50 focus:bg-cinema-900 focus:ring-1 focus:ring-cinema-accent transition-all"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!urlInput.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-cinema-800 hover:bg-cinema-700 text-gray-200 text-sm font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
          >
            Analyze
          </button>
      </form>
    </div>
  );
};

export default UploadZone;