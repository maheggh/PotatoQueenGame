document.addEventListener('DOMContentLoaded', () => {
    populateTargetSelection();
    populateWeaponSelection();
    updateMoneyDisplay();

    document.getElementById('execute-btn').addEventListener('click', attemptAssassination);
});

function populateTargetSelection() {
    const targets = {
        'Potato President': 'Presidential Medal',
        'Potato Dragon': 'Dragon\'s Hoard',
        'Potato Don': 'Mafia Fortune',
        'Spud Spy': 'Secret Documents',
        'Potato Pirate': 'Treasure Chest',
        'Gourmet Chef Tater': 'Golden Spoon',
        'Astronaut Spudnik': 'Meteorite Fragment',
        'Sheriff Tater': 'Golden Badge'
    };

    const targetDropdown = document.getElementById('targets');
    Object.keys(targets).forEach(targetName => {
        const option = document.createElement('option');
        option.value = targetName;
        option.textContent = targetName;
        targetDropdown.appendChild(option);
    });
}

function populateWeaponSelection() {
    const weaponsInventory = InventoryManager.getInventory().filter(item => item.accuracy); // Assuming accuracy is unique to weapons
    const weaponDropdown = document.getElementById('weapon-dropdown');
    weaponDropdown.innerHTML = ''; // Clear existing options

    // Create and append the placeholder option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Please select a weapon';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    weaponDropdown.appendChild(defaultOption);

    // Append the rest of the options
    weaponsInventory.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.name;
        option.textContent = `${weapon.name} - Accuracy: ${weapon.accuracy}%`;
        weaponDropdown.appendChild(option);
    });
}
function updateMoneyDisplay() {
    let money = parseInt(localStorage.getItem('money')) || 0;
    const moneyDisplay = document.querySelector('.money-display');
    if (moneyDisplay) {
        moneyDisplay.textContent = `Money: $${money}`;
    }
}

function attemptAssassination() {
    const selectedWeaponName = document.getElementById('weapon-dropdown').value;
    const weaponsInventory = InventoryManager.getInventory().filter(item => item.accuracy);
    const selectedWeapon = weaponsInventory.find(w => w.name === selectedWeaponName);
    const selectedTargetOption = document.getElementById('targets').selectedOptions[0];
    const selectedTargetName = selectedTargetOption.value;
    const bulletsUsed = parseInt(document.getElementById('bullets').value);

    // Check if no weapon is selected
    if (!selectedWeaponName || selectedWeaponName === "Please select a weapon") {
        document.getElementById('result').textContent = "You don't have any weapon selected.";
        return; // Exit the function to prevent further execution
    }

    // Check for invalid bullet count
    if (isNaN(bulletsUsed) || bulletsUsed <= 0) {
        document.getElementById('result').textContent = 'You must use at least one bullet for an assassination attempt.';
        return; // Exit the function if no bullets are used or invalid count
    }

    // Proceed with valid bullet count and weapon selection
    const bulletsCost = bulletsUsed * 100;
    let money = parseInt(localStorage.getItem('money')) || 0;

    // Check if the user has enough money to use the bullets
    if (money < bulletsCost) {
        document.getElementById('result').textContent = 'You do not have enough money to execute the assassination.';
        return; // Exit the function if not enough money
    }

    // Deduct the cost of bullets
    money -= bulletsCost;
    localStorage.setItem('money', money.toString());
    updateMoneyDisplay();

    const targetChance = getTargetChance(selectedTargetName);
    const successChance = calculateSuccessChance(selectedWeapon.accuracy, bulletsUsed, targetChance);

    if (Math.random() < 0.01) {
        resetGame();
        window.location.href = 'deathscreen.html';
    } else if (Math.random() < successChance) {
        const loot = getLootForTarget(selectedTargetName);
        InventoryManager.addToInventory(loot);
        incrementCounter('murdersCount');
        document.getElementById('result').textContent = `Successful assassination of ${selectedTargetName}! You obtained ${loot.name}.`;
        displaySuccessImage(loot.image);
    } else {
        document.getElementById('result').textContent = `Assassination attempt on ${selectedTargetName} failed or target escaped.`;
    }
}


function calculateSuccessChance(weaponAccuracy, bulletsUsed, targetChance) {
    return Math.min(1, (weaponAccuracy * bulletsUsed / 100) / targetChance);
}
function calculateSuccessChance(weaponAccuracy, bulletsUsed, targetChance) {
    return Math.min(1, (weaponAccuracy * bulletsUsed / 100) / targetChance);
}

function getTargetChance(targetName) {
    const chances = {
        'Potato President': 500,
        'Potato Dragon': 1000,
        'Spud Spy': 700,
        'Potato Don': 700,
        'Potato Pirate': 100,
        'Gourmet Chef Tater': 50,
        'Astronaut Spudnik': 200,
        'Sheriff Tater': 900
    };
    return chances[targetName] || 5000;
}

function getLootForTarget(targetName) {
    const lootList = {
        'Potato President': { name: 'Presidential Medal', image: 'images/presidential-medal.png' },
        'Potato Dragon': { name: 'Dragon\'s Hoard', image: 'images/dragon-hoard.png' },
        'Potato Don': { name: 'Mafia Ring', image: 'images/mafia-ring.png' },
        'Spud Spy': { name: 'Invisible Cloak', image: 'images/invisible-cloak.png' },
        'Potato Pirate': { name: 'Pirate\'s Compass', image: 'images/pirate-compass.png' },
        'Gourmet Chef Tater': { name: 'Golden Spatula', image: 'images/golden-spatula.png' },
        'Astronaut Spudnik': { name: 'Star Dust', image: 'images/star-dust.png' },
        'Sheriff Tater': { name: 'Sheriff\'s Badge', image: 'images/sheriffs-badge.png' }
    };
    return lootList[targetName] || { name: 'Unknown Item', image: 'images/default-loot.png' };
}

function addToInventory(loot) {
    InventoryManager.addToInventory(loot);
}

function displaySuccessImage(imageUrl) {
    let resultContainer = document.getElementById('result');
    let imgContainer = document.getElementById('success-image-container');
    if (!imgContainer) {
        imgContainer = document.createElement('div');
        imgContainer.id = 'success-image-container';
        resultContainer.appendChild(imgContainer);
    }


    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Success Image';
    img.className = 'success-image';

    imgContainer.innerHTML = '';
    imgContainer.appendChild(img);
}

document.getElementById('cheat-btn').addEventListener('click', () => {
    let currentMoney = parseInt(localStorage.getItem('money'), 10) || 0;
    currentMoney += 1000000; // Add $1,000,000
    localStorage.setItem('money', currentMoney.toString());
    updateMoneyDisplay();
});

function resetGame() {
    localStorage.clear();
}

window.addEventListener('load', () => {
    updateMoneyDisplay();
    populateWeaponSelection();
});