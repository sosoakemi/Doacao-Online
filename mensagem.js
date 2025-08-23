module.exports = {
    assunto: "Confirmação da sua doação - Obrigado!",

    texto: `Olá, {{nome}}!

Obrigado por querer ajudar. Sua doação vai fazer a diferença para famílias que precisam.

Estamos felizes em ter você junto com a gente nessa causa.

Atenciosamente,
Equipe Doação Online, Lara Freitas, Sophia Akemi e Sophia Santana
`,

    html: `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Confirmação de Doação</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px;">
            <h2 style="color: #e2253eff;">Olá, {{nome}}!</h2>
            <p>Recebemos sua intenção de doação e agradecemos sua generosidade.</p>
            <p>Sua ajuda é muito importante para apoiar famílias que precisam.</p>
            <p>Obrigado por fazer parte dessa causa.</p>
            <p><strong>Equipe Doação Online, Lara Freitas, Sophia Akemi e Sophia Santana</strong></p>
        </div>
    </body>
    </html>
    `
};
