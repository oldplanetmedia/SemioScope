import React from 'react';
import { Loader2 } from './Icons';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-cinema-accent/20 blur-xl rounded-full"></div>
        <Loader2 className="w-12 h-12 text-cinema-accent animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-lg font-serif text-gray-400 tracking-widest uppercase">Deconstructing Cinema</p>
      <p className="text-xs text-gray-600 mt-2 font-mono">Processing visual syntax...</p>
    </div>
  );
};

export default LoadingScreen;