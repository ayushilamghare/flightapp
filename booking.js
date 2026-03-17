// Sample flight data for demo
const sampleFlights = [
    {
        id: 1,
        airline: 'SkyAir',
        flightNumber: 'SA101',
        departure: 'New York',
        arrival: 'London',
        departTime: '09:00',
        arrivalTime: '21:30',
        duration: '7h 30m',
        stops: 0,
        price: 450,
        image: '✈️'
    },
    {
        id: 2,
        airline: 'AeroLine',
        flightNumber: 'AL202',
        departure: 'New York',
        arrival: 'London',
        departTime: '14:00',
        arrivalTime: '02:45',
        duration: '8h 45m',
        stops: 1,
        price: 380,
        image: '✈️'
    },
    {
        id: 3,
        airline: 'GlobalWings',
        flightNumber: 'GW303',
        departure: 'New York',
        arrival: 'London',
        departTime: '18:30',
        arrivalTime: '06:00',
        duration: '7h 30m',
        stops: 0,
        price: 520,
        image: '✈️'
    },
    {
        id: 4,
        airline: 'EuroStar Airlines',
        flightNumber: 'ES404',
        departure: 'Los Angeles',
        arrival: 'Tokyo',
        departTime: '10:00',
        arrivalTime: '14:30',
        duration: '12h 30m',
        stops: 0,
        price: 580,
        image: '✈️'
    },
    {
        id: 5,
        airline: 'SkyAir',
        flightNumber: 'SA505',
        departure: 'Paris',
        arrival: 'Barcelona',
        departTime: '08:00',
        arrivalTime: '09:45',
        duration: '1h 45m',
        stops: 0,
        price: 120,
        image: '✈️'
    },
    {
        id: 6,
        airline: 'AeroLine',
        flightNumber: 'AL606',
        departure: 'Dubai',
        arrival: 'Singapore',
        departTime: '23:00',
        arrivalTime: '07:30',
        duration: '7h 30m',
        stops: 0,
        price: 350,
        image: '✈️'
    }
];

// Flight Search Form Submission
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const departure = document.getElementById('departure').value.trim();
    const arrival = document.getElementById('arrival').value.trim();
    const passengers = document.getElementById('passengers').value;
    const tripType = document.getElementById('tripType').value;

    if (!departure || !arrival) {
        showErrorPopup('Invalid Input', 'Please enter both departure and arrival cities');
        return;
    }

    if (departure.toLowerCase() === arrival.toLowerCase()) {
        showErrorPopup('Invalid Route', 'Departure and arrival cities cannot be the same');
        return;
    }

    // Filter flights based on search criteria
    const results = sampleFlights.filter(flight =>
        flight.departure.toLowerCase() === departure.toLowerCase() &&
        flight.arrival.toLowerCase() === arrival.toLowerCase()
    );

    displayFlightResults(results, departure, arrival, passengers, tripType);
});

// Display flight results
function displayFlightResults(flights, departure, arrival, passengers, tripType) {
    const flightResults = document.getElementById('flightResults');
    const flightsList = document.getElementById('flightsList');
    const resultsInfo = document.getElementById('resultsInfo');

    if (flights.length === 0) {
        resultsInfo.innerHTML = `<strong>No flights found from ${departure} to ${arrival}</strong>`;
        flightsList.innerHTML = '<p class="no-results">Sorry, no flights available for this route. Please try a different search.</p>';
        flightResults.style.display = 'block';
        return;
    }

    resultsInfo.innerHTML = `Found ${flights.length} flight(s) from <strong>${departure}</strong> to <strong>${arrival}</strong> for <strong>${passengers} passenger(s)</strong>`;

    flightsList.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div class="flight-header">
                <div class="airline-info">
                    <div class="airline-logo">${flight.image}</div>
                    <div>
                        <h4>${flight.airline}</h4>
                        <p class="flight-number">Flight ${flight.flightNumber}</p>
                    </div>
                </div>
                <div class="flight-time">
                    <div class="time-section">
                        <h5>${flight.departTime}</h5>
                        <p>${flight.departure.substring(0, 3).toUpperCase()}</p>
                    </div>
                    <div class="flight-duration">
                        <p>${flight.duration}</p>
                        <div class="flight-line"></div>
                        <p class="stops">${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}</p>
                    </div>
                    <div class="time-section">
                        <h5>${flight.arrivalTime}</h5>
                        <p>${flight.arrival.substring(0, 3).toUpperCase()}</p>
                    </div>
                </div>
                <div class="flight-price">
                    <p class="price-label">Price per person</p>
                    <h3>$${flight.price}</h3>
                    <p class="total-price">Total: $${flight.price * passengers}</p>
                </div>
            </div>
            <div class="flight-footer">
                <button class="btn btn-book" onclick="bookFlight(${flight.id}, ${flight.price}, ${passengers}, '${flight.airline}', '${flight.flightNumber}', '${flight.departure}', '${flight.arrival}')">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');

    flightResults.style.display = 'block';
    flightResults.scrollIntoView({ behavior: 'smooth' });
}

