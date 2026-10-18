import { MangaScript } from '../types/manga';

const LOCAL_STORAGE_KEY = 'mesa_de_luz_manga_scripts';
const ACTIVE_SCRIPT_KEY = 'mesa_de_luz_active_script';

export interface FirebaseChapter {
  id: string;
  titulo: string;
  status: 'pendente' | 'concluído' | string;
  temRoteiro?: boolean;
}

export const dbService = {
  // Salva no LocalStorage
  saveLocal(script: MangaScript): void {
    try {
      localStorage.setItem(ACTIVE_SCRIPT_KEY, JSON.stringify(script));
      const all: Record<string, MangaScript> = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'
      );
      const scriptId = script.id || `cap_${Date.now()}`;
      all[scriptId] = { ...script, id: scriptId };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Erro ao salvar localmente:', e);
    }
  },

  // Carrega o script ativo local
  loadActiveLocal(): MangaScript | null {
    try {
      const data = localStorage.getItem(ACTIVE_SCRIPT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Erro ao carregar script ativo:', e);
      return null;
    }
  },

  // 1. Busca todos os capítulos da Cronologia diretamente do Firebase Firestore
  async fetchFirebaseCronologia(): Promise<{ success: boolean; capitulos: FirebaseChapter[]; error?: string }> {
    try {
      const response = await fetch('/api/firebase/cronologia');
      const data = await response.json();
      if (!response.ok) {
        return { success: false, capitulos: [], error: data.error };
      }
      return { success: true, capitulos: data.capitulos || [] };
    } catch (err: any) {
      return { success: false, capitulos: [], error: err.message };
    }
  },

  // 2. Salva o Roteiro no Firebase Firestore e atualiza status para 'concluído'
  async saveToFirebase(chapterId: string, script: MangaScript): Promise<{ success: boolean; message: string }> {
    this.saveLocal({ ...script, id: chapterId });

    try {
      const response = await fetch('/api/firebase/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: chapterId,
          titulo: script.title,
          roteiro: script
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao sincronizar com o Firebase');
      }

      return {
        success: true,
        message: `Capítulo "${script.title}" salvo e atualizado no Firebase!`
      };
    } catch (err: any) {
      console.error(err);
      return {
        success: false,
        message: `Erro na gravação remota: ${err.message}. (Salvo com segurança localmente).`
      };
    }
  },

  // Exportar para JSON
  downloadJson(script: MangaScript): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(script, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const safeTitle = (script.title || 'roteiro_seinen').toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute("download", `${safeTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Normalizador de formato JSON
  normalizeScript(raw: any, themeFallback: string = ''): MangaScript {
    let title = raw.title || raw.titulo || 'Capítulo Sem Título';
    let synopsis = raw.synopsis || raw.sinopse || raw.resumo || '';
    let rawPages = raw.pages || raw.paginas || [];

    if (!Array.isArray(rawPages) && raw.panels) {
      rawPages = [{ pageNumber: 1, panels: raw.panels }];
    }

    const pages = rawPages.map((page: any, pIndex: number) => {
      const pageNum = page.pageNumber || page.pagina || (pIndex + 1);
      const rawPanels = page.panels || page.paineis || page.quadrinhos || [];

      const panels = rawPanels.map((panel: any, panIndex: number) => {
        let dialogueContent = panel.dialogue || panel.dialogos || panel.texto || [];

        let dialogues: any[] = [];
        if (typeof dialogueContent === 'string') {
          dialogues = [{
            character: 'Narrador',
            text: dialogueContent,
            type: 'narration'
          }];
        } else if (Array.isArray(dialogueContent)) {
          dialogues = dialogueContent.map((d: any, dIndex: number) => {
            if (typeof d === 'string') {
              return {
                id: `d_${panIndex}_${dIndex}`,
                character: 'Voz',
                text: d,
                type: 'dialogue'
              };
            }
            return {
              id: `d_${panIndex}_${dIndex}`,
              character: d.character || d.personagem || 'Personagem',
              text: d.text || d.fala || d.texto || '',
              type: d.type || (d.character?.toLowerCase().includes('narrador') ? 'narration' : 'dialogue')
            };
          });
        }

        return {
          id: `p_${pageNum}_pan_${panIndex + 1}`,
          panelNumber: panel.panelNumber || (panIndex + 1),
          imagePrompt: panel.imagePrompt || panel.prompt || panel.descricaoVisual || '',
          dialogue: dialogues,
          imageStatus: 'empty',
          cameraAngle: panel.cameraAngle || 'Dramatic Angle',
          lighting: panel.lighting || 'Chiaroscuro Inking'
        };
      });

      return {
        id: `page_${pageNum}`,
        pageNumber: pageNum,
        title: page.title || `Página ${pageNum}`,
        panels
      };
    });

    return {
      id: raw.id || `cap_${Date.now()}`,
      title,
      synopsis,
      theme: themeFallback,
      pages,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: 'rascunho'
      }
    };
  }
};
