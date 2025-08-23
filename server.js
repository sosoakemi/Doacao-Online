const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


let resend;
try {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend iniciado.');
} catch (error) {
    console.error('Erro ao iniciar Resend:', error.message);
}


let mensagem;
try {
    mensagem = require('./mensagem');
    console.log('Template carregado.');
} catch (error) {
    console.error('Erro ao carregar template:', error.message);
}


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/send-welcome', async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ sucesso: false, mensagem: 'Informe nome e email.' });
        }

        const textoPersonalizado = mensagem.texto.replace(/{{nome}}/g, nome.trim());
        const htmlPersonalizado = mensagem.html.replace(/{{nome}}/g, nome.trim());

        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: [email.trim()],
            subject: mensagem.assunto,
            text: textoPersonalizado,
            html: htmlPersonalizado
        });

        if (error) throw error;

        res.json({
            sucesso: true,
            mensagem: `Email enviado para ${nome}`,
            emailId: data.id
        });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar email'
        });
    }
});

app.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: [email],
            subject: 'Teste de Email',
            html: `<p>Se você recebeu este email, está funcionando!</p>`
        });

        if (error) throw error;

        res.json({ sucesso: true, mensagem: 'Email de teste enviado', emailId: data.id });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

// Status simples da API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
});
