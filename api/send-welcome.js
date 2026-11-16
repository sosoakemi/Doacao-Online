// Função serverless da Vercel: POST /api/send-welcome
const { enviarBoasVindas } = require('../lib/email');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ sucesso: false, mensagem: 'Use POST.' });
    }
    const { status, corpo } = await enviarBoasVindas(req.body);
    res.status(status).json(corpo);
};
