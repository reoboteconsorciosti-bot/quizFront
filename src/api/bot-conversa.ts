/**
 * Serviço de integração com o BotConversa
 */

const BOTCONVERSA_API_KEY = "SUA_API_KEY_AQUI"; // TODO: Substituir pela chave real
const BOTCONVERSA_WEBHOOK_URL = "https://backend.botconversa.com.br/api/v1/webhook/subscriber/"; // URL padrão

export interface QuizLead {
  nome: string;
  telefone: string;
  perfil: "executor" | "analista" | "guardiao" | "visionario" | "construtor";
  objetivo: "imovel" | "veiculo" | "investimento" | "patrimonio";
  tag: string;
}

export async function processLeadToBotConversa(lead: QuizLead) {
  try {
    console.log(`Processando lead: ${lead.nome} (${lead.telefone})`);

    // No BotConversa, o webhook de entrada geralmente cria ou atualiza o contato
    // e aplica as tags/variáveis enviadas no payload.
    const response = await fetch(BOTCONVERSA_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": BOTCONVERSA_API_KEY,
      },
      body: JSON.stringify({
        phone: lead.telefone,
        first_name: lead.nome,
        // Variáveis personalizadas conforme o prompt
        fields: {
          perfil_quiz: lead.perfil,
          objetivo_quiz: lead.objetivo,
        },
        tags: [lead.tag],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do BotConversa: ${response.status} - ${errorText}`);
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Falha ao processar webhook para BotConversa:", error);
    return { success: false, error };
  }
}
