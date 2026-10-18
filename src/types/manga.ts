export interface DialogueItem {
  id?: string;
  character: string;
  text: string;
  type?: 'dialogue' | 'narration' | 'thought' | 'sfx';
}

export interface PanelItem {
  id: string;
  panelNumber: number;
  imagePrompt: string;
  dialogue: DialogueItem[] | string;
  imageUrl?: string;
  imageStatus?: 'empty' | 'generating' | 'ready' | 'error';
  cameraAngle?: string;
  lighting?: string;
  notes?: string;
}

export interface PageItem {
  id: string;
  pageNumber: number;
  title?: string;
  panels: PanelItem[];
}

export interface MangaScript {
  id?: string;
  title: string;
  synopsis?: string;
  theme?: string;
  pages: PageItem[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'rascunho' | 'pendente' | 'concluído' | 'aprovado';
    author?: string;
  };
}

export interface DatabaseRecord {
  id: string;
  titulo: string;
  status: 'pendente' | 'em_andamento' | 'concluído';
  roteiro?: MangaScript;
  updatedAt: string;
}
