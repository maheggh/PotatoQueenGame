document.addEventListener('DOMContentLoaded', () => {
    const lootBag = document.querySelector('.loot-bag');
    const successMsg = document.querySelector('.success-message');
    const failureMsg = document.querySelector('.failure-message');
    const breakoutBtn = document.querySelector('.breakout-btn');
    const cheatBtn = document.querySelector('.cheat-btn');
    const toggleLootBagBtn = document.querySelector('.dropdown-btn');
    let inJail = localStorage.getItem('inJail') === 'true';
    let jailTime = parseInt(localStorage.getItem('jailTime'), 10) || 30;
    let stolenItems = JSON.parse(localStorage.getItem('stolenItems')) || [];
    let money = parseInt(localStorage.getItem('money'), 10) || 0;
    let hasAttemptedBreakout = false;

    const purses = [
        { name: 'Fat Purse', price: 200, image: 'images/fat-purse.png' },
        { name: 'Slim Purse', price: 50, image: 'images/slim-purse.png' },
        { name: 'Regular Purse', price: 100, image: 'images/regular-purse.png' },
        { name: 'Empty Purse', price: 0, image: 'images/empty-purse.png' }
    ];

    const jewels = [
        { name: 'Diamond', price: 5000, image: 'images/diamond.png' },
        { name: 'Ruby', price: 3000, image: 'images/ruby.png' },
        { name: 'Emerald', price: 2000, image: 'images/emerald.png' },
        { name: 'Sapphire', price: 1000, image: 'images/sapphire.png' }
    ];

    document.querySelectorAll('.steal-btn').forEach(btn => {
        btn.addEventListener('click', () => stealItem(btn));
    });

    if (toggleLootBagBtn) {
        toggleLootBagBtn.addEventListener('click', () => {
            lootBag.style.display = lootBag.style.display === 'none' ? 'block' : 'none';
        });
    }

    breakoutBtn.addEventListener('click', attemptBreakout);
    cheatBtn.addEventListener('click', cheat);

    function getRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function stealItem(btn) {
        if (inJail) {
            failureMsg.textContent = 'You cannot steal while in jail!';
            return;
        }

        successMsg.textContent = '';
        const itemType = btn.getAttribute('data-item-type');
        let chance = parseInt(btn.getAttribute('data-chance'), 10);
        const roll = Math.floor(Math.random() * 100) + 1;

        let stolenItem = determineStolenItem(itemType);

        if (!stolenItem) {
            console.error('Stolen item is undefined');
            failureMsg.textContent = 'Failed to steal. Try again!';
            return;
        }

        if (roll <= chance) {
            handleSuccessfulTheft(stolenItem, itemType, btn);
        } else {
            failureMsg.textContent = 'You got caught!';
            sendToJail();
        }
    }

    function determineStolenItem(itemType) {
        if (itemType === 'Purse') {
            return getRandomItem(purses);
        } else if (itemType === 'Jewel') {
            return getRandomItem(jewels);
        } else if (itemType === 'Bank') {
            return { name: 'Bank Money', price: 50000, image: 'images/bank.png' };
        } else if (itemType === 'ATM') {
            return { name: 'ATM Money', price: 1000, image: 'images/atm.png' };
        }
    }

    function handleSuccessfulTheft(stolenItem, itemType, btn) {
        successMsg.textContent = `You successfully stole a ${stolenItem.name}!`;
        stolenItems.push(stolenItem);
        showSuccessImage(stolenItem.image);
        updateLootBag();
        localStorage.setItem('stolenItems', JSON.stringify(stolenItems));
        btn.setAttribute('data-chance', Math.min(parseInt(btn.getAttribute('data-chance')) + 5, 100).toString());
    }

    function showSuccessImage(imageSrc) {
        const successImageContainer = document.querySelector('.success-image-container');
        successImageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Stolen item';
        img.classList.add('success-image');
        successImageContainer.appendChild(img);
        successImageContainer.style.display = 'block';
    }

    function sendToJail() {
        inJail = true;
        jailTime = 30;
        hasAttemptedBreakout = false;
        localStorage.setItem('inJail', 'true');
        localStorage.setItem('jailTime', jailTime.toString());
        failureMsg.textContent = `You got caught! In jail for ${jailTime} more seconds.`;
        updateJailStatus();
    }

    function attemptBreakout() {
        if (inJail && !hasAttemptedBreakout) {
            hasAttemptedBreakout = true;
            const breakoutChance = 20;
            if (Math.random() * 100 < breakoutChance) {
                inJail = false;
                jailTime = 0;
                localStorage.setItem('inJail', 'false');
                localStorage.setItem('jailTime', jailTime.toString());
                successMsg.textContent = 'You broke out of jail!';
            } else {
                failureMsg.textContent = 'Breakout attempt failed!';
                jailTime += 15;
                localStorage.setItem('jailTime', jailTime.toString());
            }
            updateJailStatus();
        } else if (inJail && hasAttemptedBreakout) {
            failureMsg.textContent = 'You have already attempted to break out.';
        }
    }

    function cheat() {
        inJail = false;
        jailTime = 0;
        localStorage.setItem('inJail', 'false');
        localStorage.setItem('jailTime', '0');
        updateJailStatus();
    }
    
    function updateJailStatus() {
        const jailImageContainer = document.querySelector('#jail-image-container');
        if (inJail) {
            jailImageContainer.innerHTML = '<img src="images/potatojail.jpg" alt="In Jail">';
            const intervalId = setInterval(() => {
                if (jailTime > 0) {
                    failureMsg.textContent = `In jail for ${jailTime} more seconds.`;
                    jailTime--;
                    localStorage.setItem('jailTime', jailTime.toString());
                } else {
                    jailImageContainer.innerHTML = '';
                    clearInterval(intervalId);
                    inJail = false;
                    localStorage.setItem('inJail', 'false');
                    failureMsg.textContent = '';
                }
            }, 1000);
        }
    }
    
    function updateLootBag() {
        lootBag.innerHTML = '';
        stolenItems.forEach((item, index) => {
            const itemElement = document.createElement('li');
            const imageElement = document.createElement('img');
            imageElement.src = item.image;
            imageElement.alt = item.name;
            imageElement.classList.add('loot-image');
            
            const textElement = document.createTextNode(`${item.name} - $${item.price}`);
            const sellButton = document.createElement('button');
            sellButton.innerText = 'Sell';
            sellButton.classList.add('sell-btn');
            sellButton.addEventListener('click', () => sellItem(index));
    
            itemElement.appendChild(imageElement);
            itemElement.appendChild(textElement);
            itemElement.appendChild(sellButton);
            lootBag.appendChild(itemElement);
        });
    }
    
    function sellItem(index) {
        const item = stolenItems[index];
        money += item.price;
        stolenItems.splice(index, 1);
        updateMoneyDisplay();
        updateLootBag();
        localStorage.setItem('stolenItems', JSON.stringify(stolenItems));
        updateScoreOverview();
    }
    
    function updateMoneyDisplay() {
        const moneyDisplay = document.querySelector('.money-display');
        moneyDisplay.textContent = `Money: $${money}`;
        localStorage.setItem('money', money.toString());
    }
    
    function updateScoreOverview() {
        const theftsCount = parseInt(localStorage.getItem('theftsCount')) || 0;
        const moneyEarned = parseInt(localStorage.getItem('money')) || 0;
        const theftsCountElement = document.getElementById('thefts-committed');
        const moneyEarnedElement = document.getElementById('money-earned');
        
        if (theftsCountElement) theftsCountElement.textContent = `Thefts Committed: ${theftsCount}`;
        if (moneyEarnedElement) moneyEarnedElement.textContent = `Money Earned: $${moneyEarned}`;
    }
    
    updateJailStatus();
    updateLootBag();
    updateMoneyDisplay();
});