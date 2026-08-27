// Optimization Notes: Uses Fisher-Yates for optimal shuffling and direct array referencing for memory efficiency.

// DOM elements
const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves-count");
const timerDisplay = document.getElementById("timer-display");
const winModal = document.getElementById("win-modal");
const winMovesText = document.getElementById("win-moves-display");
const winTimeText = document.getElementById("win-time-display");
const restartBtn = document.getElementById("restart-btn");
const restartBtnModal = document.getElementById("restart-btn-modal");
const confettiCanvas = document.getElementById("confetti-canvas");

// Card pairs
const EMOJI_PAIRS = ["🐶", "🐶", "🐱", "🐱", "🐭", "🐭", "🐰", "🐰"];

// Game state variables
let firstFlipped = null;
let secondFlipped = null;
let isLocked = false;
let matchedPairs = 0;
let movesCount = 0;
let timeElapsed = 0;
let timerInterval = null;
let isTimerRunning = false;
let revealTimeoutId = null;
let matchTimeoutId = null;

// Shuffle function - starts from end goes till start, swapping with random index before it. This is the Fisher-Yates algorithm, which is optimal for shuffling.
function shuffle(array) {
  const deck = [...array];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Create game board - clears old cards and deals new ones face up
function renderBoard() {
  // As long as the game board has a card , delete it.
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  // Shuffle the deck and create random cards
  const deck = shuffle(EMOJI_PAIRS);
  const cards = [];
  isLocked = true; //prevent clicks during initial reveal

  deck.forEach((emoji, index) => {
    // Build card elements ( previously done in HTML, now created dynamically for better control and accessibility  )
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("is-flipped"); // Show face up initially
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    //Updated label to reflect that it's currently face up during reveal.
    card.setAttribute("aria-label", `Card ${index + 1}, face up, ${emoji}`);
    card.dataset.emoji = emoji;
    cards.push(card); // Remember this card for the reveal phase

    // Create front face of the card with ?
    const front = document.createElement("div");
    front.classList.add("card__front");
    front.textContent = "?";
    // Create back face of the card with the emoji
    const back = document.createElement("div");
    back.classList.add("card__back");
    back.textContent = emoji;
    //sticks front and back inside the card and then inside a wrapper , and finally the wrapper into the gameboard
    card.appendChild(front);
    card.appendChild(back);
    wrapper.appendChild(card);
    gameBoard.appendChild(wrapper);

    // Updated label to reflect that it's currently face up during reveal.
    wrapper.style.animationDelay = `${index * 50}ms`;

    // Added keyboard support for accessibility. Hooks into the main click logic below.
    card.addEventListener("click", onCardClick);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCardClick({ currentTarget: card });
      }
    });
  });

  // Initial card reveal phase , keeps cards face up for 2 seconds before flipping them back down and allowing player interaction.
  clearTimeout(revealTimeoutId);
  revealTimeoutId = setTimeout(() => {
    // Updated label to reflect that it's currently face down.
    cards.forEach((c, i) => {
      c.classList.remove("is-flipped");
      c.setAttribute("aria-label", `Card ${i + 1}, face down`);
    });
    isLocked = false;
  }, 2000);
}

// Handled by top-level declarations

// Updated using AI ->Card click logic - flips card and starts timer on first click, checks for matches on second click,
//  and prevents interaction during locked state or if card is already matched.
// Also updates accessibility labels to reflect current state of the card (face up/down).
// Hooks into both click and keyboard events for accessibility.
function onCardClick(event) {
  const card = event.currentTarget;

  if (
    isLocked ||
    card === firstFlipped ||
    card.classList.contains("is-matched")
  )
    return;

  card.classList.add("is-flipped");
  card.setAttribute("aria-label", `Card, face up, ${card.dataset.emoji}`);

  // Start timer on first click
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTimer();
  }

  if (!firstFlipped) {
    firstFlipped = card;
    return;
  }

  secondFlipped = card;
  movesCount++;
  movesDisplay.textContent = movesCount;
  checkForMatch();
}

// Check for card matches - compares if the two flipped cards are same
function checkForMatch() {
  const isMatch = firstFlipped.dataset.emoji === secondFlipped.dataset.emoji;
  if (isMatch) {
    handleMatch();
  } else {
    handleNoMatch();
  }
}

// Handle matched cards
function handleMatch() {
  firstFlipped.classList.add("is-matched");
  secondFlipped.classList.add("is-matched");
  matchedPairs++;
  resetTurn();
  checkForWin();
}

// Handle mismatched cards
function handleNoMatch() {
  isLocked = true;
  clearTimeout(matchTimeoutId);
  matchTimeoutId = setTimeout(() => {
    // Added defensive check to prevent error if game is restarted during this timeout.
    if (firstFlipped && secondFlipped) {
      firstFlipped.classList.remove("is-flipped");
      secondFlipped.classList.remove("is-flipped");
    }
    resetTurn();
  }, 1000);
}

// Reset turn variables
function resetTurn() {
  firstFlipped = null;
  secondFlipped = null;
  isLocked = false;
}

// Win screen logic
function checkForWin() {
  if (matchedPairs < 4) return;
  stopTimer();
  winModal.setAttribute("aria-hidden", "false");
  winMovesText.textContent = `Moves: ${movesCount}`;
  winTimeText.textContent = `Time: ${timerDisplay.textContent}`;
  fireConfetti();
}

// tells broswer to start the timer and updates the display every second with the elapsed time in minutes and seconds.
function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, "0");
    const seconds = String(timeElapsed % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// (errors and missing logics) Restart game + play again- resets all counts and starts a fresh board
function restartGame() {
  console.log("Restarting game..."); // Useful for user debugging

  // 1. Immediately stop any active game logic
  stopTimer();
  clearTimeout(matchTimeoutId);
  clearTimeout(revealTimeoutId);

  // 2. Reset all state variables
  isTimerRunning = false;
  timeElapsed = 0;
  movesCount = 0;
  matchedPairs = 0;
  firstFlipped = null;
  secondFlipped = null;
  isLocked = false;

  // 3. Update UI displays
  timerDisplay.textContent = "00:00";
  movesDisplay.textContent = "0";

  // 4. Cleanup side effects
  try {
    if (winModal) winModal.setAttribute("aria-hidden", "true");
    if (typeof stopConfetti === "function") stopConfetti();
  } catch (err) {
    console.warn("Cleanup warning:", err);
  }

  // 5. Re-render the board
  renderBoard();
}

// Event listeners for restart
restartBtn.addEventListener("click", restartGame);
restartBtnModal.addEventListener("click", restartGame);

// Start game on load
renderBoard();
