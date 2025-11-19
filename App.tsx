
import React, { useState, useCallback, useEffect } from 'react';
import { FilmAnalysis, AnalysisState, HistoryItem } from './types';
import { analyzeFilmStill, fetchImageFromUrl } from './services/geminiService';
import UploadZone from './components/UploadZone';
import AnalysisView from './components/AnalysisView';
import LoadingScreen from './components/LoadingScreen';
import HistorySidebar from './components/HistorySidebar';
import AboutModal from './components/AboutModal';
import { Film, MessageSquareQuote, History, Info } from './components/Icons';

const STORAGE_KEY = 'semioscope_history_v1';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentImageCtx, setCurrentImageCtx] = useState<{base64: string, mimeType: string} | null>(null);
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [isAnalysisSaved, setIsAnalysisSaved] = useState(false);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // About Modal State
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Load History on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save History on Change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Storage quota exceeded. Could not save full history.");
    }
  }, [history]);

  const addToHistory = useCallback((analysis: FilmAnalysis, base64Data: string, mimeType: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageData: `data:${mimeType};base64,${base64Data}`,
      analysis
    };
    
    setHistory(prev => {
      // Keep last 10 items to prevent hitting storage quotas too quickly
      const updated = [newItem, ...prev];
      return updated.slice(0, 10);
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const selectHistoryItem = useCallback((item: HistoryItem) => {
    setImageSrc(item.imageData);
    setAnalysisState({
      isLoading: false,
      error: null,
      data: item.analysis
    });
    setIsAnalysisSaved(true); // Already saved since it's from history
    setCurrentImageCtx(null); // No raw base64 context needed since we can't re-save existing item easily
    setIsHistoryOpen(false);
  }, []);

  const processAnalysis = async (base64Data: string, mimeType: string) => {
      setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));
      setIsAnalysisSaved(false);
      setCurrentImageCtx({ base64: base64Data, mimeType });

      try {
          const result = await analyzeFilmStill(base64Data, mimeType);
          setAnalysisState({
            isLoading: false,
            error: null,
            data: result
          });
      } catch (err) {
          console.error(err);
          setAnalysisState({
            isLoading: false,
            error: "Failed to analyze the image. Please try again.",
            data: null
          });
      }
  };

  const handleImageSelected = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      await processAnalysis(base64Data, file.type);
    };
    reader.onerror = () => {
      setAnalysisState({ isLoading: false, error: "Failed to read file.", data: null });
    };
  }, []);

  const handleUrlSelected = useCallback(async (url: string) => {
      setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
          const { mimeType, data } = await fetchImageFromUrl(url);
          setImageSrc(`data:${mimeType};base64,${data}`);
          await processAnalysis(data, mimeType);
      } catch (error) {
          console.error(error);
          setAnalysisState({
              isLoading: false,
              error: "Could not fetch image from URL. Check CORS or try another link.",
              data: null
          });
      }
  }, []);

  const handleSaveAnalysis = useCallback(() => {
    if (analysisState.data && currentImageCtx) {
      addToHistory(analysisState.data, currentImageCtx.base64, currentImageCtx.mimeType);
      setIsAnalysisSaved(true);
    }
  }, [analysisState.data, currentImageCtx, addToHistory]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setAnalysisState({
      isLoading: false,
      error: null,
      data: null
    });
    setCurrentImageCtx(null);
    setIsAnalysisSaved(false);
  }, []);

  return (
    <div className="min-h-screen bg-cinema-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cinema-900 to-cinema-950 text-gray-200 font-sans selection:bg-cinema-accent selection:text-white overflow-x-hidden flex flex-col">
      
      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelect={selectHistoryItem}
        onDelete={deleteHistoryItem}
      />

      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Header */}
      <header className="border-b border-cinema-800 bg-cinema-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={handleReset}>
            <div className="p-1.5 bg-cinema-accent rounded">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl tracking-wide">SemioScope</span>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
              <span>Visual Syntax Analysis</span>
              <span>Powered by Gemini 2.5</span>
            </div>
            <div className="w-px h-4 bg-cinema-800 hidden md:block"></div>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-cinema-800/50"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cinema-accent text-[9px] font-bold text-white">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        
        {/* Intro Hero - Only show if no image selected */}
        {!imageSrc && (
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h1 className="text-5xl font-serif text-white tracking-tight leading-tight">
              Decode the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-accent to-orange-500">Visual Language</span>
              <br />of Cinema
            </h1>
            <p className="text-gray-400 text-lg font-light">
              Upload a film still to uncover its hidden <br className="md:hidden" />
              semiotic layers, <br className="hidden md:inline" />
              from denotative signals <br className="md:hidden" />
              to deep ideological myths.
            </p>
          </div>
        )}

        {/* Error State */}
        {analysisState.error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-800/50 text-red-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <MessageSquareQuote className="w-5 h-5"/>
              <span>{analysisState.error}</span>
            </div>
            <button onClick={() => setAnalysisState(prev => ({...prev, error: null}))} className="hover:text-white underline text-sm">Dismiss</button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="transition-all duration-500">
          {!imageSrc && !analysisState.isLoading && (
            <UploadZone 
              onImageSelected={handleImageSelected} 
              onUrlSelected={handleUrlSelected}
            />
          )}

          {analysisState.isLoading && imageSrc && (
            <div className="flex flex-col items-center py-20">
              {/* Show blurred preview while loading */}
              <div className="w-64 h-36 rounded-lg overflow-hidden mb-8 opacity-50 grayscale relative shadow-2xl">
                 <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-cinema-950/50" />
                 <div className="absolute inset-0 ring-1 ring-cinema-accent/30 rounded-lg animate-pulse" />
              </div>
              <LoadingScreen />
            </div>
          )}

          {!analysisState.isLoading && analysisState.data && imageSrc && (
            <AnalysisView 
              data={analysisState.data} 
              imageSrc={imageSrc}
              onReset={handleReset}
              onSave={handleSaveAnalysis}
              isSaved={isAnalysisSaved}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-cinema-800 py-8 mt-auto bg-cinema-950/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
          <div className="flex items-center gap-4">
             <span>© {new Date().getFullYear()} SemioScope</span>
             <span className="text-cinema-800">•</span>
             <button 
               onClick={() => setIsAboutOpen(true)}
               className="flex items-center gap-1.5 text-gray-500 hover:text-cinema-accent transition-colors"
             >
               <Info className="w-3 h-3" />
               <span>About & Theory</span>
             </button>
          </div>
          <p className="font-serif italic text-center md:text-right">"Every image is a sign awaiting a reader."</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
