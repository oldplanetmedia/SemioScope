import React from 'react';
import { X, Brain, Lightbulb, Eye, Aperture } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-cinema-900 border border-cinema-800 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 scrollbar-thin scrollbar-thumb-cinema-800 scrollbar-track-transparent">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-cinema-800 bg-cinema-900/95 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-serif text-white tracking-wide">About SemioScope</h2>
            <p className="text-xs text-cinema-gold uppercase tracking-widest mt-1">Deconstructing the Image</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-10 text-gray-300 leading-relaxed">
          
          {/* Intro Quote */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cinema-accent to-transparent"></div>
            <p className="text-lg font-light pl-6 italic text-gray-400">
              "The image is not a window on the world, but a sign system to be decoded."
            </p>
          </div>

          {/* Theory Section */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-3 text-xl text-white font-serif border-b border-cinema-800/50 pb-2">
              <Brain className="w-5 h-5 text-cinema-gold" />
              Theoretical Framework
            </h3>
            <p className="text-sm text-gray-400">
              SemioScope automates the process of semiotic analysis, applying key concepts from structuralist and post-structuralist theory to break down visual media.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Barthes */}
              <div className="bg-black/20 p-5 rounded-xl border border-cinema-800/50 hover:border-cinema-800 transition-colors">
                <h4 className="text-cinema-accent font-bold uppercase tracking-widest text-xs mb-3">Roland Barthes</h4>
                <p className="text-sm">
                  <strong className="text-gray-200 block mb-1">Denotation vs. Connotation</strong> 
                  We analyze images on two levels. The <em>denotative</em> is the literal description (what is physically shown), while the <em>connotative</em> is the cultural, emotional, or ideological association (what it implies).
                </p>
              </div>

              {/* Saussure */}
              <div className="bg-black/20 p-5 rounded-xl border border-cinema-800/50 hover:border-cinema-800 transition-colors">
                <h4 className="text-cinema-accent font-bold uppercase tracking-widest text-xs mb-3">Ferdinand de Saussure</h4>
                <p className="text-sm">
                  <strong className="text-gray-200 block mb-1">The Sign</strong> 
                  Every element is a Sign composed of the <em>Signifier</em> (the physical form, e.g., the color red) and the <em>Signified</em> (the mental concept, e.g., passion or danger). SemioScope identifies these pairings.
                </p>
              </div>
            </div>

            {/* The Myth */}
            <div className="bg-gradient-to-br from-cinema-950 to-cinema-900 p-5 rounded-xl border border-cinema-800/50">
              <h4 className="text-cinema-gold font-bold uppercase tracking-widest text-xs mb-3">The Myth</h4>
              <p className="text-sm">
                Beyond individual signs lies the <strong className="text-gray-200">Myth</strong>. In semiotics, this refers to the dominant ideologies that an image reinforces or challenges. By naturalizing history, myths make constructed cultural values seem like "common sense."
              </p>
            </div>
          </section>

          {/* AI Section */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-3 text-xl text-white font-serif border-b border-cinema-800/50 pb-2">
              <Aperture className="w-5 h-5 text-blue-400" />
              The Technology
            </h3>
            <p className="text-sm">
              SemioScope utilizes <strong>Google's Gemini 2.5 Flash</strong>, a multimodal AI model capable of advanced visual reasoning. Unlike standard object detection, Gemini is prompted to act as an expert semiotician, applying specific theoretical lenses to interpret cinematography, lighting, and mise-en-scène.
            </p>
            
            <div className="flex items-start gap-4 text-sm bg-blue-950/20 p-4 rounded-lg border border-blue-900/30 text-blue-200/80">
              <Eye className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
              <p>
                <span className="font-bold text-blue-300">Note on Subjectivity:</span> While the AI is powerful, semiotics is inherently subjective. The interpretations provided are synthesized from vast datasets of film theory and criticism but should be viewed as a starting point for your own analysis rather than absolute truth.
              </p>
            </div>
          </section>

          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-gray-600 font-mono">v1.0.0 • SemioScope</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutModal;