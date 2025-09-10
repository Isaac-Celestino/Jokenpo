class JokenpoGame {
    constructor() {
        this.playerHistory = [];
        this.gameHistory = [];
        this.stats = { wins: 0, losses: 0, draws: 0, total: 0 };
        this.difficulty = 'easy';
        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceNames = {
            rock: 'Pedra 🪨',
            paper: 'Papel 📄',
            scissors: 'Tesoura ✂️'
        };
        this.init();
        this.createParticles();
    }

    init() {
        this.bindEvents();
        this.loadStats();
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    bindEvents() {
        document.getElementById('player-choices').addEventListener('click', (e) => {
            const choice = e.target.closest('.choice');
            if (choice) {
                this.playerChoice(choice.dataset.choice);
            }
        });

        document.getElementById('btn-help').addEventListener('click', () => {
            document.getElementById('help-modal').style.display = 'block';
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('btn-easy').addEventListener('click', () => {
            this.setDifficulty('easy');
        });

        document.getElementById('btn-hard').addEventListener('click', () => {
            this.setDifficulty('hard');
        });

        document.getElementById('btn-reset').addEventListener('click', () => {
            this.resetGame();
        });

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('help-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        document.getElementById('help-modal').style.display = 'none';
    }

    setDifficulty(level) {
        this.difficulty = level;
        const message = level === 'easy' ? 'Modo Fácil ativado! 🟢' : 'Modo Difícil ativado! 🔴';
        this.showNotification(message);
    }

    showNotification(message) {
        // Criar notificação personalizada
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #64ffda, #00bcd4);
            color: #0f0f23;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async playerChoice(choice) {
        this.clearSelections();
        
        // Marcar escolha do jogador
        const playerChoiceEl = document.querySelector(`#player-choices .choice[data-choice="${choice}"]`);
        playerChoiceEl.classList.add('selected');
        
        document.getElementById('player-choice-text').textContent = this.choiceNames[choice];
        
        // Countdown
        await this.showCountdown();
        
        // Computador joga
        const computerChoice = this.getComputerChoice(choice);
        
        // Marcar escolha do computador
        const computerChoiceEl = document.querySelector(`#computer-choices .choice[data-choice="${computerChoice}"]`);
        computerChoiceEl.classList.add('selected');
        
        document.getElementById('computer-choice-text').textContent = this.choiceNames[computerChoice];
        
        // Determinar resultado
        const result = this.determineWinner(choice, computerChoice);
        this.displayResult(result, choice, computerChoice);
        
        // Salvar no histórico
        this.playerHistory.push(choice);
        this.gameHistory.unshift({
            player: choice,
            computer: computerChoice,
            result: result,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Atualizar estatísticas
        this.updateStats(result);
        this.updateHistory();
    }

    async showCountdown() {
        const numbers = ['3', '2', '1', 'JÁ!'];
        
        for (const num of numbers) {
            const countdown = document.createElement('div');
            countdown.className = 'countdown';
            countdown.textContent = num;
            document.body.appendChild(countdown);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            countdown.remove();
        }
    }

    getComputerChoice(playerChoice) {
        if (this.difficulty === 'easy') {
            return this.choices[Math.floor(Math.random() * 3)];
        } else {
            return this.getSmartChoice(playerChoice);
        }
    }

    getSmartChoice(playerChoice) {
        if (this.playerHistory.length < 2) {
            return this.choices[Math.floor(Math.random() * 3)];
        }

        // Analisar padrões
        const lastTwo = this.playerHistory.slice(-2);
        const patterns = {
            'rock,rock': 'paper',
            'paper,paper': 'scissors',
            'scissors,scissors': 'rock',
            'rock,paper': 'scissors',
            'paper,scissors': 'rock',
            'scissors,rock': 'paper'
        };

        const patternKey = lastTwo.join(',');
        const predictedChoice = patterns[patternKey];
        
        if (predictedChoice) {
            // Escolher a jogada que vence a previsão
            const winningChoices = {
                'rock': 'paper',
                'paper': 'scissors',
                'scissors': 'rock'
            };
            return winningChoices[predictedChoice];
        }

        // Se não encontrar padrão, jogar aleatório
        return this.choices[Math.floor(Math.random() * 3)];
    }

    determineWinner(player, computer) {
        if (player === computer) return 'draw';
        
        const winConditions = {
            'rock': 'scissors',
            'paper': 'rock',
            'scissors': 'paper'
        };
        
        return winConditions[player] === computer ? 'win' : 'lose';
    }

    displayResult(result, playerChoice, computerChoice) {
        const resultEl = document.getElementById('result');
        const messages = {
            win: '🎉 Você Venceu! 🎉',
            lose: '😤 Computador Venceu! 😤',
            draw: '🤝 Empate! 🤝'
        };
        
        resultEl.textContent = messages[result];
        resultEl.className = `result ${result}`;
    }

    updateStats(result) {
        this.stats[result === 'win' ? 'wins' : result === 'lose' ? 'losses' : 'draws']++;
        this.stats.total++;
        
        document.getElementById('wins').textContent = this.stats.wins;
        document.getElementById('losses').textContent = this.stats.losses;
        document.getElementById('draws').textContent = this.stats.draws;
        document.getElementById('total').textContent = this.stats.total;
        
        this.saveStats();
    }

    updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.gameHistory.slice(0, 10).forEach(game => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            const resultIcon = {
                win: '🏆',
                lose: '💀',
                draw: '🤝'
            };
            
            item.innerHTML = `
                <span>${resultIcon[game.result]} ${this.choiceNames[game.player]} vs ${this.choiceNames[game.computer]}</span>
                <span>${game.timestamp}</span>
            `;
            
            historyList.appendChild(item);
        });
    }

    clearSelections() {
        document.querySelectorAll('.choice').forEach(choice => {
            choice.classList.remove('selected');
        });
    }

    resetGame() {
        this.playerHistory = [];
        this.gameHistory = [];
        this.stats = { wins: 0, losses: 0, draws: 0, total: 0 };
        
        this.updateStats('draw'); // Para atualizar display sem somar
        this.stats.draws--; // Remover o empate que foi adicionado
        document.getElementById('draws').textContent = '0';
        
        document.getElementById('history-list').innerHTML = '';
        document.getElementById('result').textContent = 'Jogo resetado! Faça sua escolha!';
        document.getElementById('result').className = 'result';
        document.getElementById('player-choice-text').textContent = 'Escolha sua jogada!';
        document.getElementById('computer-choice-text').textContent = 'Aguardando...';
        
        this.clearSelections();
        this.showNotification('Jogo resetado! 🔄');
    }

    saveStats() {
        // Simular salvamento (localStorage não funciona no ambiente do Claude)
        try {
            localStorage.setItem('jokenpoStats', JSON.stringify(this.stats));
            localStorage.setItem('jokenpoHistory', JSON.stringify(this.gameHistory));
        } catch (error) {
            console.log('Stats saved in memory:', this.stats);
        }
    }

    loadStats() {
        // Simular carregamento (localStorage não funciona no ambiente do Claude)
        try {
            const savedStats = localStorage.getItem('jokenpoStats');
            const savedHistory = localStorage.getItem('jokenpoHistory');
            
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
                this.updateStatsDisplay();
            }
            
            if (savedHistory) {
                this.gameHistory = JSON.parse(savedHistory);
                this.updateHistory();
            }
        } catch (error) {
            console.log('Stats loaded from memory');
        }
    }

    updateStatsDisplay() {
        document.getElementById('wins').textContent = this.stats.wins;
        document.getElementById('losses').textContent = this.stats.losses;
        document.getElementById('draws').textContent = this.stats.draws;
        document.getElementById('total').textContent = this.stats.total;
    }
}

// Funções globais para compatibilidade com o HTML
function closeModal() {
    document.getElementById('help-modal').style.display = 'none';
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new JokenpoGame();
});