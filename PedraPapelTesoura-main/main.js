const elementos = document.querySelectorAll(".opcao-jogador div > img");
let jogadorOpt = "";
let computadorOpt = "";

function resetOpacityJogador() {
  for (let i = 0; i < elementos.length; i++) {
    elementos[i].style.opacity = 0.3;
  }
}

function resetCoputador(opcaoComputador) {
  for (let i = 0; i < opcaoComputador.length; i++) {
    opcaoComputador[i].style.opacity = 0.3;
  }
}

function validarVitoria() {
  let vencedor = document.querySelector("#resultado");
  if (jogadorOpt == "pedra") {
    if (computadorOpt == "pedra") {
      vencedor.innerHTML = "O jogo foi empatado";
    } else if (computadorOpt == "papel") {
      vencedor.innerHTML = "O computador ganhou";
    } else if (computadorOpt == "tesoura") {
      vencedor.innerHTML = "Você Ganhou!!!";
    }
  } else if (jogadorOpt == "papel") {
    if (computadorOpt == "pedra") {
      vencedor.innerHTML = "Você Ganhou!!!";
    } else if (computadorOpt == "papel") {
      vencedor.innerHTML = "O jogo foi empatado";
    } else if (computadorOpt == "tesoura") {
      vencedor.innerHTML = "O computador ganhou";
    }
  } else if (jogadorOpt == "tesoura") {
    if (computadorOpt == "pedra") {
      vencedor.innerHTML = "O computador ganhou";
    } else if (computadorOpt == "papel") {
      vencedor.innerHTML = "Você Ganhou!!!";
    } else if (computadorOpt == "tesoura") {
      vencedor.innerHTML = "O jogo foi empatado";
    }
  }
}

function computadorJogar() {
  let rand = Math.floor(Math.random() * 3);
  const opcaoComputador = document.querySelectorAll(
    ".opcao-computador div > img"
  );
  resetCoputador(opcaoComputador);

  for (let i = 0; i < opcaoComputador.length; i++) {
    if (i == rand) {
      opcaoComputador[i].style.opacity = 1;
      computadorOpt = opcaoComputador[i].getAttribute("opt");
    }
  }
  validarVitoria();
}

for (let i = 0; i < elementos.length; i++) {
  elementos[i].addEventListener("click", function (t) {
    resetOpacityJogador();

    t.target.style.opacity = 1;
    jogadorOpt = t.target.getAttribute("opt");
    computadorJogar();
  });
}
