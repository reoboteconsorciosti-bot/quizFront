import { Request, Response } from 'express';

import { sendToBotConversa } from '../services/botConversaService';
import { QuizPayload } from '../types/quiz';

export const processQuizWebhook = async (req: Request, res: Response) => {
  try {
    const payload: QuizPayload = req.body;

    // Validação básica (perfil agora é opcional na captura inicial)
    if (!payload.nome || !payload.telefone || !payload.consultor) {
      console.warn(`[Webhook] Payload inválido recebido:`, payload);
      return res.status(400).json({ 
        error: 'Campos obrigatórios ausentes (nome, telefone, consultor)' 
      });
    }

    // Log de recebimento
    console.log(`[Webhook] Dados recebidos do quiz: ${payload.nome} - ${payload.perfil}`);

    // Integração com BotConversa
    const result = await sendToBotConversa(payload);

    return res.status(200).json({
      message: 'Lead processado e enviado ao BotConversa com sucesso',
      data: result
    });

  } catch (error: any) {
    console.error(`[Webhook] Falha no processamento:`, error.message);
    return res.status(500).json({
      error: 'Erro interno ao processar webhook',
      details: error.message
    });
  }
};