// Book flight function
function bookFlight(flightId, price, passengers, airline, flightNumber, departure, arrival) {
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        showErrorPopup('Login Required', 'Please login to book a flight');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }

    const totalPrice = price * passengers;
    const bookingId = 'BK' + Date.now();
    
    const booking = {
        bookingId,
        flightId,
        airline,
        flightNumber,
        departure,
        arrival,
        passengers,
        pricePerPerson: price,
        totalPrice,
        bookingDate: new Date().toISOString(),
        departureDate: document.getElementById('departDate').value,
        returnDate: document.getElementById('returnDate').value,
        cabinClass: document.getElementById('class').value,
        userName: currentUser.name,
        userEmail: currentUser.email
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    showSuccessPopup('🎉 Booking Confirmed!', `Your flight with ${airline} (${flightNumber}) has been booked!\n\nBooking ID: ${bookingId}\nTotal: $${totalPrice}`);
    displayMyBookings();
}

// Display My Bookings
function displayMyBookings() {
    const currentUser = getLoggedInUser();
    
    if (!currentUser) {
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(b => b.userEmail === currentUser.email);

    const myBookingsSection = document.getElementById('myBookingsSection');
    const bookingsList = document.getElementById('bookingsList');

    if (userBookings.length === 0) {
        myBookingsSection.style.display = 'none';
        return;
    }

    myBookingsSection.style.display = 'block';
    bookingsList.innerHTML = userBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">
                    <strong>Booking ID:</strong> ${booking.bookingId}
                </div>
                <div class="booking-status">
                    <span class="status-badge confirmed">✓ Confirmed</span>
                </div>
            </div>
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <label>Airline</label>
                        <p>${booking.airline}</p>
                    </div>
                    <div class="detail-item">
                        <label>Flight Number</label>
                        <p>${booking.flightNumber}</p>
                    </div>
                    <div class="detail-item">
                        <label>Cabin Class</label>
                        <p style="text-transform: capitalize;">${booking.cabinClass}</p>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-item">
                        <label>Route</label>
                        <p>${booking.departure} → ${booking.arrival}</p>
                    </div>
                    <div class="detail-item">
                        <label>Departure Date</label>
                        <p>${new Date(booking.departureDate).toLocaleDateString()}</p>
                    </div>
                    <div class="detail-item">
                        <label>Passengers</label>
                        <p>${booking.passengers}</p>
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-item">
                        <label>Price Per Person</label>
                        <p>$${booking.pricePerPerson}</p>
                    </div>
                    <div class="detail-item">
                        <label>Total Price</label>
                        <p class="total-amount">$${booking.totalPrice}</p>
                    </div>
                    <div class="detail-item">
                        <label>Booked On</label>
                        <p>${new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div class="booking-actions">
                <button class="btn btn-invoice" onclick="viewInvoice('${booking.bookingId}')">
                    📄 View Invoice
                </button>
                <button class="btn btn-cancel" onclick="cancelBooking('${booking.bookingId}')">
                    ✕ Cancel Booking
                </button>
            </div>
        </div>
    `).join('');

    // Scroll to bookings section
    myBookingsSection.scrollIntoView({ behavior: 'smooth' });
}

// View Invoice
function viewInvoice(bookingId) {
    // Redirect to invoice page with booking ID
    window.location.href = `invoice.html?bookingId=${bookingId}`;
}

// Cancel Booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const updatedBookings = bookings.filter(b => b.bookingId !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        
        showSuccessPopup('Booking Cancelled', 'Your booking has been cancelled. Refund will be processed within 5-7 business days.');
        displayMyBookings();
    }
}

// Direct book from popular routes without searching
function directBook(departure, arrival, price, airline, flightNumber) {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
        showErrorPopup('Login Required', 'Please login to book a flight');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    const passengers = 1;
    const totalPrice = price * passengers;
    const bookingId = 'BK' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    const booking = {
        bookingId,
        flightId: Math.random() * 1000,
        airline,
        flightNumber,
        departure,
        arrival,
        passengers,
        pricePerPerson: price,
        totalPrice,
        bookingDate: new Date().toISOString(),
        departureDate: today,
        returnDate: '',
        cabinClass: 'economy',
        userName: currentUser.name,
        userEmail: currentUser.email
    };
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    showSuccessPopup('Booking Confirmed!', `Flight with ${airline} booked!\n\nBooking ID: ${bookingId}\nTotal: $${totalPrice}`);
    setTimeout(() => {
        window.location.href = `invoice.html?bookingId=${bookingId}`;
    }, 2000);
}

// Select route from popular routes
function selectRoute(departure, arrival) {
    document.getElementById('departure').value = departure;
    document.getElementById('arrival').value = arrival;
    document.getElementById('searchForm').scrollIntoView({ behavior: 'smooth' });
}

// Set minimum date to today
window.addEventListener('load', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').min = today;
    document.getElementById('returnDate').min = today;

    // Update return date minimum when departure date changes
    document.getElementById('departDate').addEventListener('change', (e) => {
        document.getElementById('returnDate').min = e.target.value;
    });

    // Display bookings if user is logged in
    displayMyBookings();
});
