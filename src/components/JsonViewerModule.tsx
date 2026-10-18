import React, { useState, useEffect } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { MangaScript } from '../types/manga';
import { dbService } from '../services/dbService';

interface JsonViewerModuleProps {
  script: MangaScript;
  onUpdateScript: (newScript: MangaScript) => void;
}

export const JsonViewerModule: React.FC<JsonViewerModuleProps> = ({
  script,
  onUpdateScript
}) => {
  const [jsonString, setJsonString] = useState('');
  const [copied, setCopied] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [appliedMessage, setAppliedMessage] = useState(false);

  useEffect(() => {
    setJsonString(JSON.stringify(script, null, 2));
    setParseError(null);
  }, [script]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyChanges = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const normalized = dbService.normalizeScript(parsed);
      onUpdateScript(normalized);
      setParseError(null);
      setAppliedMessage(true);
      setTimeout(() => setAppliedMessage(false), 2500);
    } catch (e: any) {
      setParseError(`JSON Inválido: ${e.message}`);
    }
  };

  const handleDownload = () => {
    dbService.downloadJson(script);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#181922] p-4 rounded-2xl border border-[#2c303f] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white font-serif">Estrutura JSON do Roteiro</h3>
            <p className="text-xs text-neutral-400">
              Formato bruto pronto para persistência em Firestore ou exportação para motores de renderização
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {appliedMessage && (
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
              ✓ Aplicado ao Canvas com Sucesso!
            </span>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242634] hover:bg-[#313446] text-neutral-200 text-xs font-medium border border-[#373a4e] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242634] hover:bg-[#313446] text-neutral-200 text-xs font-medium border border-[#373a4e] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .json</span>
          </button>

          <button
            type="button"
            onClick={handleApplyChanges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronizar com Canvas</span>
          </button>
        </div>
      </div>

      {parseError && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          rows={22}
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          className="w-full bg-[#0d0e13] text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-[#262a37] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none leading-relaxed resize-none shadow-inner"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
