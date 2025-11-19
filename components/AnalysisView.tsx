import React from 'react';
import { FilmAnalysis } from '../types';
import { Eye, Brain, Lightbulb, Palette, Aperture, Save, Check } from './Icons';

interface AnalysisViewProps {
  data: FilmAnalysis;
  imageSrc: string;
  onReset: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data, imageSrc, onReset, onSave, isSaved }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Top Section: Image & Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 relative rounded-lg overflow-hidden shadow-2xl border border-cinema-800 group">
          <img src={imageSrc} alt="Analyzed Frame" className="w-full h-auto object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <p className="text-white font-serif italic">"{data.mood}"</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="border-l-2 border-cinema-accent pl-6 py-2 flex-1">
              <h2 className="text-4xl font-serif text-white mb-2">{data.filmTitleGuess}</h2>
              {data.directorGuess && <p className="text-gray-400 font-light text-lg">dir. {data.directorGuess}</p>}
              {data.yearGuess && <p className="text-gray-500 text-sm mt-1">{data.yearGuess}</p>}
            </div>
            
            {/* Quick Save Action (Desktop) */}
            <button 
              onClick={onSave}
              disabled={isSaved}
              className={`p-3 rounded-full border transition-all duration-300 hidden sm:flex items-center justify-center
                ${isSaved 
                  ? 'bg-green-900/20 border-green-800 text-green-500 cursor-default' 
                  : 'bg-cinema-900 border-cinema-800 text-gray-400 hover:text-cinema-accent hover:border-cinema-accent'
                }`}
              title={isSaved ? "Saved to History" : "Save Analysis"}
            >
              {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="bg-cinema-900/50 rounded-lg p-6 border border-cinema-800">
            <h3 className="text-cinema-gold text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Palette
            </h3>
            <div className="flex gap-4">
              {data.visualContext.colorPalette.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div 
                    className="w-12 h-12 rounded-full shadow-lg border border-white/10 transition-transform hover:scale-110" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Denotation vs Connotation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-cinema-900/30 p-8 rounded-xl border border-cinema-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-300">
            <Eye className="w-5 h-5" />
            <h3 className="font-serif text-xl">Denotation</h3>
          </div>
          <p className="text-gray-400 leading-relaxed font-light">{data.denotation}</p>
        </div>

        <div className="bg-cinema-900/30 p-8 rounded-xl border border-cinema-800 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 text-cinema-accent">
            <Brain className="w-5 h-5" />
            <h3 className="font-serif text-xl">Connotation</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">{data.connotation}</p>
        </div>
      </div>

      {/* Semiotic Signs Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-cinema-800 pb-4">
          <h3 className="text-2xl font-serif text-white flex items-center gap-3">
            <Aperture className="w-6 h-6 text-gray-500" />
            Signs & Symbols
          </h3>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Structural Breakdown</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.signs.map((sign, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg hover:bg-cinema-800/50 transition-colors border border-transparent hover:border-cinema-800">
              <div className="md:w-1/6">
                <span className={`
                  inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                  ${sign.category === 'object' ? 'bg-blue-900/30 text-blue-400' : ''}
                  ${sign.category === 'lighting' ? 'bg-yellow-900/30 text-yellow-400' : ''}
                  ${sign.category === 'color' ? 'bg-purple-900/30 text-purple-400' : ''}
                  ${sign.category === 'composition' ? 'bg-green-900/30 text-green-400' : ''}
                  ${sign.category === 'gesture' ? 'bg-pink-900/30 text-pink-400' : ''}
                `}>
                  {sign.category}
                </span>
              </div>
              <div className="md:w-1/3">
                <p className="text-gray-200 font-medium">{sign.signifier}</p>
                <span className="text-xs text-gray-600 font-mono">Signifier</span>
              </div>
              <div className="hidden md:block text-cinema-800">→</div>
              <div className="md:w-1/3">
                <p className="text-gray-300 italic">{sign.signified}</p>
                <span className="text-xs text-gray-600 font-mono">Signified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Myth / Ideology */}
      <div className="relative bg-gradient-to-r from-cinema-900 to-cinema-950 p-10 rounded-2xl border border-cinema-800 text-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cinema-950 p-2 rounded-full border border-cinema-800">
          <Lightbulb className="w-6 h-6 text-cinema-gold" />
        </div>
        <h3 className="text-cinema-gold font-serif text-2xl pt-4">The Myth</h3>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {data.myth}
        </p>
        <div className="pt-4 border-t border-white/5 max-w-xl mx-auto">
           <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex flex-col">
                <span className="uppercase tracking-widest text-[10px]">Composition</span>
                <span className="text-gray-400">{data.visualContext.composition}</span>
              </div>
              <div className="flex flex-col">
                <span className="uppercase tracking-widest text-[10px]">Lighting</span>
                <span className="text-gray-400">{data.visualContext.lighting}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-12 pb-20">
        <button 
          onClick={onSave}
          disabled={isSaved}
          className={`
            group px-8 py-3 rounded-full border flex items-center gap-2 font-serif tracking-wide transition-all
            ${isSaved 
              ? 'bg-green-900/10 border-green-900/30 text-green-500 cursor-default' 
              : 'border-cinema-800 bg-cinema-900/50 text-gray-300 hover:text-white hover:bg-cinema-800 hover:border-cinema-accent'
            }
          `}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved to History</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 group-hover:text-cinema-accent transition-colors" />
              <span>Save Analysis</span>
            </>
          )}
        </button>

        <button 
          onClick={onReset}
          className="px-8 py-3 rounded-full border border-transparent text-gray-500 hover:text-white hover:bg-cinema-800/50 transition-all font-serif tracking-wide"
        >
          Analyze Another Frame
        </button>
      </div>

    </div>
  );
};

export default AnalysisView;