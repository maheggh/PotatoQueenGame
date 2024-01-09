function updateActivityCounter(activityName) {
    let count = parseInt(localStorage.getItem(activityName)) || 0;
    count++;
    localStorage.setItem(activityName, count.toString());
    return count;
}

updateActivityCounter('smugglingCount');