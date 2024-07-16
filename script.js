function calculateCost() {
    const roomType = document.getElementById('room-type').value;
    const checkInDate = new Date(document.getElementById('check-in-date').value + 'T' + document.getElementById('check-in-time').value);
    const checkOutDate = new Date(document.getElementById('check-out-date').value + 'T' + document.getElementById('check-out-time').value);

    const totalTime = Math.abs(checkOutDate - checkInDate);
    const totalHours = Math.ceil(totalTime / (1000 * 60 * 60));
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    let cost = 0;

    // Rates
    const rates = {
        small: { hourly: 100, daily: 800, weekly: 5600 },
        medium: { hourly: 150, daily: 1200, weekly: 8400 },
        large: { hourly: 200, daily: 1600, weekly: 11200 },
        executive: { hourly: 300, daily: 2400, weekly: 16800 }
    };

    if (roomType in rates) {
        const { hourly, daily, weekly } = rates[roomType];

        // Calculate cost
        if (totalWeeks > 0) {
            cost += totalWeeks * weekly;
        }
        if (remainingDays > 3) {
            cost += remainingDays * daily;
        } else {
            cost += remainingDays * 8 * hourly;
        }
        if (remainingHours > 0) {
            cost += remainingHours * hourly;
        }
    }

    document.getElementById('result').innerText = `ESTIMATED BOOKING COSTS: $${cost.toFixed(2)} (${totalWeeks} Weeks, ${remainingDays} Days, ${remainingHours} Hours)`;
}
