import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  MessageSquare, 
  BookOpen, 
  MoveRight, 
  Copy, 
  GripVertical,
  Check,
  Edit3,
  User,
  Quote,
  Sparkles
} from 'lucide-react';
import { MangaScript, PageItem, PanelItem, DialogueItem } from '../types/manga';
import { ArtModule } from './ArtModule';

interface CanvasModuleProps {
  script: MangaScript;
  onUpdateScript: (newScript: MangaScript) => void;
  onNavigateToScriptGen: () => void;
}

export const CanvasModule: React.FC<CanvasModuleProps> = ({
  script,
  onUpdateScript,
  onNavigateToScriptGen
}) => {
  const [activePageIndex, setActivePageIndex] = useState(0);

  const pages = script.pages || [];
  const currentPage = pages[activePageIndex] || pages[0];

  // Se não houver páginas ainda
  if (!currentPage) {
    return (
      <div className="bg-[#181922] border border-[#2b2f3d] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white">Nenhum Roteiro Carregado</h3>
        <p className="text-sm text-neutral-400">
          Utilize o Módulo de Roteiro para sintetizar o primeiro capítulo ou adicione uma página em branco manualmente.
        </p>
        <button
          onClick={onNavigateToScriptGen}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
        >
          Ir para o Módulo de Roteiro
        </button>
      </div>
    );
  }

  // Atualiza um painel específico na página atual
  const updatePanel = (panelIndex: number, updater: (p: PanelItem) => PanelItem) => {
    const updatedPages = [...pages];
    const targetPage = { ...updatedPages[activePageIndex] };
    const updatedPanels = [...targetPage.panels];
    updatedPanels[panelIndex] = updater(updatedPanels[panelIndex]);
    targetPage.panels = updatedPanels;
    updatedPages[activePageIndex] = targetPage;
    onUpdateScript({ ...script, pages: updatedPages });
  };

  // Atualizar Diálogo dentro de um painel
  const updateDialogueText = (panelIndex: number, dialogueIndex: number, newText: string) => {
    updatePanel(panelIndex, (panel) => {
      let dialogues: DialogueItem[] = Array.isArray(panel.dialogue)
        ? [...panel.dialogue]
        : [{ character: 'Narrador', text: String(panel.dialogue), type: 'narration' }];

      if (dialogues[dialogueIndex]) {
        dialogues[dialogueIndex] = {
          ...dialogues[dialogueIndex],
          text: newText
        };
      }
      return { ...panel, dialogue: dialogues };
    });
  };

  // Atualizar Personagem do Diálogo
  const updateDialogueCharacter = (panelIndex: number, dialogueIndex: number, newChar: string) => {
    updatePanel(panelIndex, (panel) => {
      let dialogues: DialogueItem[] = Array.isArray(panel.dialogue)
        ? [...panel.dialogue]
        : [{ character: 'Narrador', text: String(panel.dialogue), type: 'narration' }];

      if (dialogues[dialogueIndex]) {
        dialogues[dialogueIndex] = {
          ...dialogues[dialogueIndex],
          character: newChar,
          type: newChar.toLowerCase().includes('narrador') ? 'narration' : 'dialogue'
        };
      }
      return { ...panel, dialogue: dialogues };
    });
  };

  // Adicionar nova fala / narração a um painel
  const addDialogueToPanel = (panelIndex: number) => {
    updatePanel(panelIndex, (panel) => {
      let dialogues: DialogueItem[] = Array.isArray(panel.dialogue)
        ? [...panel.dialogue]
        : [{ character: 'Narrador', text: String(panel.dialogue), type: 'narration' }];

      dialogues.push({
        id: `d_${Date.now()}`,
        character: 'Jesus',
        text: 'Nova fala do personagem...',
        type: 'dialogue'
      });
      return { ...panel, dialogue: dialogues };
    });
  };

  // Remover fala de um painel
  const removeDialogueFromPanel = (panelIndex: number, dialogueIndex: number) => {
    updatePanel(panelIndex, (panel) => {
      if (!Array.isArray(panel.dialogue)) return panel;
      const dialogues = panel.dialogue.filter((_, idx) => idx !== dialogueIndex);
      return { ...panel, dialogue: dialogues };
    });
  };

  // Adicionar novo painel à página
  const addPanel = () => {
    const updatedPages = [...pages];
    const targetPage = { ...updatedPages[activePageIndex] };
    const newPanelNumber = targetPage.panels.length + 1;

    const newPanel: PanelItem = {
      id: `p_${activePageIndex + 1}_pan_${Date.now()}`,
      panelNumber: newPanelNumber,
      imagePrompt: 'Seinen manga style, heavy ink cross-hatching, high contrast chiaroscuro. Dramatic angle.',
      dialogue: [
        {
          id: `d_${Date.now()}`,
          character: 'Narrador',
          text: 'Insira o texto descritivo ou diálogo deste novo painel...',
          type: 'narration'
        }
      ],
      imageStatus: 'empty'
    };

    targetPage.panels = [...targetPage.panels, newPanel];
    updatedPages[activePageIndex] = targetPage;
    onUpdateScript({ ...script, pages: updatedPages });
  };

  // Excluir painel
  const deletePanel = (panelIndex: number) => {
    if (currentPage.panels.length <= 1) {
      alert('A página precisa de pelo menos 1 painel.');
      return;
    }
    const updatedPages = [...pages];
    const targetPage = { ...updatedPages[activePageIndex] };
    targetPage.panels = targetPage.panels
      .filter((_, idx) => idx !== panelIndex)
      .map((p, idx) => ({ ...p, panelNumber: idx + 1 }));
    updatedPages[activePageIndex] = targetPage;
    onUpdateScript({ ...script, pages: updatedPages });
  };

  // Adicionar nova página ao mangá
  const addPage = () => {
    const newPageNum = pages.length + 1;
    const newPage: PageItem = {
      id: `page_${Date.now()}`,
      pageNumber: newPageNum,
      title: `Página ${newPageNum}`,
      panels: [
        {
          id: `p_${newPageNum}_pan_1`,
          panelNumber: 1,
          imagePrompt: 'Seinen manga style, wide cinematic opening frame, heavy sumi-e ink textures.',
          dialogue: [
            {
              id: `d_${Date.now()}`,
              character: 'Narrador',
              text: 'Início da nova página...',
              type: 'narration'
            }
          ],
          imageStatus: 'empty'
        }
      ]
    };
    onUpdateScript({ ...script, pages: [...pages, newPage] });
    setActivePageIndex(pages.length);
  };

  // Excluir página
  const deletePage = (pageIdx: number) => {
    if (pages.length <= 1) {
      alert('O roteiro precisa de pelo menos uma página.');
      return;
    }
    const updatedPages = pages
      .filter((_, idx) => idx !== pageIdx)
      .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    onUpdateScript({ ...script, pages: updatedPages });
    setActivePageIndex(Math.max(0, pageIdx - 1));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SELETOR DE PÁGINAS & CONTROLES SUPERIORES */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#171821] p-3 rounded-2xl border border-[#2c303f]">
        
        {/* Lista de Abas de Páginas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {pages.map((p, idx) => {
            const isActive = idx === activePageIndex;
            return (
              <div key={p.id || idx} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActivePageIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#222430] hover:bg-[#2c2f3f] text-neutral-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pág. {p.pageNumber || (idx + 1)}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/25 text-black' : 'bg-black/40 text-neutral-400'}`}>
                    {p.panels.length}
                  </span>
                </button>

                {pages.length > 1 && isActive && (
                  <button
                    type="button"
                    onClick={() => deletePage(idx)}
                    title="Excluir esta página"
                    className="ml-1 p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addPage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-[#3a3e52] hover:border-amber-500/70 text-neutral-400 hover:text-amber-400 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Página</span>
          </button>
        </div>

        {/* Resumo & Ação Rápida */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            Página {currentPage.pageNumber} de {pages.length} • {currentPage.panels.length} Quadrinhos
          </span>
          <button
            type="button"
            onClick={addPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#272a38] hover:bg-[#34384b] text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Painel</span>
          </button>
        </div>

      </div>

      {/* 2. ÁREA CANVAS: GRADE DE PAINÉIS DE QUADRINHOS */}
      <div className="space-y-4">
        
        {/* Título da Página Atual */}
        <div className="flex items-center justify-between border-b border-[#2b2f3e] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-500 font-bold">
              [ Canvas de Montagem ]
            </span>
            <h3 className="font-serif font-bold text-lg text-white">
              Página {currentPage.pageNumber} • {script.title}
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400 italic">
            Clique diretamente em qualquer diálogo ou narração para editar o texto livremente
          </span>
        </div>

        {/* Grid de Blocos de Painéis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPage.panels.map((panel, panIdx) => {
            const rawDialogues = Array.isArray(panel.dialogue)
              ? panel.dialogue
              : [{ character: 'Narrador', text: String(panel.dialogue), type: 'narration' }];

            return (
              <div
                key={panel.id || panIdx}
                className="bg-[#181922] border-2 border-[#2b2f3d] hover:border-[#3f4559] rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
              >
                
                {/* Header do Painel */}
                <div className="bg-[#13141a] px-4 py-2.5 border-b border-[#262936] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                      {panel.panelNumber}
                    </span>
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-200 font-serif">
                      Painel {panel.panelNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deletePanel(panIdx)}
                      title="Excluir Painel"
                      className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Conteúdo Central */}
                <div className="p-4 space-y-4 flex-1">
                  
                  {/* MÓDULO DE ARTE: QUADRADO VAZIO + IMAGE PROMPT EDITÁVEL + BOTÃO GERAR */}
                  <ArtModule
                    panel={panel}
                    pageIndex={activePageIndex}
                    panelIndex={panIdx}
                    onUpdatePrompt={(newPrompt) => {
                      updatePanel(panIdx, (p) => ({ ...p, imagePrompt: newPrompt }));
                    }}
                    onUpdateImage={(newImg) => {
                      updatePanel(panIdx, (p) => ({ ...p, imageUrl: newImg }));
                    }}
                  />

                  {/* ÁREA DE DIÁLOGOS E NARRAÇÕES LIVRES (EDITÁVEIS) */}
                  <div className="pt-2 border-t border-[#262936] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-neutral-300 flex items-center gap-1.5 font-mono">
                        <MessageSquare className="w-3 h-3 text-amber-400" />
                        <span>Diálogos & Narração (Clique para Editar)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => addDialogueToPanel(panIdx)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Fala</span>
                      </button>
                    </div>

                    {/* Lista de Falas / Balões */}
                    <div className="space-y-2.5">
                      {rawDialogues.map((d: any, dIdx: number) => {
                        const isNarration = d.character?.toLowerCase().includes('narrador') || d.type === 'narration';
                        
                        return (
                          <div
                            key={d.id || dIdx}
                            className={`p-2.5 rounded-xl border transition-all ${
                              isNarration
                                ? 'bg-[#15161d] border-[#363a4b]'
                                : 'bg-[#1d1f2b] border-[#3e4357]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              {/* Seletor / Nome do Personagem */}
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isNarration ? 'bg-neutral-500' : 'bg-amber-400'}`} />
                                <input
                                  type="text"
                                  value={d.character}
                                  onChange={(e) => updateDialogueCharacter(panIdx, dIdx, e.target.value)}
                                  className="bg-transparent font-serif font-bold text-xs text-amber-400 focus:text-white outline-none border-b border-transparent focus:border-amber-500 transition-colors w-28"
                                  placeholder="Personagem"
                                />
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {isNarration ? '(Narração)' : '(Fala)'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeDialogueFromPanel(panIdx, dIdx)}
                                className="text-neutral-500 hover:text-red-400 p-0.5"
                                title="Remover fala"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Campo de Texto Editável Livremente */}
                            <textarea
                              rows={2}
                              value={d.text}
                              onChange={(e) => updateDialogueText(panIdx, dIdx, e.target.value)}
                              placeholder="Digite a fala ou narração deste quadro..."
                              className="w-full bg-[#101116]/80 text-xs text-neutral-200 placeholder-neutral-500 p-2 rounded-lg border border-[#2d3140] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none leading-relaxed"
                            />
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>

                {/* Rodapé do Painel com Informações Técnicas */}
                <div className="bg-[#121319] px-4 py-2 border-t border-[#242735] text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                  <span>Pág. {currentPage.pageNumber} • Q{panel.panelNumber}</span>
                  <span className="text-neutral-400">{panel.imageUrl ? '✓ Arte Carregada' : '○ Arte Pendente'}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
