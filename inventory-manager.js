const InventoryManager = {
    getInventory: function(filterType = null) {
        // Retrieve the inventory from localStorage and filter by type if necessary
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        return filterType ? inventory.filter(item => item.type === filterType) : inventory;
    },

    clearInventory: function() {
        // Clear the inventory in localStorage or however it's being stored
        localStorage.setItem('inventory', JSON.stringify([])); // Assuming inventory is stored as an array
        // Dispatch the inventoryChanged event to update other parts of the UI
        document.dispatchEvent(new Event('inventoryChanged'));
    },

    addToInventory: function(item) {
        let inventory = this.getInventory();
        const existingItemIndex = inventory.findIndex(invItem => invItem.name === item.name);

        // If the item is a car, it should not have a quantity but instead be a unique item in the inventory.
        if (item.type === 'car') {
            // Assuming that cars are unique, we don't increase quantity but rather add a new entry.
            inventory.push(item);
        } else {
            if (existingItemIndex >= 0) {
                // If the item already exists and is not a car, increase its quantity.
                inventory[existingItemIndex].quantity += (item.quantity || 1);
            } else {
                // If the item doesn't exist and is not a car, set its quantity to 1 and add it.
                item.quantity = 1;
                inventory.push(item);
            }
        }

        // Use the correct key to store the updated inventory.
        localStorage.setItem('inventory', JSON.stringify(inventory));
        this.dispatchInventoryChanged();
    },

    removeFromInventory: function(itemName, itemType) {
        let inventory = this.getInventory();
        // Find the index of the first item that matches the itemName and itemType
        const itemIndex = inventory.findIndex(item => item.name === itemName && item.type === itemType);
    
        if (itemIndex !== -1) {
            // If an item is found, remove it from the inventory array
            inventory.splice(itemIndex, 1);
        }
    
        // Update the inventory in localStorage
        localStorage.setItem('inventory', JSON.stringify(inventory));
        // Dispatch the inventoryChanged event to update the UI accordingly
        this.dispatchInventoryChanged();
    },
    // ... other methods ...

    dispatchInventoryChanged: function() {
        // Dispatch the inventoryChanged event
        document.dispatchEvent(new Event('inventoryChanged'));
        // Call the displayGameStats() to update the score screen if available
        if (typeof displayGameStats === "function") {
            displayGameStats();
        }
    }
};


function removeQueensCrownImageIfNotInInventory() {
    const inventory = InventoryManager.getInventory();
    const queensCrown = inventory.find(item => item.name === "Queen's Crown");

    if (!queensCrown) {
        const queensCrownImageDiv = document.querySelector('.queenscrown-image');
        if (queensCrownImageDiv) {
            queensCrownImageDiv.innerHTML = '';
        }
    }
}