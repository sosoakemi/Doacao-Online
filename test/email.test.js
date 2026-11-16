const test = require('node:test');
const assert = require('node:assert');

// Troca o Resend por um falso para testar sem enviar emails de verdade.
const enviados = [];
require.cache[require.resolve('resend')] = {
    exports: { Resend: class { constructor() { this.emails = { send: async (msg) => { enviados.push(msg); return { data: { id: 'teste-123' }, error: null }; } }; } } },
};
const { enviarBoasVindas } = require('../lib/email');

test('recusa nome vazio ou email inválido', async () => {
    assert.equal((await enviarBoasVindas({ nome: '', email: 'a@b.com' })).status, 400);
    assert.equal((await enviarBoasVindas({ nome: 'Ana', email: 'invalido' })).status, 400);
    assert.equal((await enviarBoasVindas(undefined)).status, 400);
});

test('responde 503 quando a chave não está configurada', async () => {
    delete process.env.RESEND_API_KEY;
    assert.equal((await enviarBoasVindas({ nome: 'Ana', email: 'ana@exemplo.com' })).status, 503);
});

test('envia o email e escapa HTML no nome', async () => {
    process.env.RESEND_API_KEY = 're_teste';
    process.env.FROM_EMAIL = 'teste@exemplo.com';
    const { status, corpo } = await enviarBoasVindas({ nome: '<b>Ana</b>', email: ' ana@exemplo.com ' });
    assert.equal(status, 200);
    assert.equal(corpo.emailId, 'teste-123');
    assert.deepEqual(enviados[0].to, ['ana@exemplo.com']);
    assert.ok(enviados[0].html.includes('&lt;b&gt;Ana&lt;/b&gt;'));
    assert.ok(!enviados[0].html.includes('<b>Ana</b>'));
});
