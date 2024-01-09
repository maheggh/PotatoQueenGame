document.addEventListener('DOMContentLoaded', () => {
    updateGameStatsAndScoreScreen();
    document.addEventListener('inventoryChanged', updateGameStatsAndScoreScreen);
});


function updateGameStatsAndScoreScreen() {
    // Fetch and parse all required stats from localStorage
    const stats = {
        theftsCount: parseInt(localStorage.getItem('theftsCount')) || 0,
        carTheftsCount: parseInt(localStorage.getItem('carTheftsCount')) || 0,
        bankRobberiesCount: parseInt(localStorage.getItem('bankRobberiesCount')) || 0,
        murdersCount: parseInt(localStorage.getItem('murdersCount')) || 0,
        racesWonCount: parseInt(localStorage.getItem('racesWonCount')) || 0,
        moneyEarned: parseInt(localStorage.getItem('money')) || 0
    };

    // Update the DOM elements with the new stats
    document.getElementById('thefts-committed').textContent = `Thefts Committed: ${stats.theftsCount}`;
    document.getElementById('cars-stolen').textContent = `Cars Stolen: ${stats.carTheftsCount}`;
    document.getElementById('bank-robberies-committed').textContent = `Bank Robberies Committed: ${stats.bankRobberiesCount}`;
    document.getElementById('murders-committed').textContent = `Murders Committed: ${stats.murdersCount}`;
    document.getElementById('car-races-won').textContent = `Car Races Won: ${stats.racesWonCount}`;
    document.getElementById('money-earned').textContent = `Money Earned: $${stats.moneyEarned}`;

    populateInventoryList();
    checkAndCraftQueensCrown();
}

function populateInventoryList() {
    const inventoryList = document.getElementById('inventory-list');
    const inventory = InventoryManager.getInventory(); // This should come from your inventory management system

    inventoryList.innerHTML = ''; // Clear out current list
    inventory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Quantity: ${item.quantity || 1}`;
        inventoryList.appendChild(listItem);
    });
}

function checkAndCraftQueensCrown() {
    const inventory = InventoryManager.getInventory();
    const hasAllLootItems = requiredLootItems.every(loot => 
        inventory.some(item => item.name === loot)
    );

    const craftMessage = document.getElementById('craft-message');
    if (hasAllLootItems) {
        craftMessage.textContent = 'You have all the items required to craft the Queen\'s Crown. Click the button to craft it.';
        craftMessage.style.display = 'block';
    } else {
        craftMessage.textContent = 'You do not have all the items required to craft the Queen\'s Crown.';
        craftMessage.style.display = 'block';
    }
}

document.getElementById('craft-button').addEventListener('click', () => {
    craftQueensCrown();
});

function craftQueensCrown() {
    let inventory = InventoryManager.getInventory();
    const queensCrown = inventory.find(item => item.name === "Queen's Crown");
    const hasAllLootItems = requiredLootItems.every(loot => 
        inventory.some(item => item.name === loot)
    );

    if (hasAllLootItems && !queensCrown) {
        displayQueensCrownImage();
        inventory = inventory.filter(item => !requiredLootItems.includes(item.name));
        InventoryManager.updateInventory(inventory);
        InventoryManager.addToInventory({
            name: "Queen's Crown",
            image: 'images/queens-crown.png', 
            quantity: 1
        });
        document.getElementById('wear-crown-btn').style.display = 'block';
        document.getElementById('craft-message').textContent = 'You have crafted the Queen\'s Crown.';
        document.getElementById('craft-message').style.display = 'block';
    } else if (queensCrown) {
        document.getElementById('craft-message').textContent = 'Congratulations, you have the Queens Crown, and you look beautiful!';
        document.getElementById('craft-message').style.display = 'block';
    } else {
        document.getElementById('craft-message').textContent = 'You do not have all the items required to craft the Queen\'s Crown.';
        document.getElementById('craft-message').style.display = 'block';
    }
}

document.getElementById('wear-crown-btn').addEventListener('click', () => {
    window.location.href = 'scorescreen.html'; 
});

function displayQueensCrownImage() {
    const queensCrownDiv = document.querySelector('.queenscrown-image');
    if (queensCrownDiv) {
        const img = document.createElement('img');
        img.src = 'images/queens-crown.png';
        img.alt = "Queen's Crown";

        img.style.maxWidth = '200px';  
        img.style.height = 'auto'; 

        queensCrownDiv.innerHTML = ''; 
        queensCrownDiv.appendChild(img);
    } else {
        console.error("Element with class 'queenscrown-image' not found.");
    }
}
function clearInventory() {
    InventoryManager.clearInventory(); 
    populateInventoryList(); 
    resetCraftMessageAndImage(); 
}

function resetCraftMessageAndImage() {

    const craftMessage = document.getElementById('craft-message');
    craftMessage.textContent = 'You do not have all the items required to craft the Queen\'s Crown.';
    craftMessage.style.display = 'none';
    document.getElementById('wear-crown-btn').style.display = 'none';

    const queensCrownDiv = document.querySelector('.queenscrown-image');
    if (queensCrownDiv) {
        queensCrownDiv.innerHTML = '';
    }
}
