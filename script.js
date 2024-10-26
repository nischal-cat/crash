let multiplier = 1.00;
let isCrashed = false;
let isBetPlaced = false;
let crashPoint;
let interval;
const multiplierDisplay = document.getElementById("multiplier-display");
const actionButton = document.getElementById("action-button");
const statusMessage = document.getElementById("status-message");
const betInput = document.getElementById("bet-input");
const historyContainer = document.getElementById("history-container");

function startGame() {
    // Reset values
    multiplier = 1.00;
    isCrashed = false;
    isBetPlaced = true;
    crashPoint = calculateCrashPoint(parseFloat(betInput.value) || 1);
    statusMessage.textContent = `Game started! \n Best of Luck, Lil Boy!`;

    // Disable button and change text
    actionButton.textContent = "Cash Out";

    // Start the multiplier increase
    interval = setInterval(updateMultiplier, 100);
}

function updateMultiplier() {
    if (isCrashed || !isBetPlaced) return;

    // Increase the multiplier faster as it gets higher to simulate acceleration
    multiplier += multiplier * 0.05;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    // Check if the game should crash
    if (multiplier >= crashPoint) {
        crash();
    }
}

function crash() {
    isCrashed = true;
    clearInterval(interval);
    const betAmount = parseFloat(betInput.value);
    const historyItem = `Crashed at ${multiplier.toFixed(2)}x! You lost your bet of $${betAmount.toFixed(2)}.`;
    statusMessage.textContent = historyItem;
    addToHistory(betAmount, 0, multiplier); // 0 winnings on crash

    // Reset button to Place Bet
    actionButton.textContent = "Place Bet";
    isBetPlaced = false;
}

function cashOut() {
    if (!isCrashed && isBetPlaced) {
        clearInterval(interval);
        const betAmount = parseFloat(betInput.value);
        const winnings = (betAmount * multiplier).toFixed(2);
        statusMessage.textContent = `You cashed out at ${multiplier.toFixed(2)}x! You bet $${betAmount.toFixed(2)} and won $${winnings}.`;

        // Add to history
        addToHistory(betAmount, winnings, multiplier);

        // Reset button to Place Bet
        actionButton.textContent = "Place Bet";
        isBetPlaced = false;
    }
}

function addToHistory(betAmount, winnings, crashMultiplier) {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.textContent = `Bet: $${betAmount.toFixed(2)}, Won: $${winnings > 0 ? `$${winnings}` : '0.00'}, Crashed at: ${crashMultiplier.toFixed(2)}x`;
    historyContainer.appendChild(historyItem);
}

function calculateCrashPoint(bet) {
    // Set a higher maximum crash point for bigger bets
    const maxCrashPoint = Math.random() * (20 - 3) + 3; // Randomly between 3 and 20

    // Apply some randomness to make it less predictable
    const crashPoint = Math.random() < 0.1 ? Math.random() * (3.5 - 2.0) + 2.0 : maxCrashPoint;

    return crashPoint;
}

// Event listener for the action button
actionButton.addEventListener("click", () => {
    if (!isBetPlaced) {
        startGame();
    } else {
        cashOut();
    }
});
