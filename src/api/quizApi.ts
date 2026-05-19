/**
 * Serviço de API do Frontend para comunicação com o Backend Express
 */

const BACKEND_URL = 'http://localhost:3001/api/webhook';

export interface QuizData {
  nome: string;
  telefone: string;
  perfil: 'executor' | 'analista' | 'construtor' | 'visionario' | 'guardiao';
  objetivo: 'imovel' | 'veiculo' | 'investimento' | 'patrimonio';
  tag?: string;
}

/**
 * Envia os resultados do quiz para o backend
 */
export async function submitQuizResults(data: QuizData) {
  try {
    console.log('Enviando dados para o backend...', data);
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        tag: data.tag || 'quiz'
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao enviar dados para o servidor');
    }

    console.log('Sucesso!', result);
    return result;
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    throw error;
  }
}
