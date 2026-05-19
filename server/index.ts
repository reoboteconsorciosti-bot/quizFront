import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processQuizWebhook } from './controllers/webhookController';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilita CORS para o frontend Vite
app.use(express.json()); // Parser para JSON

// Logs de requisição simples
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.post('/api/webhook', processQuizWebhook);

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('Backend Reobote Quiz is running');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor Backend Reobote Quiz rodando!
  📡 Endpoint: http://localhost:${PORT}/api/webhook
  🛠️  Porta: ${PORT}
  `);
});
