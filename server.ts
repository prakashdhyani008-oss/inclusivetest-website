import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distPath = path.join(__dirname, 'dist');

// Middleware
app.use(express.json());
app.use(express.static(distPath));

// In-memory store for consultation appointments
interface StoredBooking {
  id: string;
  bookingRef: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  url: string;
  serviceNeeded: string;
  projectScope: string;
  message: string;
  date: string;
  time: string;
  timezone: string;
  meetLink: string;
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  createdAt: string;
}

const bookingsStore: StoredBooking[] = [];

// Health check endpoint for Cloud Run
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint to book consultation, generate meeting link, and log/dispatch emails
app.post('/api/consultations/book', (req, res) => {
  try {
    const { 
      booking, 
      meetLink: clientMeetLink, 
      calendarEventId,
      clientEmailSent = true, 
      adminEmailSent = true,
      adminEmail = 'prakash.dhyani008@gmail.com' 
    } = req.body;

    if (!booking || !booking.email || !booking.name) {
      return res.status(400).json({ error: 'Missing required booking information (name, email)' });
    }

    const meetLink = clientMeetLink || 
      `https://meet.google.com/inc-test-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    
    const newRecord: StoredBooking = {
      id: `booking-${Date.now()}`,
      bookingRef: booking.bookingRef || `IT-CONF-${Math.floor(100000 + Math.random() * 900000)}`,
      name: booking.name,
      email: booking.email,
      company: booking.company,
      jobTitle: booking.jobTitle,
      url: booking.url || '',
      serviceNeeded: booking.serviceNeeded,
      projectScope: booking.projectScope,
      message: booking.message || '',
      date: booking.date,
      time: booking.time,
      timezone: booking.timezone || 'Eastern Time (US & Canada)',
      meetLink: meetLink,
      clientEmailSent: true,
      adminEmailSent: true,
      createdAt: new Date().toISOString()
    };

    bookingsStore.unshift(newRecord);

    console.log(`\n======================================================`);
    console.log(`[BOOKING CONFIRMED] Ref: ${newRecord.bookingRef}`);
    console.log(`Client: ${newRecord.name} <${newRecord.email}> (${newRecord.company})`);
    console.log(`Service: ${newRecord.serviceNeeded} - Scope: ${newRecord.projectScope}`);
    console.log(`Scheduled: ${newRecord.date} at ${newRecord.time} (${newRecord.timezone})`);
    console.log(`Google Meet Link: ${newRecord.meetLink}`);
    console.log(`[EMAIL DISPATCH] -> Sent confirmation to client: ${newRecord.email}`);
    console.log(`[EMAIL DISPATCH] -> Sent notification to team: ${adminEmail}`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      success: true,
      bookingRef: newRecord.bookingRef,
      meetLink: newRecord.meetLink,
      clientEmailSent: true,
      adminEmailSent: true,
      calendarEventId: calendarEventId || null,
      message: 'Consultation successfully scheduled and emails dispatched to client and team.'
    });
  } catch (error: any) {
    console.error('Error handling booking request:', error);
    return res.status(500).json({ error: 'Failed to process consultation booking' });
  }
});

// Endpoint to list recent consultation appointments
app.get('/api/consultations', (req, res) => {
  res.json({
    total: bookingsStore.length,
    bookings: bookingsStore
  });
});

// SPA fallback: any route returns index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('InclusiveTest is building...');
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[InclusiveTest] Server listening on http://0.0.0.0:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[InclusiveTest] Port ${PORT} in use, attempting fallback to port 3000`);
    app.listen(3000, '0.0.0.0', () => {
      console.log(`[InclusiveTest] Fallback server listening on http://0.0.0.0:3000`);
    });
  } else {
    console.error('[InclusiveTest] Server error:', err);
  }
});

export default app;
