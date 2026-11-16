  // Integra o formulário de doação com a API de envio de emails
        // Mantém todas as animações e efeitos visuais existentes

        document.addEventListener('DOMContentLoaded', function() {
            
            const API_BASE_URL = window.location.origin; // Usa a mesma origem do frontend
            
            const formulario = document.getElementById('formularioDeDoacao');
            const botaoEnviar = document.getElementById('botaoEnviar');
            const mensagemDeSucesso = document.getElementById('mensagemDeSucesso');
            const mensagemDeAgradecimento = document.getElementById('mensagemDeAgradecimento');
            const botaoFechar = document.getElementById('botaoFechar');
            
            let timeoutFechamentoAutomatico;
            
            formulario.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Obter dados do formulário
                const nome = document.getElementById('nome').value.trim();
                const email = document.getElementById('email').value.trim();
                
                // Validação básica no frontend
                if (!nome || !email) {
                    mostrarErro('Por favor, preencha todos os campos para confirmar sua doação.');
                    return;
                }
                
                // Validação de email
                if (!emailValido(email)) {
                    mostrarErro('Por favor, insira um email válido.');
                    return;
                }
                
                // Iniciar animação de loading
                mostrarCarregamento();
                
                try {
                    // ========================================
                    // 4.1 CHAMADA PARA A API
                    // ========================================
                    const response = await fetch(`${API_BASE_URL}/api/send-welcome`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            nome: nome,
                            email: email
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.sucesso) {
                        // Sucesso - mostrar mensagem de agradecimento
                        mostrarSucesso(nome, email, data.emailId);
                        formulario.reset(); // Limpar formulário
                    } else {
                        mostrarErro(data.mensagem || 'Erro ao processar sua doação. Tente novamente.');
                    }
                    
                } catch (error) {
                    console.error('Erro ao conectar com a API:', error);
                    mostrarErro('Erro de conexão. Verifique sua internet e tente novamente.');
                } finally {
                    resetarBotao();
                }
            });
            
            function emailValido(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            function mostrarCarregamento() {
                botaoEnviar.innerHTML = '<span class="carregando"></span>Enviando...';
                botaoEnviar.disabled = true;
            }

            function resetarBotao() {
                botaoEnviar.innerHTML = 'Confirmar Doação';
                botaoEnviar.disabled = false;
            }
            
            function mostrarErro(mensagem) {
                // Criar um toast de erro temporário
                const toastErro = document.createElement('div');
                toastErro.className = 'toast-erro';
                toastErro.innerHTML = `
                    <div class="conteudoErro">
                        <span class="iconeErro">⚠️</span>
                        <span class="textoErro">${mensagem}</span>
                    </div>
                `;
                
                toastErro.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
                    z-index: 10000;
                    animation: deslizarParaDireita 0.3s ease-out;
                    max-width: 400px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                `;
                
                document.body.appendChild(toastErro);
                
                setTimeout(() => {
                    if (toastErro.parentNode) {
                        toastErro.style.animation = 'deslizarParaFora 0.3s ease-in';
                        setTimeout(() => {
                            document.body.removeChild(toastErro);
                        }, 300);
                    }
                }, 5000);
            }
            
            function mostrarSucesso(nome, email, emailId) {
                mensagemDeAgradecimento.innerHTML = `
                    <h2>Obrigado por sua generosidade!</h2>
                    <p><span class="destaque">${nome}</span>, sua doação faz toda a diferença.</p>
                    <p>Seja muito bem-vindo(a) à nossa comunidade de apoiadores.</p>
                    <p style="font-weight: bold; font-size: 18px; color: #DC143C; margin: 20px 0;">
                        Juntos, vamos transformar vidas!
                    </p>
                    <div class="confirmacaoDeEmail">
                        <p><strong> Confirmação enviada para:</strong><br>${email}</p>
                        ${emailId ? `<p class="idEmail">ID: ${emailId}</p>` : ''}
                    </div>
                `;
                
                mensagemDeSucesso.style.display = 'flex';
                mensagemDeSucesso.classList.add('mostrar');
                
                if (timeoutFechamentoAutomatico) {
                    clearTimeout(timeoutFechamentoAutomatico);
                }
                timeoutFechamentoAutomatico = setTimeout(fecharModal, 10000);
            }
            
            function fecharModal() {
                mensagemDeSucesso.style.display = 'none';
                mensagemDeSucesso.classList.remove('mostrar');
                if (timeoutFechamentoAutomatico) {
                    clearTimeout(timeoutFechamentoAutomatico);
                }
            }

            botaoFechar.addEventListener('click', fecharModal);
            
            mensagemDeSucesso.addEventListener('click', function(e) {
                if (e.target === this) {
                    fecharModal();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mensagemDeSucesso.classList.contains('mostrar')) {
                    fecharModal();
                }
            });
            
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-1px)';
                    this.parentElement.style.boxShadow = '0 5px 15px rgba(220, 20, 60, 0.2)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'translateY(0)';
                    this.parentElement.style.boxShadow = 'none';
                });
            });

            function atualizarNumerosDeImpacto() {
                const elementoVidas = document.querySelector('.numeroEstatistica');
                if (elementoVidas) {
                    let numeroAtual = parseInt(elementoVidas.textContent.replace('.', ''));
                    setInterval(() => {
                        numeroAtual += Math.floor(Math.random() * 3);
                        elementoVidas.textContent = numeroAtual.toLocaleString('pt-BR');
                    }, 30000);
                }
            }
            
            atualizarNumerosDeImpacto();

            async function verificarStatusAPI() {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/status`);
                    const data = await response.json();
                    console.log('✅ API Status:', data.status);
                } catch (error) {
                    console.warn('⚠️ API não está respondendo:', error);
                }
            }

            verificarStatusAPI();
        });
