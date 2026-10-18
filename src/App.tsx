import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptModule } from './components/ScriptModule';
import { CanvasModule } from './components/CanvasModule';
import { JsonViewerModule } from './components/JsonViewerModule';
import { MangaReaderModal } from './components/MangaReaderModal';
import { MangaScript } from './types/manga';
import { dbService, FirebaseChapter } from './services/dbService';

// Roteiro inicial de demonstração épico (A Cura do Cego de Nascença)
const INITIAL_DEMO_SCRIPT: MangaScript = {
  id: "cap_01",
  title: "A Luz nas Sombras de Siloé",
  synopsis: "Diante de um homem cego de nascença, os discípulos questionam as causas espirituais do sofrimento humano. Jesus revela que a dor não é punição arbitrária, mas instrumento de elevação e testemunho das leis soberanas de reajuste espiritual.",
  theme: "A Cura do Cego de Nascença e o Sentido do Sofrimento",
  pages: [
    {
      id: "page_1",
      pageNumber: 1,
      title: "Página 1: As Trevas da Carne e o Questionamento",
      panels: [
        {
          id: "p1_pan1",
          panelNumber: 1,
          imagePrompt: "Seinen manga style, heavy ink cross-hatching, high contrast chiaroscuro. Dusty, ancient stone streets of Jerusalem under an unforgiving desert sun. In the alleyway shadows sits a beggar with milky, scarred eyes, his face etched with silent endurance. Dramatic low angle, Vagabond manga linework.",
          dialogue: [
            {
              id: "d1",
              character: "Narrador",
              text: "A poeira dos séculos pesa sobre os que caminham nas trevas da matéria. Mas mesmo no abismo, a centelha da alma aguarda sua libertação.",
              type: "narration"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p1_pan2",
          panelNumber: 2,
          imagePrompt: "Medium shot. The disciples surround Jesus, staring at the blind beggar. Their faces are tense, questioning. Moody atmospheric lighting, sharp linework, deep black shadows cast on ancient limestone walls.",
          dialogue: [
            {
              id: "d2",
              character: "Discípulo",
              text: "Mestre... quem pecou para que este homem nascesse cego? Ele próprio em outra vida, ou seus pais?",
              type: "dialogue"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p1_pan3",
          panelNumber: 3,
          imagePrompt: "Close-up on Jesus. Calm, penetrating gaze, eyes reflecting divine wisdom and immense empathy. Fine and delicate ink strokes detailing his expression, background dissolved into stark negative space and radiating subtle white aura lines.",
          dialogue: [
            {
              id: "d3",
              character: "Jesus",
              text: "Nem ele pecou, nem seus pais com o intuito deste mal. Mas assim é para que as obras de Deus se manifestem nele.",
              type: "dialogue"
            },
            {
              id: "d4",
              character: "Narrador",
              text: "Não há vingança no Criador. As aflições terrenas não são castigos cegos, mas provas redentoras escolhidas para a ascensão da alma.",
              type: "narration"
            }
          ],
          imageStatus: "empty"
        }
      ]
    },
    {
      id: "page_2",
      pageNumber: 2,
      title: "Página 2: O Lodo da Terra e o Despertar da Vontade",
      panels: [
        {
          id: "p2_pan1",
          panelNumber: 1,
          imagePrompt: "Dynamic close-up on Jesus kneeling on the earth. He mixes saliva with the dry dust, forming clay with his fingers. Intense tactile textures, splatters of sumi-e ink, gritty Seinen realism showing the connection between physical elements and spiritual magnetism.",
          dialogue: [
            {
              id: "d5",
              character: "Jesus",
              text: "Enquanto estou no mundo, sou a luz do mundo. Mas cada espírito deve aprender a buscar sua própria claridade.",
              type: "dialogue"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p2_pan2",
          panelNumber: 2,
          imagePrompt: "Extreme close-up. Jesus applying the wet clay over the blind man's closed eyelids. Palpable energetic distortion depicted with swirling kinetic ink lines, representing spiritual fluidic action altering the coarse matter of the flesh.",
          dialogue: [
            {
              id: "d6",
              character: "Cego",
              text: "Essa terra... arde como fogo líquido nos meus olhos! O que é essa presença tremenda?!",
              type: "dialogue"
            },
            {
              id: "d7",
              character: "Jesus",
              text: "Vá. Lava-te no tanque de Siloé. A fé exige o teu próprio passo na escuridão.",
              type: "dialogue"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p2_pan3",
          panelNumber: 3,
          imagePrompt: "Wide cinematic angle. The blind man stumbling with his wooden staff through the narrow, sun-drenched corridor toward the stone basin of Siloam. Heavy brushwork, solitary silhouette contrasting against blinding white stone pavement.",
          dialogue: [
            {
              id: "d8",
              character: "Narrador",
              text: "A redenção jamais é passiva. O espírito aflito precisa caminhar por sua própria deliberação para romper os véus da ilusão.",
              type: "narration"
            }
          ],
          imageStatus: "empty"
        }
      ]
    },
    {
      id: "page_3",
      pageNumber: 3,
      title: "Página 3: As Águas de Siloé e o Rompimento do Véu",
      panels: [
        {
          id: "p3_pan1",
          panelNumber: 1,
          imagePrompt: "Low angle shot inside the stone basin of Siloam. Clear water ripples violently as the man plunges his trembling hands into it, washing the dried mud from his face. High-contrast water reflections and splatters in dark ink wash style.",
          dialogue: [
            {
              id: "d9",
              character: "Cego",
              text: "A água... a lama se desfaz... e com ela, o peso que carreguei por toda esta encarnação!",
              type: "dialogue"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p3_pan2",
          panelNumber: 2,
          imagePrompt: "Dramatic double-spread feel in single frame. The man opens his eyes for the first time. Explosive burst of light piercing through pitch-black ink shading. His irises are crystalline, radiating raw emotion, tears mixing with water on his cheeks.",
          dialogue: [
            {
              id: "d10",
              character: "Cego",
              text: "EU... EU VEJO! O céu, a poeira, os homens... Eu vejo a luz do mundo!",
              type: "dialogue"
            }
          ],
          imageStatus: "empty"
        },
        {
          id: "p3_pan3",
          panelNumber: 3,
          imagePrompt: "Medium close-up of the man looking towards the horizon with profound reverence. Behind his physical silhouette, faint ethereal shapes of past lives and spiritual guides fade into gentle white ink hatching. Solemn, triumphant, sacred atmosphere.",
          dialogue: [
            {
              id: "d11",
              character: "Narrador",
              text: "A prova foi vencida. O véu da carne se dissolveu perante o mérito e a misericórdia. Não há noite eterna para aquele que desperta para a Lei Divina.",
              type: "narration"
            }
          ],
          imageStatus: "empty"
        }
      ]
    }
  ]
};

export default function App() {
  const [script, setScript] = useState<MangaScript>(() => {
    const saved = dbService.loadActiveLocal();
    return saved || INITIAL_DEMO_SCRIPT;
  });

  const [selectedChapter, setSelectedChapter] = useState<FirebaseChapter | null>({
    id: 'cap_01',
    titulo: 'A Anunciação e o Nascimento',
    status: 'pendente'
  });

  const [theme, setTheme] = useState(
    "A Anunciação e o Nascimento (Passagem Bíblica e explicações de O Evangelho Segundo o Espiritismo)"
  );

  const [activeModule, setActiveModule] = useState<'canvas' | 'script' | 'json'>('canvas');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Auto-save local
  useEffect(() => {
    if (script) {
      dbService.saveLocal(script);
    }
  }, [script]);

  // 1. GERAÇÃO DE ROTEIRO VIA GEMINI
  const handleGenerateScript = async (themeToUse: string, chapterId?: string) => {
    setIsGenerating(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: themeToUse })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        alert(`Erro na geração: ${data.error || 'Falha de comunicação'}`);
        return;
      }

      let rawJson: any;
      try {
        rawJson = typeof data.roteiro === 'string' ? JSON.parse(data.roteiro) : data.roteiro;
      } catch (err) {
        const match = data.roteiro.match(/\{[\s\S]*\}/);
        if (match) {
          rawJson = JSON.parse(match[0]);
        } else {
          throw new Error('Não foi possível interpretar a resposta da IA em formato JSON');
        }
      }

      const normalized = dbService.normalizeScript(rawJson, themeToUse);
      if (chapterId) {
        normalized.id = chapterId;
      }
      setScript(normalized);
      setActiveModule('canvas');
      setSaveMessage('Roteiro gerado e renderizado no Canvas!');
      setTimeout(() => setSaveMessage(null), 4000);

    } catch (e: any) {
      console.error(e);
      alert(`Falha ao gerar roteiro: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. GRAVAÇÃO NO FIREBASE FIRESTORE
  const handleSaveDatabase = async () => {
    if (!script) return;
    setIsSaving(true);
    try {
      const targetId = selectedChapter?.id || script.id || 'cap_01';
      const result = await dbService.saveToFirebase(targetId, script);
      setSaveMessage(result.message);
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar JSON
  const handleExportJson = () => {
    if (script) {
      dbService.downloadJson(script);
    }
  };

  // Importar JSON
  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target?.result as string);
            const normalized = dbService.normalizeScript(parsed);
            setScript(normalized);
            setActiveModule('canvas');
            setSaveMessage('JSON importado com sucesso!');
            setTimeout(() => setSaveMessage(null), 3000);
          } catch (err: any) {
            alert(`Erro ao importar JSON: ${err.message}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Atualizar Metadados do Script
  const handleUpdateScriptMeta = (title: string, synopsis: string) => {
    setScript((prev) => ({
      ...prev,
      title,
      synopsis
    }));
    setSaveMessage('Metadados atualizados!');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111217] text-[#e2e8f0] font-sans flex flex-col">
      
      {/* Header com Navegação e Controles de Banco de Dados */}
      <Header
        script={script}
        onSaveDatabase={handleSaveDatabase}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenPreview={() => setIsReaderOpen(true)}
        isSaving={isSaving}
        saveMessage={saveMessage}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        selectedChapterId={selectedChapter?.id}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Renderiza o Módulo Ativo */}
        {activeModule === 'script' && (
          <ScriptModule
            theme={theme}
            setTheme={setTheme}
            onGenerateScript={handleGenerateScript}
            isGenerating={isGenerating}
            script={script}
            onUpdateScriptMeta={handleUpdateScriptMeta}
            onSwitchToCanvas={() => setActiveModule('canvas')}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
          />
        )}

        {activeModule === 'canvas' && (
          <CanvasModule
            script={script}
            onUpdateScript={setScript}
            onNavigateToScriptGen={() => setActiveModule('script')}
          />
        )}

        {activeModule === 'json' && (
          <JsonViewerModule
            script={script}
            onUpdateScript={setScript}
          />
        )}

      </main>

      {/* Modal Leitor de Quadrinho Imersivo */}
      {isReaderOpen && (
        <MangaReaderModal
          script={script}
          onClose={() => setIsReaderOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#232633] bg-[#0e0f14] py-4 text-center text-xs text-neutral-500 font-mono">
        Mesa de Luz • Estúdio de HQ Seinen • Conectado ao Firebase Firestore (hq-jesus-app) & Google AI Studio
      </footer>

    </div>
  );
}
