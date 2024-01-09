const garage = document.querySelector('.garage');
const successMsg = document.querySelector('.success-message');
const failureMsg = document.querySelector('.failure-message');
const jailTimer = document.querySelector('.jail-timer');
const breakoutBtn = document.querySelector('.breakout-btn');
const cheatBtn = document.querySelector('cheat-btn')
const toggleGarageBtn = document.querySelector('.dropdown-btn'); // Make sure this is correct
let inJail = localStorage.getItem('inJail') === 'true';
let jailTime = parseInt(localStorage.getItem('jailTime')) || 30;
let stolenCars = JSON.parse(localStorage.getItem('stolenCars')) || [];
let money = parseInt(localStorage.getItem('money')) || 0;
let attemptedBreakout = false;

function incrementCounter(counterName) {
    let currentCount = parseInt(localStorage.getItem(counterName)) || 0;
    localStorage.setItem(counterName, currentCount + 1);
}

const venues = {
    'Rich Potato Neighborhood': {
        cars: [
            { name: 'Luxury Spud Sedan', price: 120000, chance: 0.15, image: 'images/luxury-spud-sedan.png' },
            { name: 'Sporty Tater Coupe', price: 40000, chance: 2.0, image: 'images/sporty-tater-coupe.png' },
            { name: 'Potato Convertible', price: 30000, chance: 3.0, image: 'images/potato-convertible.png' },
            { name: 'SUV Spud', price: 2000, chance: 4.0, image: 'images/suv-spud.png' }
        ],
        stealChance: 15
    },
    'Spudville Downtown': {
        cars: [
            { name: 'Hatchback Tuber', price: 1500, chance: 3.0, image: 'images/hatchback-tuber.png' },
            { name: 'Sedan Yam', price: 20000, chance: 2.5, image: 'images/sedan-yam.png' },
            { name: 'SUV Tater', price: 25000, chance: 2.0, image: 'images/suv-tater.png' },
            { name: 'Spudnik Sports', price: 90000, chance: 0.4, image: 'images/spudnik-sports.png' }
        ],
        stealChance: 25
    },
    'Fries End Suburbs': {
        cars: [
            { name: 'Compact Fry', price: 10000, chance: 4.0, image: 'images/compact-fry.png' },
            { name: 'Curly Coupe', price: 15000, chance: 3.0, image: 'images/curly-coupe.png' },
            { name: 'Wedge Wagon', price: 20000, chance: 2.0, image: 'images/wedge-wagon.png' },
            { name: 'Crispy Convertible', price: 110000, chance: 0.3, image: 'images/crispy-convertible.png' }
        ],
        stealChance: 35
    },
    'Mashy Meadows': {
        cars: [
            { name: 'Mashed Mini', price: 500, chance: 5.0, image: 'images/mashed-mini.png' },
            { name: 'Buttery Buggy', price: 8000, chance: 3.0, image: 'images/buttery-buggy.png' },
            { name: 'Gravy Sedan', price: 12000, chance: 1.5, image: 'images/gravy-sedan.png' },
            { name: 'Peeler Pickup', price: 18000, chance: 0.5, image: 'images/peeler-pickup.png' }
        ],
        stealChance: 45
    },
    'Tuber Town': {
        cars: [
            { name: 'Root Roadster', price: 7000, chance: 4.5, image: 'images/root-roadster.png' },
            { name: 'Bulb Buggy', price: 10000, chance: 3.5, image: 'images/bulb-buggy.png' },
            { name: 'Starch Sedan', price: 15000, chance: 1.5, image: 'images/starch-sedan.png' },
            { name: 'Tuber Truck', price: 60000, chance: 0.5, image: 'images/tuber-truck.png' }
        ],
        stealChance: 40
    }
};
function updateActivityCounter(activityName) {
  let count = parseInt(localStorage.getItem(activityName)) || 0;
  count++;
  localStorage.setItem(activityName, count.toString());
  return count;
}

document.querySelectorAll('.steal-btn').forEach(btn => {
    btn.addEventListener('click', () => stealCar(btn));
});


function updateStealChance(btn, newChance) {
  btn.dataset.chance = newChance;
  btn.parentNode.querySelector('.chance-of-theft').textContent = `Chance of Theft: ${newChance}%`;
}

function stealCar(btn) {
  // Clear any previous messages
  successMsg.textContent = '';
  failureMsg.textContent = '';

  if (inJail) {
      failureMsg.textContent = 'You cannot steal cars while in jail!';
      return; // Exit the function early if in jail
  }

  const venueName = btn.parentNode.querySelector('h2').textContent;
  const venue = venues[venueName];
  const venueChance = venue.stealChance;
  const carRoll = Math.floor(Math.random() * 100) + 1;

if (carRoll <= venueChance) {
    const car = getRandomCar(venue.cars);
    const carWithTypeInfo = { ...car, type: 'car' }; // Add a type property to the car object
    stolenCars.push(carWithTypeInfo); // Use the new car object with the type property
    InventoryManager.addToInventory(carWithTypeInfo); // Adjusted to add car with type info to inventory
    
    // Clear previous success message content (if any)
    successMsg.innerHTML = '';

    // Create text node for the success message
    const textNode = document.createTextNode(`You successfully stole a ${car.name}! `);

    // Create an image element and set its source to the car's image
    const img = document.createElement('img');
    img.src = car.image;
    img.alt = `Image of ${car.name}`;
    img.style.width = '200px';
    img.style.display = 'block'; 
    img.style.margin = '0 auto'; 

    // Append the text node and the image to the success message element
    successMsg.appendChild(textNode);
    successMsg.appendChild(img);

    incrementCounter('carTheftsCount');
    updateGarage();
    updateMoneyDisplay();
  } else {
      const failureChance = 30;
      const failureRoll = Math.random() * 100;
      if (failureRoll <= failureChance) {
          failureMsg.textContent = getCarTheftFailureScenario();
      } else {
          failureMsg.textContent = 'You got caught and sent to jail!';
          sendToJail();
      }
  }
}

