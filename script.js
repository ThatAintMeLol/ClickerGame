let count = 0;
let dvdUpgrades = 0;
let upgradeCost = 10;
let passiveIncome = 0;
let dvds = [];
let lastUpdate = Date.now();

// Clicker button logic
document.getElementById("clickButton").addEventListener("click", function() {
    count++;
    updateCounter();

    if (count >= 10 && dvdUpgrades === 0) {
        document.getElementById("upgradeButton").style.display = "inline-block";
    }
});

// Upgrade button logic
document.getElementById("upgradeButton").addEventListener("click", function() {
    if (count >= upgradeCost) {
        count -= upgradeCost;
        dvdUpgrades++;
        passiveIncome++;
        upgradeCost = Math.ceil(upgradeCost * 1.5);

        updateCounter();
        updateUpgradeText();
        updatePassiveDisplay();

        createBouncingDVD();
    }
});

// Update counter display
function updateCounter() {
    document.getElementById("counter").textContent = Math.floor(count); // Ensures smooth updates
}

// Update upgrade button display
function updateUpgradeText() {
    document.getElementById("upgradeButton").textContent = `DVD Upgrade (${dvdUpgrades}) - Cost: ${upgradeCost}`;
}

// Update passive per second display
function updatePassiveDisplay() {
    document.getElementById("pps").textContent = (passiveIncome / 3).toFixed(2);
}

// Smooth passive point increment (like Cookie Clicker)
function gameLoop() {
    let now = Date.now();
    let elapsed = (now - lastUpdate) / 1000; // Convert ms to seconds
    lastUpdate = now;

    count += passiveIncome * (elapsed / 3); // Smoothly distribute passive income
    updateCounter();

    requestAnimationFrame(gameLoop); // Continuously run game loop
}

gameLoop(); // Start smooth updating system

// Create bouncing DVD objects (fully restored)
function createBouncingDVD() {
    let dvd = document.createElement("div");
    dvd.classList.add("dvd");
    let img = document.createElement("img");
    img.src = "dvd-logo.png";
    dvd.appendChild(img);
    document.body.appendChild(dvd);

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let x = Math.random() * (screenWidth - 100);
    let y = Math.random() * (screenHeight - 50);
    dvd.style.left = x + "px";
    dvd.style.top = y + "px";

    dvds.push({ element: dvd, x, y, dx: Math.random() > 0.5 ? 2 : -2, dy: Math.random() > 0.5 ? 2 : -2 });

    if (dvds.length === 1) moveDVDs();
}

// DVD movement logic
function moveDVDs() {
    function updatePositions() {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;

        dvds.forEach((dvdObj, index) => {
            let dvd = dvdObj.element;
            dvdObj.x += dvdObj.dx;
            dvdObj.y += dvdObj.dy;

            if (dvdObj.x <= 0 || dvdObj.x + 100 >= screenWidth) dvdObj.dx *= -1;
            if (dvdObj.y <= 0 || dvdObj.y + 50 >= screenHeight) dvdObj.dy *= -1;

            for (let i = 0; i < dvds.length; i++) {
                if (i !== index && isColliding(dvdObj, dvds[i])) {
                    bounceDVDs(dvdObj, dvds[i]);
                }
            }

            dvd.style.left = dvdObj.x + "px";
            dvd.style.top = dvdObj.y + "px";
        });

        requestAnimationFrame(updatePositions);
    }

    updatePositions();
}

// Collision detection between DVDs
function isColliding(dvdA, dvdB) {
    return !(
        dvdA.x + 100 < dvdB.x || dvdA.x > dvdB.x + 100 ||
        dvdA.y + 50 < dvdB.y || dvdA.y > dvdB.y + 50
    );
}

// Bounce DVDs off each other
function bounceDVDs(dvdA, dvdB) {
    [dvdA.dx, dvdB.dx] = [dvdB.dx, dvdA.dx];
    [dvdA.dy, dvdB.dy] = [dvdB.dy, dvdA.dy];
}
