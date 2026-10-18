import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Upload, 
  ExternalLink, 
  Wand2, 
  Eye, 
  Maximize2,
  Trash2,
  Brush,
  SunMedium
} from 'lucide-react';
import { PanelItem } from '../types/manga';

interface ArtModuleProps {
  panel: PanelItem;
  pageIndex: number;
  panelIndex: number;
  onUpdatePrompt: (newPrompt: string) => void;
  onUpdateImage: (imageUrl: string | undefined) => void;
}

export const ArtModule: React.FC<ArtModuleProps> = ({
  panel,
  pageIndex,
  panelIndex,
  onUpdatePrompt,
  onUpdateImage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyPrompt = () => {
    // Formatado para Midjourney / Google Flow
    const fullPrompt = `/imagine prompt: ${panel.imagePrompt} --ar 1:1 --style raw --v 6.0`;
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTag = (tag: string) => {
    const updated = panel.imagePrompt ? `${panel.imagePrompt.trim()}, ${tag}` : tag;
    onUpdatePrompt(updated);
  };

  // Gerar Imagem: Simula síntese artística Seinen de alta intensidade visual
  const handleGenerateImage = async () => {
    setIsGenerating(true);

    try {
      // 1. Notifica o backend
      await fetch('/api/gerar-imagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: panel.imagePrompt,
          panelNumber: panel.panelNumber
        })
      });

      // 2. Cria arte de nanquim procedural e atmosférica estilo Seinen usando Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Fundo nanquim escuro com granulação
        ctx.fillStyle = '#0f1015';
        ctx.fillRect(0, 0, 768, 768);

        // Chiaroscuro radial dramático
        const gradient = ctx.createRadialGradient(384, 340, 40, 384, 384, 450);
        gradient.addColorStop(0, '#3a3d4d');
        gradient.addColorStop(0.4, '#1b1c24');
        gradient.addColorStop(1, '#08080a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 768, 768);

        // Hachuras Seinen estilizadas (Cross-hatching lines)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        for (let i = -768; i < 768 * 2; i += 22) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + 400, 768);
          ctx.stroke();
        }

        // Hachuras cruzadas de sombra
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        for (let i = 0; i < 768; i += 18) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(768, i + 200);
          ctx.stroke();
        }

        // Silhueta dramática / moldura central
        ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
        ctx.beginPath();
        ctx.arc(384, 360, 220, 0, Math.PI * 2);
        ctx.fill();

        // Moldura clássica de mangá
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, 708, 708);

        // Detalhes da cena
        ctx.fillStyle = '#f9a826';
        ctx.font = 'bold 22px "Cinzel", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`SEINEN MANGA • PAINEL ${panel.panelNumber}`, 384, 80);

        // Selo central
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '16px "Inter", sans-serif';
        ctx.fillText(`[ Ilustração Sintetizada para o Painel ${panel.panelNumber} ]`, 384, 340);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 13px "Inter", sans-serif';
        const promptSnippet = panel.imagePrompt.slice(0, 65) + (panel.imagePrompt.length > 65 ? '...' : '');
        ctx.fillText(`"${promptSnippet}"`, 384, 375);

        // Indicador de iluminação
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px monospace';
        ctx.fillText('CHIAROSCURO • INK ART • 1:1 RATIO', 384, 690);

        const dataUrl = canvas.toDataURL('image/png');
        onUpdateImage(dataUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Upload manual de imagem do usuário
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onUpdateImage(customUrl.trim());
      setCustomUrl('');
      setShowUrlModal(false);
    }
  };

  return (
    <div className="space-y-3">
      
      {/* 1. QUADRADO VAZIO (PLACEHOLDER) 1:1 ACIMA DO TEXTO */}
      <div className="relative w-full aspect-square bg-[#0c0d12] rounded-xl border-2 border-[#2b2f3d] overflow-hidden group shadow-inner flex flex-col items-center justify-center">
        
        {panel.imageUrl ? (
          // Imagem Presente
          <div className="relative w-full h-full">
            <img
              src={panel.imageUrl}
              alt={`Arte do Painel ${panel.panelNumber}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            {/* Overlay de Ações Rápidas */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2.5 rounded-lg bg-neutral-900/90 text-white hover:bg-amber-500 hover:text-black border border-white/20 transition-all cursor-pointer"
                title="Ampliar Imagem"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateImage(undefined)}
                className="p-2.5 rounded-lg bg-red-950/90 text-red-200 hover:bg-red-600 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                title="Remover Imagem e Voltar ao Placeholder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {/* Badge de Concluído */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-amber-500/40 text-[10px] text-amber-400 font-mono">
              Arte Sintetizada 1:1
            </div>
          </div>
        ) : (
          // Placeholder Vazio Reservado
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center relative">
            {/* Linhas cruzadas estéticas estilo mesa de luz de quadrinhos */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-full border-b border-r border-dashed border-neutral-600 flex items-center justify-center">
                <div className="w-16 h-16 border border-neutral-500 rounded-full" />
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#171922] border border-[#373b4d] flex items-center justify-center mb-3 shadow-md group-hover:border-amber-500/50 group-hover:scale-105 transition-all">
              <ImageIcon className="w-7 h-7 text-neutral-500 group-hover:text-amber-400 transition-colors" />
            </div>

            <span className="text-xs font-bold text-neutral-300 font-serif tracking-wider uppercase mb-1">
              Quadro Reservado para Arte
            </span>
            <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
              Espaço 1:1 para a síntese visual do painel gerada por IA ou upload.
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-500/80 font-mono bg-amber-500/5 px-2.5 py-1 rounded-md border border-amber-500/20">
              <SunMedium className="w-3 h-3 text-amber-400" />
              <span>Formato Seinen: 1:1 Ink Art</span>
            </div>
          </div>
        )}

      </div>

      {/* 2. TEXTO DO IMAGEPROMPT EDITÁVEL */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5 font-mono">
            <Brush className="w-3 h-3 text-amber-400" />
            <span>Image Prompt (Midjourney / Flow)</span>
          </label>
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-amber-300 font-mono bg-[#1c1e28] px-2 py-0.5 rounded border border-[#2e3242] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copiado!' : 'Copiar Prompt'}</span>
          </button>
        </div>

        <textarea
          value={panel.imagePrompt}
          onChange={(e) => onUpdatePrompt(e.target.value)}
          rows={3}
          placeholder="Ex: Seinen manga style, heavy ink cross-hatching, high contrast chiaroscuro..."
          className="w-full bg-[#101116] border border-[#2d313f] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none resize-none leading-relaxed transition-all"
        />

        {/* Quick Style Enhancer Chips */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <span className="text-[10px] text-neutral-500 font-mono mr-1">Tags:</span>
          {[
            'Chiaroscuro lighting',
            'Heavy ink cross-hatching',
            'Low-angle Dutch tilt',
            'Vagabond style linework',
            'Screentone shading',
          ].map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="text-[10px] px-2 py-0.5 rounded bg-[#171922] hover:bg-[#252837] text-neutral-400 hover:text-amber-300 border border-[#292c3a] transition-colors cursor-pointer"
            >
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BOTÃO DE AÇÃO: 'GERAR IMAGEM' + Ações de Mídia */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleGenerateImage}
          disabled={isGenerating || !panel.imagePrompt.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Sintetizando Arte Seinen...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Gerar Imagem</span>
            </>
          )}
        </button>

        {/* Upload Manual */}
        <label
          title="Fazer Upload de Ilustração / Esboço"
          className="p-2.5 rounded-lg bg-[#191b24] hover:bg-[#262836] border border-[#2d313f] text-neutral-300 hover:text-white cursor-pointer transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Inserir URL Externa */}
        <button
          type="button"
          onClick={() => setShowUrlModal(!showUrlModal)}
          title="Inserir URL da Imagem"
          className="p-2.5 rounded-lg bg-[#191b24] hover:bg-[#262836] border border-[#2d313f] text-neutral-300 hover:text-white cursor-pointer transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal/Input para Colar URL de Imagem */}
      {showUrlModal && (
        <div className="p-3 bg-[#13141a] rounded-lg border border-[#343849] space-y-2 mt-2">
          <label className="text-[10px] uppercase font-bold text-neutral-400">
            Cole a URL da imagem (JPG, PNG, WebP):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://exemplo.com/arte-manga.jpg"
              className="flex-1 bg-[#0c0d12] border border-[#2d313f] rounded px-2 py-1 text-xs text-white outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded hover:bg-amber-400 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Modal de Zoom da Imagem */}
      {isModalOpen && panel.imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#161720] border border-[#3b3f52] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#2d313f]">
              <span className="font-serif font-bold text-white text-sm">
                Painel {panel.panelNumber} • Prévia da Arte Seinen
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img
                src={panel.imageUrl}
                alt="Zoom Arte"
                className="max-h-[70vh] object-contain rounded-lg border border-neutral-800"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 bg-[#14151c] text-xs text-neutral-300 font-mono">
              <strong className="text-amber-400">Prompt:</strong> {panel.imagePrompt}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
