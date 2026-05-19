import axios from 'axios';
import dotenv from 'dotenv';
import { QuizPayload, BotConversaPayload } from '../types/quiz';

dotenv.config();

const BASE_URL = process.env.BOTCONVERSA_WEBHOOK_URL;

export const sendToBotConversa = async (data: QuizPayload) => {
  try {
    if (!BASE_URL) {
      throw new Error('Configuração do BotConversa (URL) não encontrada no .env');
    }

    console.log(`[BotConversa] Iniciando integração para: ${data.nome} (${data.telefone})`);

    const payload = {
      nome: data.nome,
      telefone: data.telefone,
      perfil: data.perfil,
      consultor: data.consultor,
      tag: data.tag || 'quiz'
    };

    console.log(`[BotConversa] Enviando payload para o Webhook:`, JSON.stringify(payload, null, 2));

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`[BotConversa] Resposta recebida do BotConversa:`, response.data);
    console.log(`[BotConversa] Sucesso: Lead enviado corretamente.`);
    return response.data;
  } catch (error: any) {
    console.error(`[BotConversa] Erro na integração:`, error.response?.data || error.message);
    throw error;
  }
};
