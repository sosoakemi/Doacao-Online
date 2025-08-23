const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Verificações iniciais
console.log('🔍 VERIFICAÇÕES INICIAIS:');
console.log('PORT:', process.env.PORT || 3000);
console.log('RESEND_API_KEY existe:', !!process.env.RESEND_API_KEY);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Resend
let resend;
try {
    const { Resend } = require('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar Resend:', error.message);
}

// Carregar template de mensagem
let mensagem;
try {
    mensagem = require('./mensagem');
    console.log('✅ Template carregado com sucesso');
    console.log('📧 Assunto:', mensagem.assunto);
    console.log('📝 HTML existe:', !!mensagem.html);
} catch (error) {
    console.error('❌ Erro ao carregar mensagem.js:', error.message);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de envio com melhorias
app.post('/send-welcome', async (req, res) => {
    console.log('\n📧 NOVA REQUISIÇÃO DE EMAIL:');
    console.log('Body:', req.body);
    
    try {
        if (!mensagem) {
            throw new Error('Template não carregado');
        }
        
        if (!resend) {
            throw new Error('Resend não inicializado');
        }
        
        const { nome, email } = req.body;
        
        // Validações
        if (!nome || !email) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome e email são obrigatórios'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Formato de email inválido'
            });
        }

        // Personalizar templates com data
        const dataAtual = new Date().toLocaleString('pt-BR');
        const assunto = mensagem.assunto;
        const textoPersonalizado = mensagem.texto.replace(/{{nome}}/g, nome.trim());
        const htmlPersonalizado = mensagem.html
            .replace(/{{nome}}/g, nome.trim())
            .replace(/{{data}}/g, dataAtual);

        console.log('📤 Enviando email...');
        console.log('Para:', email);
        console.log('De:', process.env.FROM_EMAIL);
        console.log('Assunto:', assunto);

        // Configuração OTIMIZADA para evitar filtros de spam
        const emailData = {
            from: process.env.FROM_EMAIL, // Use exatamente como está no .env
            to: [email.trim()],
            subject: assunto,
            text: textoPersonalizado,
            html: htmlPersonalizado,
            // Headers otimizados para deliverability
            headers: {
                'Message-ID': `<donation-${Date.now()}@resend.dev>`,
                'X-Mailer': 'Sistema Doacao Online v1.0',
                'List-Unsubscribe': '<mailto:unsubscribe@exemplo.com>',
                'Precedence': 'bulk',
                'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
            },
            // Tags para organização
            tags: [
                { name: 'tipo', value: 'confirmacao-doacao' },
                { name: 'sistema', value: 'doacao-online' }
            ]
        };

        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('❌ Erro do Resend:', error);
            throw new Error(`Falha no envio: ${error.message}`);
        }

        console.log('✅ Email enviado com sucesso!');
        console.log('📧 ID:', data.id);

        res.json({
            sucesso: true,
            mensagem: `Email de confirmação enviado para ${nome}!`,
            emailId: data.id,
            destinatario: email
        });

    } catch (error) {
        console.error('💥 ERRO:', error.message);
        
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar email de confirmação',
            erro_debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Rota de teste para verificar se email chega
app.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        const { data, error } = await resend.emails.send({
            from: `Teste <${process.env.FROM_EMAIL}>`,
            to: [email],
            subject: 'Teste de Entrega - Doação Online',
            html: `
                <h1>✅ Email de Teste</h1>
                <p>Se você recebeu este email, a configuração está funcionando!</p>
                <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><small>Este é um email de teste do sistema de doações.</small></p>
            `
        });

        if (error) throw error;

        res.json({
            sucesso: true,
            mensagem: 'Email de teste enviado!',
            emailId: data.id
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: error.message
        });
    }
});

// Rota de status melhorada
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        mensagem: 'API funcionando corretamente!',
        timestamp: new Date().toISOString(),
        debug: {
            resend_inicializado: !!resend,
            template_carregado: !!mensagem,
            api_key_configurada: !!process.env.RESEND_API_KEY,
            from_email: process.env.FROM_EMAIL,
            ambiente: process.env.NODE_ENV || 'development'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`
🚀 Servidor iniciado com sucesso!
🌐 Acesse: http://localhost:${PORT}
📊 Status: http://localhost:${PORT}/api/status
🧪 Teste: POST http://localhost:${PORT}/test-email

📧 FROM_EMAIL configurado: ${process.env.FROM_EMAIL}
🔑 API Key configurada: ${!!process.env.RESEND_API_KEY ? 'SIM' : 'NÃO'}
    `);
});

module.exports = app;