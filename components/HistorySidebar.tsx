import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Clock, ChevronRight, Film, Search } from './Icons';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onSelect, 
  onDelete 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const { filmTitleGuess, directorGuess, mood, myth } = item.analysis;
      // Searching core fields for matches
      return (
        filmTitleGuess.toLowerCase().includes(query) ||
        (directorGuess && directorGuess.toLowerCase().includes(query)) ||
        mood.toLowerCase().includes(query) ||
        myth.toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery]);

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-cinema-950 border-l border-cinema-800 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-cinema-800 bg-cinema-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-white">History</h2>
              <p className="text-xs text-gray-500">Past deconstructions</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-cinema-800 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search titles, directors, moods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cinema-950 border border-cinema-800 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cinema-accent focus:ring-1 focus:ring-cinema-accent transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
              <Film className="w-12 h-12" />
              <p className="text-sm font-serif">No analyses recorded yet.</p>
            </div>
          ) : filteredItems.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
              <Search className="w-12 h-12" />
              <p className="text-sm font-serif">No matches found.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative flex items-start gap-4 p-3 rounded-xl bg-cinema-900/30 hover:bg-cinema-800/50 border border-cinema-800 hover:border-cinema-accent/50 transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-cinema-800 bg-black">
                  <img 
                    src={item.imageData} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-200 font-serif truncate pr-6 group-hover:text-cinema-accent transition-colors">
                    {item.analysis.filmTitleGuess}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-2 truncate italic">
                    "{item.analysis.mood}"
                  </p>
                </div>

                {/* Actions */}
                <button
                  onClick={(e) => onDelete(item.id, e)}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="absolute bottom-3 right-3 text-cinema-800 group-hover:text-cinema-accent/50 opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cinema-800 bg-cinema-950 text-center">
          <p className="text-[10px] text-gray-600">
            Storage is local to your device.
          </p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;