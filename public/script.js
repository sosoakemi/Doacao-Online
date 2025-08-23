// ========================================
// SCRIPT INTEGRADO - FRONTEND + API
// ========================================
// Integra o formulário de doação com a API de envio de emails
// Mantém todas as animações e efeitos visuais existentes

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. CONFIGURAÇÃO DA API
    // ========================================
    const API_BASE_URL = window.location.origin; // Usa a mesma origem do frontend
    
    // ========================================
    // 2. ELEMENTOS DO DOM
    // ========================================
    const form = document.getElementById('donationForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const closeBtn = document.getElementById('closeBtn');
    
    // ========================================
    // 3. VARIÁVEIS DE CONTROLE
    // ========================================
    let autoCloseTimeout;
    
    // ========================================
    // 4. FUNÇÃO PRINCIPAL - ENVIO DO FORMULÁRIO
    // ========================================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validação básica no frontend
        if (!nome || !email) {
            showError('Por favor, preencha todos os campos para confirmar sua doação.');
            return;
        }
        
        // Validação de email
        if (!isValidEmail(email)) {
            showError('Por favor, insira um email válido.');
            return;
        }
        
        // Iniciar animação de loading
        showLoading();
        
        try {
            // ========================================
            // 4.1 CHAMADA PARA A API
            // ========================================
            const response = await fetch(`${API_BASE_URL}/send-welcome`, {
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
            
            // ========================================
            // 4.2 TRATAMENTO DA RESPOSTA
            // ========================================
            if (data.sucesso) {
                // Sucesso - mostrar mensagem de agradecimento
                showSuccess(nome, email, data.emailId);
                form.reset(); // Limpar formulário
            } else {
                // Erro retornado pela API
                showError(data.mensagem || 'Erro ao processar sua doação. Tente novamente.');
            }
            
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
            showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            // Resetar botão independente do resultado
            resetButton();
        }
    });
    
    // ========================================
    // 5. FUNÇÕES AUXILIARES
    // ========================================
    
    /**
     * Valida formato do email
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Mostra animação de loading no botão
     */
    function showLoading() {
        submitBtn.innerHTML = '<span class="loading"></span>Enviando...';
        submitBtn.disabled = true;
    }
    
    /**
     * Reseta o botão ao estado original
     */
    function resetButton() {
        submitBtn.innerHTML = 'Confirmar Doação';
        submitBtn.disabled = false;
    }
    
    /**
     * Mostra mensagem de erro
     */
    function showError(message) {
        // Criar um toast de erro temporário
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        // Adicionar estilos inline para o toast
        errorToast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(errorToast);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (errorToast.parentNode) {
                errorToast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    document.body.removeChild(errorToast);
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Mostra modal de sucesso
     */
    function showSuccess(nome, email, emailId) {
        // Mensagem personalizada com informações da API
        thankYouMessage.innerHTML = `
            <h2>Obrigado por sua generosidade!</h2>
            <p><span class="highlight">${nome}</span>, sua doação faz toda a diferença.</p>
            <p>Seja muito bem-vindo(a) à nossa comunidade de apoiadores.</p>
            <p style="font-weight: bold; font-size: 18px; color: #DC143C; margin: 20px 0;">
                Juntos, vamos transformar vidas!
            </p>
            <div class="email-confirmation">
                <p><strong>✉️ Confirmação enviada para:</strong><br>${email}</p>
                ${emailId ? `<p class="email-id">ID: ${emailId}</p>` : ''}
            </div>
        `;
        
        // Mostrar modal
        successMessage.style.display = 'flex';
        successMessage.classList.add('show');
        
        // Auto-fechar após 10 segundos
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
        }
        autoCloseTimeout = setTimeout(closeModal, 10000);
    }
    
    /**
     * Fecha o modal de sucesso
     */
    function closeModal() {
        successMessage.style.display = 'none';
        successMessage.classList.remove('show');
        if (autoCloseTimeout) {
            clearTimeout(autoCloseTimeout);
        }
    }
    
    // ========================================
    // 6. EVENT LISTENERS
    // ========================================
    
    // Fechar modal com botão X
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal clicando fora
    successMessage.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successMessage.classList.contains('show')) {
            closeModal();
        }
    });
    
    // ========================================
    // 7. EFEITOS VISUAIS NOS INPUTS (MANTIDOS)
    // ========================================
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
    
    // ========================================
    // 8. ATUALIZAÇÃO DE NÚMEROS DE IMPACTO (MANTIDA)
    // ========================================
    function updateImpactNumbers() {
        const livesElement = document.querySelector('.stat-number');
        if (livesElement) {
            let currentNumber = parseInt(livesElement.textContent.replace('.', ''));
            setInterval(() => {
                currentNumber += Math.floor(Math.random() * 3);
                livesElement.textContent = currentNumber.toLocaleString('pt-BR');
            }, 30000);
        }
    }
    
    updateImpactNumbers();
    
    // ========================================
    // 9. VERIFICAÇÃO DE STATUS DA API
    // ========================================
    async function checkAPIStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/status`);
            const data = await response.json();
            console.log('✅ API Status:', data.status);
        } catch (error) {
            console.warn('⚠️ API não está respondendo:', error);
        }
    }
    
    // Verificar status da API ao carregar
    checkAPIStatus();
});

// ========================================
// 10. ESTILOS CSS ADICIONAIS PARA TOAST DE ERRO
// ========================================
// Adicionar estilos de animação para o toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-icon {
        font-size: 20px;
    }
    
    .error-text {
        font-size: 14px;
        font-weight: 500;
    }
    
    .email-id {
        font-size: 12px !important;
        opacity: 0.7;
        margin-top: 5px !important;
    }
`;

document.head.appendChild(style);