// Variables to store the state
const cardsContainer = document.getElementById('cards-container');
const instructions = document.getElementById('instructions');
const allCards = document.querySelectorAll('.card');
const buttons = document.querySelectorAll('button');
let cards = []; // The full deck of cards
let currentStep = 1; // Track the step in the process
let selectedCards = []; // Cards selected in the previous line

// Initialize the cards array (21 cards)
for (let i = 1; i <= 21; i++) {
  cards.push(`card${i}`);
}

// Function to shuffle an array (for randomizing cards)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to render cards in the grid
function renderCards() {
  cardsContainer.innerHTML = ''; // Clear the grid
  cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.style.backgroundImage = `url('./deck-images/${card}.png')`;
    cardsContainer.appendChild(cardElement);
  });
}

// Function to handle line selection
function selectLine(line) {
  const line1 = cards.slice(0, 7);
  const line2 = cards.slice(7, 14);
  const line3 = cards.slice(14, 21);

  // Choose the selected line
  if (line === 1) selectedCards = [...line1];
  else if (line === 2) selectedCards = [...line2];
  else selectedCards = [...line3];

  if (currentStep === 1) {
    // Step 1: Place the selected line in columns 3, 4, and 5
    rearrangeStep1();
  } else if (currentStep === 2) {
    // Step 2: Place 3rd, 4th, and 5th cards of the selected line in column 4
    rearrangeStep2();
  } else if (currentStep === 3) {
    // Step 3: Reveal the 4th card of the chosen line
    revealCard();
  }

  currentStep++;
}

// Step 1: Rearrange cards - Selected line in columns 3, 4, and 5
function rearrangeStep1() {
  const remainingCards = cards.filter((card) => !selectedCards.includes(card));
  const rearrangedCards = [];
  let selectedIndex = 0;
  let remainingIndex = 0;

  for (let i = 0; i < 21; i++) {
    if ((i % 7 === 2 || i % 7 === 3 || i % 7 === 4) && (i !== 17 && i !== 18)) {
      rearrangedCards.push(selectedCards[selectedIndex]);
      selectedIndex++;
    } else {
      rearrangedCards.push(remainingCards[remainingIndex]);
      remainingIndex++;
    }
  }

  cards = rearrangedCards;
  renderCards();
  instructions.textContent = 'Select the line containing your card again:';
}

// Step 2: Rearrange cards - Place 3rd, 4th, and 5th cards in column 4
function rearrangeStep2() {
  const importantCards = [
    selectedCards[2],
    selectedCards[3],
    selectedCards[4],
  ];
  const remainingCards = cards.filter((card) => !importantCards.includes(card));
  const shuffledRemainingCards = shuffleArray(remainingCards);

  const rearrangedCards = [];
  let importantIndex = 0;
  let remainingIndex = 0;

  for (let i = 0; i < 21; i++) {
    if (i % 7 === 3) {
      rearrangedCards.push(importantCards[importantIndex]);
      importantIndex++;
    } else {
      rearrangedCards.push(shuffledRemainingCards[remainingIndex]);
      remainingIndex++;
    }
  }

  cards = rearrangedCards;
  renderCards();
  instructions.textContent = 'Select the line containing your card one last time:';
}

// Step 3: Reveal the selected card
function revealCard() {
  // The chosen card is always the 4th card of the last selected line
  const chosenCard = selectedCards[3];
  cardsContainer.innerHTML = '';
  const cardElement = document.createElement('div');
  cardElement.className = 'final-card';
  cardElement.style.backgroundImage = `url('./deck-images/${chosenCard}.png')`;
  cardElement.style.width = '250px';
  cardElement.style.height = '350px';
  cardElement.style.backgroundSize = 'cover'; 
  const tryAgainButton = document.createElement('button');
  tryAgainButton.textContent = 'Try Again';
  tryAgainButton.style.padding = '8px 16px';
  tryAgainButton.style.fontSize = '14px';
  tryAgainButton.style.marginTop = '20px'; 
  tryAgainButton.onclick = () => location.reload();
  cardsContainer.appendChild(cardElement);
  cardsContainer.appendChild(tryAgainButton);
  instructions.textContent = 'Your card is:';

  // Center the container
  cardsContainer.style.display = 'flex';
  cardsContainer.style.flexDirection = 'column';
  cardsContainer.style.alignItems = 'center';
  cardsContainer.style.justifyContent = 'center';
  cardsContainer.style.height = '100vh'; // Full page height
}

// Play button sound when a button is clicked
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const audio = new Audio('./sounds/button-sound.mp3'); // Path to your button sound
    audio.play();
  });
});

// Initial render of cards
renderCards();
