// Servidor para rodar o projeto no computador (npm start).
// Na Vercel, as mesmas rotas rodam como funções da pasta api/.
require('dotenv').config();
const express = require('express');
const path = require('path');
const { enviarBoasVindas } = require('./lib/email');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/send-welcome', async (req, res) => {
    const { status, corpo } = await enviarBoasVindas(req.body);
    res.status(status).json(corpo);
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'online', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
});
