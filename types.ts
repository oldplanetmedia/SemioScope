export interface SemioticSign {
  signifier: string;
  signified: string;
  category: 'object' | 'lighting' | 'color' | 'composition' | 'gesture';
}

export interface FilmAnalysis {
  filmTitleGuess: string;
  directorGuess?: string;
  yearGuess?: string;
  visualContext: {
    composition: string;
    lighting: string;
    colorPalette: string[];
  };
  denotation: string; // The literal description
  connotation: string; // The cultural/emotional associations
  signs: SemioticSign[];
  myth: string; // The broader ideological meaning (Barthes)
  mood: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: FilmAnalysis | null;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageData: string; // Data URI
  analysis: FilmAnalysis;
}