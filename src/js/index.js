// Variáveis Globais
const btSubmit = document.getElementById("btSubmit");
const inputGuess = document.getElementById("inputGuess");
const feedback = document.getElementById("feedback");
const attemptsList = document.getElementById("attemptsList");
const restartGame = document.getElementById("restartGame");

let secretNumber = generateSecretNumber(); // Número secreto gerado ao iniciar
let attempts = [];

// Gera um número secreto de 4 dígitos únicos
function generateSecretNumber() {
  const digits = [];
  while (digits.length < 4) {
    const randomDigit = Math.floor(Math.random() * 10);
    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  return digits.join(""); // Converte para string
}

// Compara o palpite com o número secreto
function checkGuess(guess) {
  let bulls = 0;
  let cows = 0;
  const secretUsed = []; // Para rastrear quais posições já foram usadas para Bulls
  const guessUsed = [];  // Para rastrear quais posições já foram usadas no palpite

  // Primeiro, verifica os Bulls (correto e na posição certa)
  for (let i = 0; i < guess.length; ++i) {
    if (guess[i] === secretNumber[i]) {
      bulls++;
      secretUsed[i] = true; // Marca a posição do segredo como usada
      guessUsed[i] = true;   // Marca a posição do palpite como usada
    }
  }

  // Agora, verifica as Cows (correto, mas na posição errada)
  for (let i = 0; i < guess.length; ++i) {
    if (!guessUsed[i]) { // Se o número ainda não foi usado como Bull
      for (let j = 0; j < secretNumber.length; ++j) {
        if (!secretUsed[j] && guess[i] === secretNumber[j]) { // Se o número no palpite está no segredo
          cows++;
          secretUsed[j] = true; // Marca a posição do segredo como usada
          break; // Não é necessário continuar a busca para este dígito
        }
      }
    }
  }

  return { bulls, cows };
}

// Atualiza a lista de tentativas na interface
function updateAttemptsList() {
  attemptsList.innerHTML = "";
  for (let i = 0; i < attempts.length; ++i) {
    const attempt = attempts[i];
    const li = document.createElement("li");
    li.textContent = `Palpite: ${attempt.guess}, Bulls: ${attempt.bulls}, Cows: ${attempt.cows}`;
    attemptsList.appendChild(li);
  }
}

// Lida com o envio do palpite
function handleGuess() {
  const guess = inputGuess.value;

  // Validação do input
  if (guess.length !== 4 || new Set(guess).size !== 4 || isNaN(guess)) {
    feedback.textContent = "Por favor, insira um número de 4 dígitos únicos.";
    feedback.classList.remove("success");
    return;
  }

  // Verifica o palpite
  const result = checkGuess(guess);
  attempts.push({ guess, ...result });

  // Feedback para o jogador
  if (result.bulls === 4) {
    feedback.textContent = "Parabéns! Você adivinhou o número secreto!";
    feedback.classList.add("success");
    btSubmit.disabled = true; // Desativa o botão após vencer
    inputGuess.disabled = true; // Bloqueia o campo de input
    restartGame.style.display = "block"; // Exibe botão de reinício
  } else {
    feedback.textContent = `Bulls: ${result.bulls}, Cows: ${result.cows}`;
    feedback.classList.remove("success");
  }

  updateAttemptsList();
  inputGuess.value = ""; // Limpa o input
}

// Reinicia o jogo
function resetGame() {
  secretNumber = generateSecretNumber(); // Gera novo número secreto
  attempts = []; // Reseta as tentativas
  attemptsList.innerHTML = ""; // Limpa a lista de tentativas
  feedback.textContent = ""; // Limpa o feedback
  feedback.classList.remove("success");
  btSubmit.disabled = false; // Reativa o botão de envio
  inputGuess.disabled = false; // Reativa o input
  inputGuess.value = ""; // Limpa o input
  restartGame.style.display = "none"; // Esconde botão de reinício

  // Log do número secreto para testes
  console.log("Novo número secreto:", secretNumber);
}

// Configura eventos
btSubmit.onclick = handleGuess;
restartGame.onclick = resetGame;

// Log do número secreto para testes (remova em produção)
console.log("Número secreto:", secretNumber);
