// Get booking ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('bookingId');

// Load and display invoice on page load
window.addEventListener('load', () => {
    if (!bookingId) {
        showErrorPopup('Error', 'No booking ID provided. Redirecting to bookings...');
        setTimeout(() => window.location.href = 'booking.html', 2000);
        return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
        showErrorPopup('Error', 'Booking not found. Redirecting to bookings...');
        setTimeout(() => window.location.href = 'booking.html', 2000);
        return;
    }

    displayInvoice(booking);
});

// Display invoice details
function displayInvoice(booking) {
    const invoiceDate = new Date(booking.bookingDate);
    const departureDate = new Date(booking.departureDate);
    
    // Invoice header info
    document.getElementById('invoiceNumber').textContent = `Invoice #${booking.bookingId}`;
    document.getElementById('invoiceDate').textContent = invoiceDate.toLocaleDateString();
    document.getElementById('bookingID').textContent = booking.bookingId;

    // Customer info
    document.getElementById('customerName').textContent = booking.userName;
    document.getElementById('customerEmail').textContent = booking.userEmail;

    // Flight details
    document.getElementById('airline').textContent = booking.airline;
    document.getElementById('flightNumber').textContent = booking.flightNumber;
    document.getElementById('cabinClass').textContent = `Class: ${booking.cabinClass.charAt(0).toUpperCase() + booking.cabinClass.slice(1)}`;

    // Route details
    document.getElementById('departureCode').textContent = booking.departure.substring(0, 3).toUpperCase();
    document.getElementById('departureCity').textContent = booking.departure;
    document.getElementById('departureDate').textContent = departureDate.toLocaleDateString();

    document.getElementById('arrivalCode').textContent = booking.arrival.substring(0, 3).toUpperCase();
    document.getElementById('arrivalCity').textContent = booking.arrival;
    document.getElementById('arrivalDate').textContent = departureDate.toLocaleDateString();

    // Items table
    const itemDescription = `Flight Ticket (${booking.departure} → ${booking.arrival})`;
    document.getElementById('itemDescription').textContent = itemDescription;
    document.getElementById('itemQuantity').textContent = booking.passengers;
    document.getElementById('itemPrice').textContent = `$${booking.pricePerPerson}`;
    document.getElementById('itemAmount').textContent = `$${booking.totalPrice}`;

    // Totals
    document.getElementById('subtotal').textContent = `$${booking.totalPrice}`;
    document.getElementById('grandTotal').textContent = `$${booking.totalPrice}`;

    // Payment date
    document.getElementById('paymentDate').textContent = invoiceDate.toLocaleDateString();
}

// Download invoice as PDF
function downloadInvoice() {
    const element = document.querySelector('.invoice-container');
    const opt = {
        margin: 10,
        filename: `Invoice_${bookingId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    // Show message if html2pdf is not available
    if (window.html2pdf) {
        window.html2pdf().set(opt).save();
    } else {
        showErrorPopup('PDF Download', 'Please use the browser print function to save as PDF (Ctrl+P or Cmd+P)');
    }
}
