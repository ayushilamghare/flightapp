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

// Search Form
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

    const results = sampleFlights.filter(flight =>
        flight.departure.toLowerCase() === departure.toLowerCase() &&
        flight.arrival.toLowerCase() === arrival.toLowerCase()
    );

    displayFlightResults(results, departure, arrival, passengers, tripType);
});

// Display Results
function displayFlightResults(flights, departure, arrival, passengers) {
    const flightResults = document.getElementById('flightResults');
    const flightsList = document.getElementById('flightsList');
    const resultsInfo = document.getElementById('resultsInfo');

    if (flights.length === 0) {
        resultsInfo.innerHTML = `<strong>No flights found from ${departure} to ${arrival}</strong>`;
        flightsList.innerHTML = '<p class="no-results">No flights available</p>';
        flightResults.style.display = 'block';
        return;
    }

    resultsInfo.innerHTML = `Found ${flights.length} flight(s)`;

    flightsList.innerHTML = flights.map(flight => `
        <div class="flight-card">
            <div class="flight-header">
                <div class="airline-info">
                    <div>${flight.image}</div>
                    <div>
                        <h4>${flight.airline}</h4>
                        <p>${flight.flightNumber}</p>
                    </div>
                </div>
                <div>
                    <h5>${flight.departTime} → ${flight.arrivalTime}</h5>
                    <p>${flight.departure} → ${flight.arrival}</p>
                </div>
                <div>
                    <h3>$${flight.price}</h3>
                    <p>Total: $${flight.price * passengers}</p>
                </div>
            </div>
            <div class="flight-footer">
                <button class="btn btn-book"
                onclick="bookFlight(${flight.id}, ${flight.price}, ${passengers}, '${flight.airline}', '${flight.flightNumber}', '${flight.departure}', '${flight.arrival}')">
                Book Now
                </button>
            </div>
        </div>
    `).join('');

    flightResults.style.display = 'block';
}

// BOOK FLIGHT (UPDATED WITH CONFIRMATION)
function bookFlight(flightId, price, passengers, airline, flightNumber, departure, arrival) {
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        showErrorPopup('Login Required', 'Please login first');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }

    const totalPrice = price * passengers;

    // 🔥 Confirmation
    const confirmBooking = confirm(`Are you sure you want to book?

✈️ ${airline} (${flightNumber})
📍 ${departure} → ${arrival}
👤 ${passengers} Passenger(s)
💰 $${totalPrice}`);

    if (!confirmBooking) return;

    const bookingId = 'BK' + Date.now();

    const booking = {
        bookingId,
        airline,
        flightNumber,
        departure,
        arrival,
        passengers,
        totalPrice,
        userEmail: currentUser.email
    };

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert(`Booking Confirmed!\nID: ${bookingId}`);
}

// DIRECT BOOK (UPDATED)
function directBook(departure, arrival, price, airline, flightNumber) {
    const currentUser = getLoggedInUser();

    if (!currentUser) {
        showErrorPopup('Login Required', 'Please login first');
        return;
    }

    const totalPrice = price;

    const confirmBooking = confirm(`Book this flight?

✈️ ${airline} (${flightNumber})
📍 ${departure} → ${arrival}
💰 $${totalPrice}`);

    if (!confirmBooking) return;

    const bookingId = 'BK' + Date.now();

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    bookings.push({
        bookingId,
        airline,
        flightNumber,
        departure,
        arrival,
        totalPrice,
        userEmail: currentUser.email
    });

    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert("Flight Booked!");
}

// DATE LOGIC
window.addEventListener('load', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departDate').min = today;
    document.getElementById('returnDate').min = today;
});