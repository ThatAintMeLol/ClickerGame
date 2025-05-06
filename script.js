let count = 0;
let dvdUpgrades = 0;
let upgradeCost = 10;
let passiveIncome = 0;
let lastUpdate = Date.now();
let mysteryUsed = false;

// Set custom images directly in the code
let movingImageSrc = "/GameImages/GoofyCat.jpg"; // Replace with your custom image file
let mysteryImageSrc = "/GameImages/RichCat.jpg"; // Replace with your custom mystery image file

// Set mystery image in the game
document.getElementById("mysteryImage").src = mysteryImageSrc;

// Clicker button logic
document.getElementById("clickButton").addEventListener("click", function() {
    count++;
    updateCounter();

    if (count >= 10 && dvdUpgrades === 0) {
        document.getElementById("upgradeButton").style.display = "inline-block";
    }

    if (count >= 500 && !mysteryUsed) { // Show mystery upgrade at 500 clicks
        document.getElementById("mysteryUpgradeButton").style.display = "inline-block";
    }
});

// Upgrade button logic (Spawns moving image)
document.getElementById("upgradeButton").addEventListener("click", function() {
    if (count >= upgradeCost) {
        count -= upgradeCost;
        dvdUpgrades++;
        passiveIncome++;
        upgradeCost = Math.ceil(upgradeCost * 1.5);

        updateCounter();
        updateUpgradeText();
        updatePassiveDisplay();

        spawnMovingImage();
    }
});

// Mystery Upgrade Button Logic (One-time use)
document.getElementById("mysteryUpgradeButton").addEventListener("click", function() {
    if (!mysteryUsed && count >= 300) {
        mysteryUsed = true;
        count -= 300; // Deduct cost
        updateCounter();
        document.getElementById("mysteryUpgradeButton").style.display = "none"; // Remove button after use
        document.getElementById("mysteryImage").style.display = "block"; // Show image in bottom-right

        let randomDelay = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000; // Random delay (5-30 sec)
        setTimeout(() => {
            let randomBoost = getRandomBoost();
            count += randomBoost;
            updateCounter();
            alert(`You gained ${randomBoost} clicks after waiting!`);
        }, randomDelay);
    }
});

// Generate random boost (1-1000, with 500+ being rare)
function getRandomBoost() {
    let roll = Math.random();
    if (roll > 0.9) return Math.floor(Math.random() * (1000 - 500 + 1)) + 500; // Rare boost (500-1000)
    return Math.floor(Math.random() * 500) + 1; // Common boost (1-500)
}

// Update counter display
function updateCounter() {
    document.getElementById("counter").textContent = Math.floor(count);
}

// Update upgrade button display
function updateUpgradeText() {
    document.getElementById("upgradeButton").textContent = `Spawn Moving Image (${dvdUpgrades}) - Cost: ${upgradeCost}`;
}

// Update passive per second display
function updatePassiveDisplay() {
    document.getElementById("pps").textContent = (passiveIncome / 3).toFixed(2);
}

// Smooth passive point increment (like Cookie Clicker)
function gameLoop() {
    let now = Date.now();
    let elapsed = (now - lastUpdate) / 1000;
    lastUpdate = now;

    count += passiveIncome * (elapsed / 3);
    updateCounter();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Spawns a moving image that moves randomly and stops
function spawnMovingImage() {
    let image = document.createElement("img");
    image.src = movingImageSrc;
    image.classList.add("movingImage");
    document.body.appendChild(image);

    moveImageRandomly(image);
}

// Moves the image randomly, stops, then moves again
function moveImageRandomly(image) {
    function move() {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;

        let x = Math.random() * (screenWidth - 50);
        let y = Math.random() * (screenHeight - 50);

        image.style.left = x + "px";
        image.style.top = y + "px";

        let stopTime = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000; // Random stop time (1-3 sec)
        setTimeout(move, stopTime);
    }

    move();
}
