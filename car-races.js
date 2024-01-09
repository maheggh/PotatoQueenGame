document.addEventListener('DOMContentLoaded', () => {
    const carSelection = document.getElementById('car-selection');
    const raceResult = document.getElementById('race-result');
    const raceBtn = document.getElementById('race-btn');
    const countdownMessage = document.getElementById('countdown-message'); // New element for countdown
    let raceTimeout = null;
    function populateCarDropdown() {
        carSelection.innerHTML = '';
        InventoryManager.getInventory().filter(item => item.type === 'car').forEach(car => {
            carSelection.add(new Option(car.name, car.name));
        });
    }

    function checkRaceCooldown() {
        const cooldownEnd = parseInt(localStorage.getItem('raceCooldownEnd'), 10);
        if (cooldownEnd) {
            const now = Date.now();
            if (now < cooldownEnd) {
                const timeLeft = Math.ceil((cooldownEnd - now) / 1000);
                startCountdown(timeLeft);
            } else {
                localStorage.removeItem('raceCooldownEnd');
                raceBtn.disabled = false;
            }
        }
    }

    function startCountdown(timeLeft) {
        raceBtn.disabled = true;
        updateCooldownMessage(timeLeft);

        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            updateCooldownMessage(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownMessage.textContent = ''; // Clear countdown message
                raceBtn.disabled = false;
                localStorage.removeItem('raceCooldownEnd');
            }
        }, 1000);

        localStorage.setItem('raceCooldownEnd', Date.now() + timeLeft * 1000);
    }

    function updateCooldownMessage(timeLeft) {
        countdownMessage.textContent = "The cops are on to you, you have to lay low for a while. Time remaining: " + timeLeft + "s";
    }

    checkRaceCooldown();
    populateCarDropdown();

    function conductRace(selectedCar) {
        startCountdown(30);
        const opponentCar = getRandomCarFromAll();
        let message = '';

        const scenarioOccurred = [
            { chance: 0.02, message: "Your car crashed during the race." },
            { chance: 0.01, message: "Police showed up, and you had to ditch the car." },
            { chance: 0.03, message: "Your car suffered a mechanical failure." },
            { chance: 0.02, message: "Your car was sabotaged by an opponent." },
            { chance: 0.01, message: "You took a wrong turn and got disqualified." }
        ].some(scenario => {
            if (Math.random() < scenario.chance) {
                InventoryManager.removeFromInventory(selectedCar.name, 'car');
                message = scenario.message;
                return true;
            }
            return false;
        });

        if (!scenarioOccurred) {
            const playerSpeed = calculateSpeed(selectedCar);
            const opponentSpeed = calculateSpeed(opponentCar);

            if (playerSpeed > opponentSpeed) {
                const winningCar = getRandomCarFromAll();
                InventoryManager.addToInventory(winningCar);
                message = `You won the race and gained a ${winningCar.name}!`;
            } else {
                InventoryManager.removeFromInventory(selectedCar.name, 'car');
                message = `You lost the race and your ${selectedCar.name}.`;
            }
        }

        raceResult.textContent = message;
        checkRaceCooldown();
        populateCarDropdown();
    }

    raceBtn.addEventListener('click', () => {
        const selectedCarName = carSelection.value;
        const selectedCar = InventoryManager.getInventory().find(car => car.name === selectedCarName && car.type === 'car');
        if (selectedCar) {
            conductRace(selectedCar);
        } else {
            raceResult.textContent = 'Please select a car to race.';
        }
    });

    populateCarDropdown();
});

    const allCars = [
        { name: 'Luxury Spud Sedan', price: 120000, image: 'images/luxury-spud-sedan.png', type: 'car' },
        { name: 'Sporty Tater Coupe', price: 40000, image: 'images/sporty-tater-coupe.png', type: 'car' },
        { name: 'Potato Convertible', price: 30000, image: 'images/potato-convertible.png', type: 'car' },
        { name: 'SUV Spud', price: 20000, image: 'images/suv-spud.png', type: 'car' },
        { name: 'Hatchback Tuber', price: 15000, image: 'images/hatchback-tuber.png', type: 'car' },
        { name: 'Sedan Yam', price: 20000, image: 'images/sedan-yam.png', type: 'car' },
        { name: 'SUV Tater', price: 25000, image: 'images/suv-tater.png', type: 'car' },
        { name: 'Spudnik Sports', price: 90000, image: 'images/spudnik-sports.png', type: 'car' },
        { name: 'Compact Fry', price: 10000, image: 'images/compact-fry.png', type: 'car' },
        { name: 'Curly Coupe', price: 15000, image: 'images/curly-coupe.png', type: 'car' },
        { name: 'Wedge Wagon', price: 20000, image: 'images/wedge-wagon.png', type: 'car' },
        { name: 'Crispy Convertible', price: 110000, image: 'images/crispy-convertible.png', type: 'car' },
        { name: 'Mashed Mini', price: 5000, image: 'images/mashed-mini.png', type: 'car' },
        { name: 'Buttery Buggy', price: 8000, image: 'images/buttery-buggy.png', type: 'car' },
        { name: 'Gravy Sedan', price: 12000, image: 'images/gravy-sedan.png', type: 'car' },
        { name: 'Peeler Pickup', price: 18000, image: 'images/peeler-pickup.png', type: 'car' },
        { name: 'Root Roadster', price: 7000, image: 'images/root-roadster.png', type: 'car' },
        { name: 'Bulb Buggy', price: 10000, image: 'images/bulb-buggy.png', type: 'car' },
        { name: 'Starch Sedan', price: 15000, image: 'images/starch-sedan.png', type: 'car' },
        { name: 'Tuber Truck', price: 60000, image: 'images/tuber-truck.png', type: 'car' },
    ];

    function calculateSpeed(car) {
        return car.price / 1000 + Math.random() * 20;
    }
    
    function getRandomCarFromAll() {
        return allCars[Math.floor(Math.random() * allCars.length)];
    }

