module.exports = {
    // ✅ Assunto sem emojis ou palavras que ativam filtros de spam
    assunto: "Confirmacao da sua doacao - Muito obrigado!",

    texto: `Ola, {{nome}}!

Recebemos sua intencao de doacao e queremos agradecer sua generosidade.

{{nome}}, sua contribuicao faz toda a diferenca em nossa missao de ajudar familias em situacao de vulnerabilidade.

Seja muito bem-vindo(a) a nossa comunidade de apoiadores. Juntos, podemos transformar muitas vidas!

Sua generosidade nos permite continuar nosso trabalho de assistencia e apoio as familias que mais precisam.

Atenciosamente,
Equipe Doacao Online

---
Este email foi enviado automaticamente pelo sistema de doacoes.
Se voce nao solicitou este email, pode ignorar esta mensagem.`,

    // ✅ HTML limpo e profissional para evitar filtros de spam
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmacao de Doacao</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            /* Reset para clientes de email */
            body, table, td, p, a, li, blockquote {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table, td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                outline: none;
                text-decoration: none;
            }
            
            /* Estilos principais */
            body {
                width: 100% !important;
                min-width: 100%;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
            }
            
            .header {
                background-color: #2c3e50;
                padding: 30px 20px;
                text-align: center;
            }
            
            .header h1 {
                color: #ffffff;
                font-size: 24px;
                margin: 0;
                font-weight: normal;
            }
            
            .content {
                padding: 30px 20px;
                line-height: 1.6;
                color: #333333;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #2c3e50;
            }
            
            .message-paragraph {
                margin-bottom: 16px;
                font-size: 16px;
                color: #555555;
            }
            
            .highlight {
                color: #e74c3c;
                font-weight: bold;
            }
            
            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
                font-weight: bold;
                color: #2c3e50;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
            }
            
            .disclaimer {
                font-size: 11px;
                color: #888888;
                margin-top: 15px;
            }
            
            /* Responsividade */
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                }
                .content, .header {
                    padding: 20px 15px !important;
                }
                .header h1 {
                    font-size: 20px !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Cabeçalho -->
            <div class="header">
                <h1>Doacao Online</h1>
                <p style="color: #bdc3c7; margin: 5px 0 0 0; font-size: 14px;">Transformando vidas atraves da solidariedade</p>
            </div>
            
            <!-- Conteúdo principal -->
            <div class="content">
                <div class="greeting">Ola, <span class="highlight">{{nome}}</span>!</div>
                
                <div class="message-paragraph">
                    Recebemos sua intencao de doacao e queremos agradecer sua generosidade.
                </div>
                
                <div class="message-paragraph">
                    <span class="highlight">{{nome}}</span>, sua contribuicao faz toda a diferenca 
                    em nossa missao de ajudar familias em situacao de vulnerabilidade.
                </div>
                
                <div class="message-paragraph">
                    Seja muito bem-vindo(a) a nossa comunidade de apoiadores. 
                    <strong>Juntos, podemos transformar muitas vidas!</strong>
                </div>
                
                <div class="message-paragraph">
                    Sua generosidade nos permite continuar nosso trabalho de assistencia 
                    e apoio as familias que mais precisam.
                </div>
                
                <div class="signature">
                    Atenciosamente,<br>
                    Equipe Doacao Online
                </div>
            </div>
            
            <!-- Rodapé -->
            <div class="footer">
                <p>Este email foi enviado automaticamente pelo sistema de doacoes.</p>
                <div class="disclaimer">
                    Se voce nao solicitou este email, pode ignorar esta mensagem.<br>
                    Sistema de Doacoes Online - Enviado em {{data}}
                </div>
            </div>
        </div>
    </body>
    </html>
    `
};