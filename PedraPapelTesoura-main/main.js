let jogadorEscolhas = [];
let computadorOpt = "";
let dificuldade = 'facil'; // Modo padrão

// Função para configurar a dificuldade
function setDificuldade(nivel) {
  dificuldade = nivel;
  alert(`Modo ${nivel.charAt(0).toUpperCase() + nivel.slice(1)} ativado!`);
}

// Função para analisar o padrão de escolhas do jogador
function analisarEscolhasJogador() {
  if (jogadorEscolhas.length < 2) return null;

  const ultimaEscolha = jogadorEscolhas[jogadorEscolhas.length - 1];
  const penultimaEscolha = jogadorEscolhas[jogadorEscolhas.length - 2];
  
  if (ultimaEscolha === penultimaEscolha) {
    return ultimaEscolha === 'pedra' ? 'papel' :
           ultimaEscolha === 'papel' ? 'tesoura' : 'pedra';
  }

  return null;
}

// Função que implementa a estratégia difícil
function estrategiaDificil(jogadorEscolha) {
  let escolhaPrevista = analisarEscolhasJogador();
  if (escolhaPrevista) {
    if (escolhaPrevista === 'pedra') return 1;
    if (escolhaPrevista === 'papel') return 2;
    if (escolhaPrevista === 'tesoura') return 0;
  }
  return Math.floor(Math.random() * 3);
}

function computadorJogar() {
  let rand = (dificuldade === 'facil') ? Math.floor(Math.random() * 3) : estrategiaDificil(jogadorOpt);
  const opcaoComputador = document.querySelectorAll(".opcao-computador img");
  resetCoputador(opcaoComputador);
  opcaoComputador[rand].style.opacity = 1;
  computadorOpt = opcaoComputador[rand].getAttribute("opt");
  validarVitoria();
}

const elementos = document.querySelectorAll(".opcao-jogador img");
let jogadorOpt = "";

function resetOpacityJogador() {
  elementos.forEach(img => img.style.opacity = 0.3);
}

function resetCoputador(opcaoComputador) {
  opcaoComputador.forEach(img => img.style.opacity = 0.3);
}

function validarVitoria() {
  let vencedor = document.querySelector("#resultado");
  if (jogadorOpt === computadorOpt) {
    vencedor.innerHTML = "Empate!";
  } else if (
    (jogadorOpt === "pedra" && computadorOpt === "tesoura") ||
    (jogadorOpt === "papel" && computadorOpt === "pedra") ||
    (jogadorOpt === "tesoura" && computadorOpt === "papel")
  ) {
    vencedor.innerHTML = "Você Ganhou!!!";
  } else {
    vencedor.innerHTML = "O computador ganhou!";
  }
}

elementos.forEach(img => img.addEventListener('click', (e) => {
  resetOpacityJogador();
  e.target.style.opacity = 1;
  jogadorOpt = e.target.getAttribute("opt");
  jogadorEscolhas.push(jogadorOpt);
  computadorJogar();
}));

// Modal
const modal = document.getElementById("modal-ajuda");
const btnAjuda = document.getElementById("btn-ajuda");
const fecharModal = document.getElementById("fechar-modal");

btnAjuda.addEventListener("click", () => {
  modal.style.display = "block";
});

fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});
