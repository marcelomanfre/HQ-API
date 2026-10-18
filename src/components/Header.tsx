import React from 'react';
import { 
  BookOpen, 
  Download, 
  Upload, 
  Database, 
  Sparkles,
  Layers,
  FileCode2,
  CheckCircle2,
  Eye,
  GitBranch
} from 'lucide-react';
import { MangaScript } from '../types/manga';

interface HeaderProps {
  script: MangaScript | null;
  onSaveDatabase: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpenPreview: () => void;
  isSaving: boolean;
  saveMessage: string | null;
  activeModule: 'canvas' | 'script' | 'json';
  setActiveModule: (module: 'canvas' | 'script' | 'json') => void;
  selectedChapterId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  script,
  onSaveDatabase,
  onExportJson,
  onImportJson,
  onOpenPreview,
  isSaving,
  saveMessage,
  activeModule,
  setActiveModule,
  selectedChapterId
}) => {
  const totalPages = script?.pages?.length || 0;
  const totalPanels = script?.pages?.reduce((acc, p) => acc + (p.panels?.length || 0), 0) || 0;

  return (
    <header className="border-b border-[#2d3139] bg-[#16171d]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <BookOpen className="w-5 h-5 text-black font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-amber-400 font-serif">
                  MESA DE LUZ
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Online
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Projeto: <strong className="text-neutral-300">hq-jesus-app</strong> • Coleção: <strong className="text-neutral-300">cronologia</strong>
              </p>
            </div>
          </div>

          {/* Nav Mode Buttons */}
          <div className="flex items-center bg-[#1c1d25] p-1 rounded-lg border border-[#2d3139]">
            <button
              onClick={() => setActiveModule('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeModule === 'canvas'
                  ? 'bg-amber-500 text-black shadow font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#282a36]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas (Páginas)</span>
              {totalPanels > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-black/30">
                  {totalPanels}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveModule('script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeModule === 'script'
                  ? 'bg-amber-500 text-black shadow font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#282a36]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Módulo Roteiro</span>
            </button>

            <button
              onClick={() => setActiveModule('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeModule === 'json'
                  ? 'bg-amber-500 text-black shadow font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#282a36]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>

          {/* Database & Action Buttons */}
          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {saveMessage}
              </span>
            )}

            {script && totalPanels > 0 && (
              <button
                onClick={onOpenPreview}
                title="Pré-visualizar como Mangá"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#242632] hover:bg-[#303342] text-neutral-200 border border-[#3b3e4f] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Ler HQ</span>
              </button>
            )}

            <button
              onClick={onExportJson}
              disabled={!script}
              title="Exportar JSON do Roteiro"
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#252834] border border-[#2d3139] disabled:opacity-40 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onImportJson}
              title="Importar JSON existente"
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#252834] border border-[#2d3139] transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              onClick={onSaveDatabase}
              disabled={!script || isSaving}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Gravando no Firebase...' : (selectedChapterId ? `Salvar no Firebase (${selectedChapterId})` : 'Salvar no Firebase')}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