function updateJailStatus() {
  const jailContainer = document.getElementById('jail-container');
  if (inJail) {
      jailContainer.innerHTML = '<img src="images/potatojail.jpg" alt="Jail">'; // Add correct path
      const intervalId = setInterval(() => {
          if (jailTime > 0) {
              jailTimer.innerHTML = `Jail time: ${jailTime} seconds`;
              jailTime--;
              localStorage.setItem('jailTime', jailTime.toString());
          } else {
              clearInterval(intervalId);
              inJail = false;
              jailTimer.innerHTML = '';
              localStorage.setItem('inJail', 'false');
              jailContainer.innerHTML = ''; // Clear the jail image
          }
      }, 1000);
  } else {
      jailContainer.innerHTML = ''; // Ensure it's cleared if not in jail
      jailTimer.innerHTML = '';
  }
}

function attemptBreakout() {
  if (inJail && !attemptedBreakout) {
      attemptedBreakout = true;
      const chanceOfEscape = 5;
      const roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= chanceOfEscape) {
          inJail = false;
          jailTimer.textContent = '';
          failureMsg.textContent = 'You successfully broke out of jail!';
          localStorage.setItem('inJail', 'false');
          jailTime = 0;
      } else {
          jailTime += 30;
          jailTimer.textContent = `Failed breakout attempt. Jail time increased to ${jailTime} seconds`;
          localStorage.setItem('jailTime', jailTime.toString());
      }
  } else if (attemptedBreakout) {
      failureMsg.textContent = 'You can only attempt to break out once.';
  }
}

function sendToJail() {
  inJail = true;
  jailTime = 30; 
  localStorage.setItem('inJail', 'true');
  localStorage.setItem('jailTime', jailTime.toString());
  attemptedBreakout = false; 
  updateJailStatus();
}

function updateGarage() {
    // Clear the current garage display
    garage.innerHTML = '';

    // Filter the stolenCars array to only include items of type 'car'
    const carsInGarage = stolenCars.filter(item => item.type === 'car');

    // Iterate over the cars and create a new list item for each one
    carsInGarage.forEach(car => {
        // Create the list item that represents the car
        const carItem = document.createElement('li');
        carItem.className = 'car-item';

        // Create and set the image for the car
        const img = document.createElement('img');
        img.src = car.image;
        img.alt = car.name;
        img.style.width = '100px'; // or whatever size you prefer

        // Create the text span for the car's name and price
        const text = document.createElement('span');
        text.textContent = ` ${car.name} - $${car.price}`;

        // Create the sell button for the car
        const sellBtn = document.createElement('button');
        sellBtn.textContent = 'Sell';
        sellBtn.className = 'sell-btn';
        sellBtn.addEventListener('click', () => sellCar(car));

        // Append the image, text, and sell button to the list item
        carItem.appendChild(img);
        carItem.appendChild(text);
        carItem.appendChild(sellBtn);

        // Finally, append the list item to the garage
        garage.appendChild(carItem);
    });

    // Update the localStorage with the latest stolenCars list
    localStorage.setItem('stolenCars', JSON.stringify(stolenCars));
}

function cheat() {
  console.log('Cheat function called'); 
  inJail = false;
  jailTime = 0;
  localStorage.setItem('inJail', 'false'); 
  localStorage.setItem('jailTime', '0'); 
  updateJailStatus();
}

function toggleGarage() {
    garage.style.display = garage.style.display === 'none' ? 'block' : 'none';
}

function sellCar(carToSell) {
    // Filter out the sold car from stolenCars
    stolenCars = stolenCars.filter(car => car !== carToSell);
    // Add the car's price to the money
    money += carToSell.price;
    // Update the money display and the garage
    updateMoneyDisplay();
    updateGarage();
    // Update the localStorage with the new money amount and stolenCars list
    localStorage.setItem('money', money.toString());
    localStorage.setItem('stolenCars', JSON.stringify(stolenCars));
}

function updateInventory(soldCar) {
  // Assume you have an inventory array in localStorage
  let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  inventory.push(soldCar);
  localStorage.setItem('inventory', JSON.stringify(inventory));
}

function getRandomCar(cars) {
  let totalChance = cars.reduce((sum, car) => sum + car.chance, 0);
  let randomNum = Math.random() * totalChance;
  for (let car of cars) {
      if (randomNum < car.chance) {
          return car;
      }
      randomNum -= car.chance;
  }
  return cars[cars.length - 1]; // Fallback if needed
}

function getCarTheftFailureScenario() {
  const scenarios = [
      "Your tools broke during the theft.",
      "A security guard appeared, forcing you to flee.",
      "The car alarm went off, attracting attention."
      
  ];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

toggleGarageBtn.addEventListener('click', toggleGarage);
breakoutBtn.addEventListener('click', attemptBreakout);
document.getElementById('cheatButton').addEventListener('click', cheat);

function updateMoneyDisplay() {
  const moneyDisplay = document.querySelector('.money-display');
  moneyDisplay.textContent = `Money: $${money}`;
  localStorage.setItem('money', money.toString());
}

window.addEventListener('load', () => {
  if (inJail) {
      updateJailStatus();
  }
  updateGarage();
  updateMoneyDisplay(); 
});

