// script.js
function calculateCost() {
    const roomType = document.getElementById('room-type').value;
    const checkInDate = new Date(document.getElementById('check-in-date').value + 'T' + document.getElementById('check-in-time').value);
    const checkOutDate = new Date(document.getElementById('check-out-date').value + 'T' + document.getElementById('check-out-time').value);

    const totalTime = Math.abs(checkOutDate - checkInDate);
    const totalHours = Math.ceil(totalTime / (1000 * 60 * 60));
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    let cost = 0;

    switch (roomType) {
        case 'small':
            cost = (totalDays * 100) + (remainingHours * 10);
            break;
        case 'medium':
            cost = (totalDays * 150) + (remainingHours * 15);
            break;
        case 'large':
            cost = (totalDays * 200) + (remainingHours * 20);
            break;
        case 'executive':
            cost = (totalDays * 300) + (remainingHours * 30);
            break;
    }

    document.getElementById('result').innerText = `ESTIMATED BOOKING COSTS: $${cost.toFixed(2)} (${totalDays} Days, ${remainingHours} Hours)`;
}
