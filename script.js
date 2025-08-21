 document.getElementById('donationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const thankYouMessage = document.getElementById('thankYouMessage');
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validação
            if (!nome || !email) {
                alert('Por favor, preencha todos os campos para confirmar sua doação.');
                return;
            }
            
            // Animação de loading
            submitBtn.innerHTML = '<span class="loading"></span>Processando Doação...';
            submitBtn.disabled = true;
            
            // Simular processamento
            setTimeout(() => {
                // Resetar botão
                submitBtn.innerHTML = 'Confirmar Doação';
                submitBtn.disabled = false;
                
                // Mensagem personalizada profissional
                thankYouMessage.innerHTML = `
                    <h2>Obrigado por sua generosidade!</h2>
                    <p><span class="highlight">${nome}</span>, sua doação faz toda a diferença.</p>
                    <p>Seja muito bem-vindo(a) à nossa comunidade de apoiadores.</p>
                    <p style="font-weight: bold; font-size: 18px; color: #DC143C; margin: 20px 0;">Juntos, vamos transformar vidas!</p>
                    <div class="email-confirmation">
                        <p><strong>✉️ Confirmação enviada para:</strong><br>${email}</p>
                    </div>
                `;
                
                // Mostrar mensagem de sucesso
                successMessage.style.display = 'flex';
                successMessage.classList.add('show');
                
                // Limpar formulário
                document.getElementById('donationForm').reset();
                
                // Auto-fechar após 10 segundos
                if (autoCloseTimeout) {
                    clearTimeout(autoCloseTimeout);
                }
                autoCloseTimeout = setTimeout(closeModal, 10000);
                
            }, 2000);
        });

        // Auto-fechar após 10 segundos
        let autoCloseTimeout;

        // Fechar modal
        function closeModal() {
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'none';
            successMessage.classList.remove('show');
        }

        document.getElementById('closeBtn').addEventListener('click', closeModal);

        // Fechar modal clicando fora
        document.getElementById('successMessage').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Efeitos sutis nos inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-1px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });

        // Atualizar números de impacto (simulação)
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

        // Adicionar listener para mostrar mensagem após envio
        document.getElementById('donationForm').addEventListener('submit', function() {
            setTimeout(showSuccessMessage, 2000);
        });