const rates = {
    "Small Room": { hourly: 100, daily: 800, weekly: 5600 },
    "Medium Room": { hourly: 150, daily: 1200, weekly: 8400 },
    "Large Room": { hourly: 200, daily: 1600, weekly: 11200 },
    "Executive Room": { hourly: 300, daily: 2400, weekly: 16800 },
};

let bookingIdCounter = 1; // Booking ID counter
let bookings = {}; // Object to store booking information

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const room = document.getElementById('room').value;
    const startTime = new Date(document.getElementById('start-time').value);
    const endTime = new Date(document.getElementById('end-time').value);

    if (!room || startTime >= endTime) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Calculate total hours
    const totalHours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
    let cost = 0;
    let bookingId = bookingIdCounter++;

    // Determine cost based on duration
    if (totalHours <= 8) {
        cost = totalHours * rates[room].hourly;
    } else if (totalHours > 8 && totalHours <= 24) {
        cost = rates[room].daily;
    } else if (totalHours > 24) {
        const days = Math.floor(totalHours / 24);
        cost = days * rates[room].weekly;
    }

    // Store booking information
    bookings[bookingId] = { room, startTime, endTime, cost, totalHours };

    // Display confirmation and cost
    const confirmation = document.getElementById('confirmation');
    const costSection = document.getElementById('cost-section');
    confirmation.classList.remove('hidden');
    costSection.classList.remove('hidden');

    confirmation.innerHTML = `You have successfully booked ${room} from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}.`;
    document.getElementById('cost').innerText = `Total Cost: $${cost}`;
    document.getElementById('booking-id').innerText = bookingId;

    // Reset the form
    this.reset();
});

document.getElementById('cost-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const retrieveId = parseInt(document.getElementById('retrieve-id').value);
    const retrieveEndTime = new Date(document.getElementById('retrieve-end-time').value);

    // Check if the booking ID exists
    if (bookings[retrieveId]) {
        const booking = bookings[retrieveId];
        const finalCostElement = document.getElementById('final-cost');

        // Initialize final cost with the original booking cost
        let finalCost = booking.cost;

        // Calculate the overtime cost if end time exceeds original booking end time
        if (retrieveEndTime > booking.endTime) {
            const overtimeHours = Math.ceil((retrieveEndTime - booking.endTime) / (1000 * 60 * 60));
            finalCost += overtimeHours * rates[booking.room].hourly * 1.5; // Overtime rate
        }

        // Display final cost based on retrieved booking information
        finalCostElement.classList.remove('hidden');
        finalCostElement.innerHTML = `Booking ID: ${retrieveId}. Room: ${booking.room}, Start Time: ${booking.startTime.toLocaleString()}, End Time: ${retrieveEndTime.toLocaleString()}, Final Cost: $${finalCost}.`;
    } else {
        alert('Invalid Booking ID. Please check and try again.');
    }
});

document.getElementById('cancellation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const cancelId = parseInt(document.getElementById('cancel-id').value);

    // Check if the booking ID exists
    if (bookings[cancelId]) {
        const booking = bookings[cancelId];
        const currentTime = new Date();
        const cancellationResult = document.getElementById('cancellation-result');

        // Check if cancellation is less than 24 hours before the booking start time
        const timeDifference = booking.startTime - currentTime;
        const isLateCancellation = timeDifference < (24 * 60 * 60 * 1000); // 24 hours in milliseconds
        
        let cancellationFee = 0;
        if (isLateCancellation) {
            cancellationFee = booking.cost * 0.5; // 50% of the total cost
        }

        // Remove the booking from the bookings object
        delete bookings[cancelId];

        // Display cancellation result
        cancellationResult.classList.remove('hidden');
        cancellationResult.innerHTML = `Booking ID: ${cancelId} has been cancelled.`;
        if (isLateCancellation) {
            cancellationResult.innerHTML += ` A cancellation fee of $${cancellationFee} will be applied.`;
        } else {
            cancellationResult.innerHTML += ` No cancellation fee applies.`;
        }
    } else {
        alert('Invalid Booking ID. Please check and try again.');
    }
});


// Load existing bookings from localStorage
if (localStorage.getItem('bookings')) {
    bookings = JSON.parse(localStorage.getItem('bookings'));
    bookingIdCounter = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;
}

// Function to display all bookings on the view bookings page
function displayBookings() {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '';

    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
        bookings = JSON.parse(storedBookings);
        bookings.forEach(booking => {
            const listItem = document.createElement('li');
            const statusText = booking.endTime < new Date() ? 'Done' : 'Upcoming'; // Determine status
            listItem.textContent = `Booking ID: ${booking.id}, Room: ${booking.roomType}, Start: ${new Date(booking.startTime).toLocaleString()}, End: ${new Date(booking.endTime).toLocaleString()}, Status: ${statusText}`;
            bookingsList.appendChild(listItem);
        });
    } else {
        bookingsList.innerHTML = '<li>No bookings found.</li>';
    }
}

// Call displayBookings when the page loads
window.onload = displayBookings;