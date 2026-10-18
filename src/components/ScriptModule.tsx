import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Flame, 
  BookOpen, 
  Layers, 
  Lightbulb,
  CheckCircle,
  RefreshCw,
  Clock,
  ScrollText,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MangaScript } from '../types/manga';
import { dbService, FirebaseChapter } from '../services/dbService';

interface ScriptModuleProps {
  theme: string;
  setTheme: (t: string) => void;
  onGenerateScript: (themeToUse: string, chapterId?: string) => Promise<void>;
  isGenerating: boolean;
  script: MangaScript | null;
  onUpdateScriptMeta: (title: string, synopsis: string) => void;
  onSwitchToCanvas: () => void;
  selectedChapter: FirebaseChapter | null;
  setSelectedChapter: (cap: FirebaseChapter | null) => void;
}

export const ScriptModule: React.FC<ScriptModuleProps> = ({
  theme,
  setTheme,
  onGenerateScript,
  isGenerating,
  script,
  onUpdateScriptMeta,
  onSwitchToCanvas,
  selectedChapter,
  setSelectedChapter
}) => {
  const [editingTitle, setEditingTitle] = useState(script?.title || '');
  const [editingSynopsis, setEditingSynopsis] = useState(script?.synopsis || '');
  
  // Lista de capítulos do Firebase Firestore
  const [firebaseCapitulos, setFirebaseCapitulos] = useState<FirebaseChapter[]>([]);
  const [loadingFirebase, setLoadingFirebase] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    if (script) {
      setEditingTitle(script.title);
      setEditingSynopsis(script.synopsis || '');
    }
  }, [script]);

  // Carrega a cronologia do Firebase ao montar o componente
  const carregarCronologiaFirebase = async () => {
    setLoadingFirebase(true);
    setFirebaseError(null);
    const result = await dbService.fetchFirebaseCronologia();
    setLoadingFirebase(false);

    if (result.success) {
      setFirebaseCapitulos(result.capitulos);
    } else {
      setFirebaseError(result.error || 'Não foi possível carregar a cronologia do Firebase');
    }
  };

  useEffect(() => {
    carregarCronologiaFirebase();
  }, []);

  // Selecionar o próximo pendente da fila
  const selecionarProximoPendente = () => {
    const pendente = firebaseCapitulos.find(c => c.status === 'pendente');
    if (pendente) {
      setSelectedChapter(pendente);
      setTheme(`${pendente.titulo} (Passagem Bíblica e explicações de O Evangelho Segundo o Espiritismo)`);
    } else {
      alert('Todos os capítulos da cronologia do Firebase já estão marcados como concluídos!');
    }
  };

  const handleSelectChapter = (cap: FirebaseChapter) => {
    setSelectedChapter(cap);
    setTheme(`${cap.titulo} (Passagem Bíblica e explicações de O Evangelho Segundo o Espiritismo)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;
    onGenerateScript(theme, selectedChapter?.id);
  };

  const handleApplyMeta = () => {
    onUpdateScriptMeta(editingTitle, editingSynopsis);
  };

  const capitulosPendentes = firebaseCapitulos.filter(c => c.status === 'pendente');

  return (
    <div className="space-y-6">
      
      {/* Banner de Conexão com Firebase */}
      <div className="bg-gradient-to-r from-[#171922] via-[#1f222d] to-[#171922] p-5 rounded-2xl border border-[#303444] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-serif tracking-wide">
                Cronologia Firebase Firestore Conectada
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                hq-jesus-app
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {firebaseCapitulos.length > 0 ? (
                <span>
                  <strong>{firebaseCapitulos.length} capítulos</strong> encontrados na coleção <code className="text-amber-300">cronologia</code> ({capitulosPendentes.length} pendentes).
                </span>
              ) : (
                <span>Carregando dados da coleção cronologia...</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selecionarProximoPendente}
            disabled={loadingFirebase || capitulosPendentes.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Selecionar Próximo Pendente</span>
          </button>

          <button
            type="button"
            onClick={carregarCronologiaFirebase}
            disabled={loadingFirebase}
            className="p-2 rounded-xl bg-[#222532] hover:bg-[#2d3142] text-neutral-300 border border-[#35394b] transition-colors"
            title="Recarregar do Firebase"
          >
            <RefreshCw className={`w-4 h-4 ${loadingFirebase ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Seletor de Capítulos da Cronologia Firebase */}
      {firebaseCapitulos.length > 0 && (
        <div className="bg-[#181922] p-4 rounded-2xl border border-[#2d313f] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold text-neutral-300 flex items-center gap-2 font-mono">
              <ScrollText className="w-4 h-4 text-amber-400" />
              <span>Linha do Tempo dos Capítulos (Banco Firebase)</span>
            </label>
            <span className="text-[11px] text-neutral-500">
              Clique em um capítulo para preencher o tema
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-1">
            {firebaseCapitulos.map((cap) => {
              const isSelected = selectedChapter?.id === cap.id;
              const isConcluido = cap.status === 'concluído';

              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => handleSelectChapter(cap)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                      : isConcluido
                      ? 'bg-[#15161d] border-emerald-800/40 text-neutral-400 hover:border-emerald-600'
                      : 'bg-[#1f212c] border-[#363a4d] text-neutral-200 hover:border-amber-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold">
                      {cap.id}
                    </span>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-black/30 text-black'
                        : isConcluido
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {isConcluido ? '✓ OK' : '○ Pend.'}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[11px] leading-tight">
                    {cap.titulo}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulário Principal de Roteiro */}
      <div className="bg-[#1a1b23] p-6 rounded-2xl border border-[#2d313c] shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-bold text-neutral-300 flex items-center gap-1.5 font-mono">
                <span>Tema da História / Passagem Bíblica</span>
                {selectedChapter && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                    Capítulo Vinculado: {selectedChapter.id}
                  </span>
                )}
              </label>
              <span className="text-[11px] text-neutral-500 font-mono">
                {theme.length} caracteres
              </span>
            </div>

            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              rows={3}
              placeholder="Ex: A Cura do Cego de Nascença — O questionamento dos discípulos sobre causas anteriores das aflições (João 9 / ESE Cap. V)..."
              className="w-full bg-[#121319] text-neutral-100 placeholder-neutral-500 border border-[#363a49] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-4 text-sm transition-all resize-none shadow-inner"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Modelo: <strong className="text-neutral-200">Gemini 3.8 Flash</strong></span>
              <span className="text-neutral-600">•</span>
              <span>Retorno: <strong className="text-neutral-200">JSON Estruturado</strong></span>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !theme.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>2. Gerando Roteiro com IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>2. Gerar Roteiro com IA</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Roteiro Atual Carregado / Sinopse */}
      {script && (
        <div className="bg-[#1a1b23] p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-white">
                Roteiro Ativo: {script.title}
              </h3>
            </div>
            <button
              onClick={onSwitchToCanvas}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Abrir no Canvas de Páginas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2">
              <label className="text-xs uppercase font-bold text-neutral-400">Título do Capítulo</label>
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleApplyMeta}
                className="w-full bg-[#121319] border border-[#343846] rounded-lg px-3 py-2 text-sm text-amber-300 font-semibold focus:border-amber-500 outline-none"
              />
              <div className="flex items-center gap-3 text-xs text-neutral-400 pt-2 font-mono">
                <span>Páginas: <strong className="text-white">{script.pages.length}</strong></span>
                <span>•</span>
                <span>Painéis: <strong className="text-white">{script.pages.reduce((a, p) => a + p.panels.length, 0)}</strong></span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase font-bold text-neutral-400">Sinopse Dramática & Conceito</label>
              <textarea
                rows={3}
                value={editingSynopsis}
                onChange={(e) => setEditingSynopsis(e.target.value)}
                onBlur={handleApplyMeta}
                placeholder="Sinopse do capítulo..."
                className="w-full bg-[#121319] border border-[#343846] rounded-lg px-3 py-2 text-xs text-neutral-300 focus:border-amber-500 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
