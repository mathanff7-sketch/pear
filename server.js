// PAINT - Private Makeup Atelier
// Backend server for the booking form (matches frontend fetch to /api/book)

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data', 'bookings.json');

// ---------- Middleware ----------
app.use(cors());           // allow requests from the frontend (different origin/file)
app.use(express.json());   // parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // serve the website (index.html, images, etc.)

// ---------- Simple JSON file "database" ----------
function ensureDbFile() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

function readBookings() {
    ensureDbFile();
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch (err) {
        return [];
    }
}

function writeBookings(bookings) {
    ensureDbFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
}

// ---------- Validation helper ----------
function validateBooking(body) {
    const errors = [];
    const { name, phone, email, service, date, time } = body;

    if (!name || !name.trim()) errors.push('Name is required');
    if (!phone || !phone.trim()) errors.push('Phone is required');
    if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone.trim())) errors.push('Phone number is invalid');
    if (!email || !email.trim()) errors.push('Email is required');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Email is invalid');
    if (!service || !service.trim()) errors.push('Service is required');
    if (!date || !date.trim()) errors.push('Date is required');
    if (!time || !time.trim()) errors.push('Time is required');

    return errors;
}

// ---------- Routes ----------

// Health check (API)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PAINT booking backend is running' });
});

// Create a new booking  -> used by the frontend form
app.post('/api/book', (req, res) => {
    const errors = validateBooking(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const { name, phone, email, service, date, time, message } = req.body;

    const bookings = readBookings();

    const newBooking = {
        id: Date.now().toString(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        service: service.trim(),
        date: date.trim(),
        time: time.trim(),
        message: (message || '').trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully!',
        booking: newBooking
    });
});

// Get all bookings -> for an admin panel/dashboard
app.get('/api/bookings', (req, res) => {
    const bookings = readBookings();
    res.json({ success: true, count: bookings.length, bookings });
});

// Get a single booking by id
app.get('/api/bookings/:id', (req, res) => {
    const bookings = readBookings();
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
});

// Update booking status (e.g. confirm/cancel) -> for admin use
app.patch('/api/bookings/:id', (req, res) => {
    const bookings = readBookings();
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `status must be one of: ${allowedStatuses.join(', ')}`
        });
    }

    bookings[index].status = status;
    writeBookings(bookings);

    res.json({ success: true, booking: bookings[index] });
});

// Delete a booking -> for admin use
app.delete('/api/bookings/:id', (req, res) => {
    const bookings = readBookings();
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const removed = bookings.splice(index, 1)[0];
    writeBookings(bookings);

    res.json({ success: true, message: 'Booking deleted', booking: removed });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
    ensureDbFile();
    console.log(`PAINT backend server running on http://localhost:${PORT}`);
});
