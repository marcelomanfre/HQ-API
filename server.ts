import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Configuração do Firebase Firestore (hq-jesus-app)
const FIREBASE_API_KEY = "AIzaSyCOWtLC5QW1f6e4E_PgX5ica1ZjJFf7dOA";
const FIREBASE_PROJECT_ID = "hq-jesus-app";

// 1. Rota para Geração de Roteiro Seinen via Gemini
app.post('/api/gerar-roteiro', async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: 'Título do capítulo não fornecido.' });
    }

    const systemPrompt = `Você é um roteirista especialista em quadrinhos no estilo Seinen.
Sua tarefa é resgatar da sua base de conhecimento os relatos da Bíblia e as explicações do livro 'O Evangelho Segundo o Espiritismo' sobre o TEMA.
A linguagem deve ser épica, madura e atrativa para jovens, sem termos chulos.
Você DEVE retornar a resposta EXCLUSIVAMENTE em formato JSON válido, contendo "title", "pages", "panels", "imagePrompt" em inglês (focado em iluminação e estilo ink art seinen) e os "dialogue".`;

    const userPrompt = `TEMA: ${titulo}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const roteiroText = response.text || '';
    return res.json({ roteiro: roteiroText });
  } catch (error: any) {
    console.error('Erro na geração com Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Erro ao gerar roteiro com Google AI',
    });
  }
});

// 2. Rota para Buscar Cronologia no Firebase Firestore (hq-jesus-app)
app.get('/api/firebase/cronologia', async (_req, res) => {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/cronologia?key=${FIREBASE_API_KEY}`;
    const fbRes = await fetch(url);
    const data = await fbRes.json();

    if (!fbRes.ok) {
      return res.status(fbRes.status).json({ error: data.error?.message || 'Erro no Firestore' });
    }

    const docs = data.documents || [];
    const capitulos = docs.map((doc: any) => {
      const parts = doc.name.split('/');
      const id = parts[parts.length - 1];
      const fields = doc.fields || {};

      let titulo = fields.titulo?.stringValue || '';
      let status = fields.status?.stringValue || 'pendente';

      // Tratamento para documentos onde o título foi armazenado como chave (ex: cap_02, cap_03...)
      if (!titulo) {
        for (const [key, val] of Object.entries<any>(fields)) {
          if (key !== 'status' && key !== 'roteiro') {
            titulo = key;
            if (val.stringValue) status = val.stringValue;
            break;
          }
        }
      }

      return {
        id,
        titulo: titulo || id,
        status,
        temRoteiro: !!fields.roteiro
      };
    });

    // Ordena por id (cap_01, cap_02...)
    capitulos.sort((a: any, b: any) => a.id.localeCompare(b.id, undefined, { numeric: true }));

    return res.json({ capitulos });
  } catch (err: any) {
    console.error('Erro ao ler cronologia Firebase:', err);
    return res.status(500).json({ error: err.message || 'Falha ao conectar com Firebase' });
  }
});

// 3. Rota para Gravar Capítulo no Firebase Firestore (hq-jesus-app)
app.post('/api/firebase/salvar', async (req, res) => {
  try {
    const { id, roteiro, titulo } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID do capítulo não informado' });
    }

    // Atualiza o documento no Firestore via REST
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/cronologia/${id}?updateMask.fieldPaths=status&updateMask.fieldPaths=titulo&updateMask.fieldPaths=roteiroJson&key=${FIREBASE_API_KEY}`;

    const updatePayload = {
      fields: {
        status: { stringValue: 'concluído' },
        titulo: { stringValue: titulo || id },
        roteiroJson: { stringValue: typeof roteiro === 'string' ? roteiro : JSON.stringify(roteiro) }
      }
    };

    const fbRes = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    const data = await fbRes.json();
    if (!fbRes.ok) {
      return res.status(fbRes.status).json({ error: data.error?.message || 'Erro ao gravar no Firebase' });
    }

    return res.json({
      success: true,
      message: `Capítulo "${titulo || id}" salvo com sucesso no Firebase como "concluído"!`,
      data
    });
  } catch (err: any) {
    console.error('Erro ao salvar no Firebase:', err);
    return res.status(500).json({ error: err.message || 'Falha ao gravar no Firebase' });
  }
});

// 4. Rota para Síntese Visual Seinen
app.post('/api/gerar-imagem', async (req, res) => {
  try {
    const { prompt, panelNumber } = req.body;
    return res.json({
      success: true,
      prompt,
      panelNumber,
      message: 'Prompt formatado para gerador de imagens Midjourney/Flow'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro na sintetização' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
  });
}

startServer();
