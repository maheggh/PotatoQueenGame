let money = parseInt(localStorage.getItem('money')) || 0;

function updateMoneyDisplay() {
    const moneyDisplays = document.querySelectorAll('.money-display, .money-display-bottom span');
    moneyDisplays.forEach(display => {
        display.textContent = `${money}`;
    });
}
function buyWeapon(event) {
    const button = event.target;
    const weaponName = button.getAttribute('data-weapon-name');
    const price = parseInt(button.getAttribute('data-price'), 10);
    const accuracy = parseFloat(button.getAttribute('data-accuracy'));

    if (money >= price) {
        money -= price;
        InventoryManager.addToInventory({ name: weaponName, accuracy, price, type: 'weapon' });

        localStorage.setItem('money', money.toString());
        updateMoneyDisplay();
        updateWeaponsInventoryDisplay();
    } else {
       let failure = document.querySelector('.error-msg');
       failure.textContent = 'You are too broke mate!';
    }
}

function updateWeaponsInventoryDisplay() {
    const inventoryList = document.querySelector('.inventory-list');
    inventoryList.innerHTML = '';

    let inventory = InventoryManager.getInventory();
    let weaponsInventory = inventory.filter(item => item.type === 'weapon');
    
    weaponsInventory.forEach((weapon, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${weapon.name} - Accuracy: ${weapon.accuracy}% - Price: $${weapon.price}`;
        
        const sellButton = document.createElement('button');
        sellButton.textContent = 'Sell for 50%';
        sellButton.classList.add('sell-weapon');
        sellButton.onclick = () => sellWeapon(weapon.name, index);
        listItem.appendChild(sellButton);

        inventoryList.appendChild(listItem);
    });
}

document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', buyWeapon);
});

function sellWeapon(weaponName) {
    let inventory = InventoryManager.getInventory();
    let weaponIndex = inventory.findIndex(item => item.name === weaponName && item.type === 'weapon');
    
    if (weaponIndex !== -1) {
        let weaponToSell = inventory[weaponIndex];
        money += Math.floor(weaponToSell.price / 2);
        inventory.splice(weaponIndex, 1);

        localStorage.setItem('money', money.toString());
        InventoryManager.updateInventory(inventory);

        updateMoneyDisplay();
        updateWeaponsInventoryDisplay();
    }
}

window.addEventListener('load', () => {
    updateMoneyDisplay();
    updateWeaponsInventoryDisplay();
});