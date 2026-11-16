const mensagem = require('../mensagem');

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Evita que alguém injete HTML no email usando o campo "nome".
function escaparHtml(texto) {
    return texto.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/**
 * Valida os dados e envia o email de agradecimento pelo Resend.
 * Devolve { status, corpo } para ser usado tanto pelo Express quanto pelas funções da Vercel.
 */
async function enviarBoasVindas(dados) {
    const nome = String(dados?.nome ?? '').trim().slice(0, 100);
    const email = String(dados?.email ?? '').trim().slice(0, 200);

    if (!nome || !EMAIL_VALIDO.test(email)) {
        return { status: 400, corpo: { sucesso: false, mensagem: 'Informe um nome e um email válidos.' } };
    }

    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
        console.error('RESEND_API_KEY ou FROM_EMAIL não configurados.');
        return { status: 503, corpo: { sucesso: false, mensagem: 'Envio de email indisponível no momento.' } };
    }

    try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: [email],
            subject: mensagem.assunto,
            text: mensagem.texto.replace(/{{nome}}/g, nome),
            html: mensagem.html.replace(/{{nome}}/g, escaparHtml(nome)),
        });
        if (error) throw error;
        return { status: 200, corpo: { sucesso: true, mensagem: `Email enviado para ${nome}`, emailId: data.id } };
    } catch (erro) {
        console.error('Erro ao enviar email:', erro);
        return { status: 500, corpo: { sucesso: false, mensagem: 'Erro ao enviar email. Tente novamente.' } };
    }
}

module.exports = { enviarBoasVindas };
