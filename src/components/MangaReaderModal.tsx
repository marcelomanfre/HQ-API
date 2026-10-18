import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Maximize, 
  Download,
  Share2
} from 'lucide-react';
import { MangaScript } from '../types/manga';

interface MangaReaderModalProps {
  script: MangaScript;
  onClose: () => void;
}

export const MangaReaderModal: React.FC<MangaReaderModalProps> = ({
  script,
  onClose
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const pages = script.pages || [];
  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#121319]">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-serif font-bold text-white text-base tracking-wide">
              {script.title || 'Mesa de Luz • Leitor de Mangá'}
            </h2>
            <p className="text-xs text-neutral-400">
              Página {currentPageIndex + 1} de {pages.length} • Modo de Leitura Seinen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Fechar Leitor</span>
          </button>
        </div>
      </div>

      {/* Main Comic Page Viewer */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-[#1b1c24] border-4 border-black shadow-2xl rounded-lg p-6 md:p-8 space-y-6">
          
          {/* Header da Página no Mangá */}
          <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-2">
            <span className="font-serif text-sm font-bold text-neutral-300 tracking-widest uppercase">
              Capítulo: {script.title}
            </span>
            <span className="font-mono text-xs text-amber-400 font-bold">
              [ PÁGINA {currentPage.pageNumber} ]
            </span>
          </div>

          {/* Grid de Painéis da Página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPage.panels.map((panel, idx) => {
              const dialogues = Array.isArray(panel.dialogue)
                ? panel.dialogue
                : [{ character: 'Narrador', text: String(panel.dialogue), type: 'narration' }];

              return (
                <div
                  key={panel.id || idx}
                  className="bg-black border-2 border-neutral-300 p-3 rounded flex flex-col justify-between space-y-3 shadow"
                >
                  {/* Arte ou Placeholder */}
                  <div className="relative aspect-square w-full bg-[#0a0a0d] border border-neutral-800 rounded overflow-hidden flex items-center justify-center">
                    {panel.imageUrl ? (
                      <img
                        src={panel.imageUrl}
                        alt={`Painel ${panel.panelNumber}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="p-4 text-center">
                        <div className="w-10 h-10 border border-dashed border-neutral-600 rounded-full mx-auto mb-2 flex items-center justify-center text-neutral-600">
                          {panel.panelNumber}
                        </div>
                        <p className="text-[10px] text-neutral-500 italic max-w-[200px]">
                          {panel.imagePrompt.slice(0, 80)}...
                        </p>
                      </div>
                    )}
                    <div className="absolute top-1 left-1 bg-black/80 text-[9px] font-mono text-white px-1.5 py-0.5 rounded">
                      Q{panel.panelNumber}
                    </div>
                  </div>

                  {/* Diálogos / Balões Estilo Seinen */}
                  <div className="space-y-2 pt-1">
                    {dialogues.map((d: any, dIdx: number) => {
                      const isNarrator = d.character?.toLowerCase().includes('narrador');
                      return (
                        <div
                          key={dIdx}
                          className={`p-2 rounded text-xs ${
                            isNarrator
                              ? 'bg-[#1e2029] border-l-2 border-amber-400 text-neutral-300 italic'
                              : 'bg-white text-black font-medium border border-neutral-400 rounded-xl shadow-sm'
                          }`}
                        >
                          <span className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isNarrator ? 'text-amber-400 font-mono' : 'text-neutral-700'}`}>
                            {d.character}
                          </span>
                          <p className="leading-snug">{d.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer da Página */}
          <div className="text-center pt-4 border-t border-neutral-800 text-xs text-neutral-500 font-mono">
            — Fim da Página {currentPage.pageNumber} —
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-center gap-4 py-3 bg-[#121319] border-t border-neutral-800">
        <button
          disabled={currentPageIndex <= 0}
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Página Anterior</span>
        </button>

        <span className="text-xs text-neutral-400 font-mono">
          {currentPageIndex + 1} / {pages.length}
        </span>

        <button
          disabled={currentPageIndex >= pages.length - 1}
          onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold disabled:opacity-40 transition-colors"
        >
          <span>Próxima Página</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
