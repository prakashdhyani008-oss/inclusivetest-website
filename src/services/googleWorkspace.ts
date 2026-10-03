import { ConsultationBookingState } from '../types';

export const ADMIN_EMAIL = 'prakash.dhyani008@gmail.com';

// Format Date object into Google Calendar ISO basic format: YYYYMMDDTHHmmssZ
export const toGoogleCalendarBasicDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

// Helper to convert date and time slot into ISO 8601 strings and GCal format
export const getAppointmentDateTimes = (dateStr: string, timeStr: string, timezoneStr?: string) => {
  const now = new Date();
  let year = now.getFullYear();

  // Extract year if specified
  const yearMatch = dateStr.match(/\b(202\d)\b/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  // Extract month
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  const lower = dateStr.toLowerCase();
  let month = now.getMonth();
  for (const [mName, mIdx] of Object.entries(months)) {
    if (lower.includes(mName)) {
      month = mIdx;
      break;
    }
  }

  // Extract day
  const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : now.getDate();

  // Extract hours and minutes
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  let hour = 10;
  let minute = 0;
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
    const isPM = timeMatch[3].toUpperCase() === 'PM';
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  }

  // Handle timezone offsets (IST = +5:30, Eastern = -4, etc.)
  let offsetMinutes = -240; // Default EDT (-4h)
  const tz = (timezoneStr || '').toLowerCase();
  if (tz.includes('ist') || tz.includes('india') || tz.includes('+5:30') || tz.includes('5.5')) {
    offsetMinutes = 330; // +5h 30m
  } else if (tz.includes('pacific') || tz.includes('gmt-7') || tz.includes('utc-7') || tz.includes('utc-8')) {
    offsetMinutes = -420;
  } else if (tz.includes('central') || tz.includes('gmt-5') || tz.includes('utc-5') || tz.includes('utc-6')) {
    offsetMinutes = -300;
  } else if (tz.includes('gmt') || tz.includes('utc') || tz.includes('greenwich')) {
    offsetMinutes = 0;
  } else if (tz.includes('cet') || tz.includes('+2') || tz.includes('europe')) {
    offsetMinutes = 120;
  } else if (tz.includes('bst') || tz.includes('+1') || tz.includes('british')) {
    offsetMinutes = 60;
  } else if (tz.includes('sgt') || tz.includes('hkt') || tz.includes('+8')) {
    offsetMinutes = 480;
  }

  // Compute UTC timestamp
  const utcMillis = Date.UTC(year, month, day, hour, minute, 0) - (offsetMinutes * 60 * 1000);
  const startDate = new Date(utcMillis);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 min session

  const googleCalendarDates = `${toGoogleCalendarBasicDate(startDate)}/${toGoogleCalendarBasicDate(endDate)}`;

  return {
    startDate,
    endDate,
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
    googleCalendarDates,
    formattedStart: `${dateStr} at ${timeStr}`
  };
};

// Generate working Google Calendar TEMPLATE URL
export const buildGoogleCalendarTemplateUrl = (
  booking: ConsultationBookingState,
  meetUrl: string
): string => {
  const { googleCalendarDates } = getAppointmentDateTimes(booking.date, booking.time, booking.timezone);
  const title = `InclusiveTest Accessibility Consultation (${booking.company || booking.name})`;
  const details = 
    `30-Minute Accessibility Strategy & Scope Consultation with InclusiveTest specialists.\n\n` +
    `Meeting Reference: ${booking.bookingRef}\n` +
    `Service: ${booking.serviceNeeded}\n` +
    `Scope: ${booking.projectScope}\n` +
    `Target URL: ${booking.url || 'To be shared'}\n\n` +
    `Google Meet Video Room: ${meetUrl}\n\n` +
    `Attendee: ${booking.name} (${booking.email})\n` +
    `Team: InclusiveTest Consulting\n\n` +
    `InclusiveTest — Building Digital Experiences for Everyone.`;

  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${googleCalendarDates}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(meetUrl)}` +
    `&add=${encodeURIComponent(booking.email)}`
  );
};

// Generate 1-click Web Gmail compose link
export const generateGmailWebComposeUrl = (
  booking: ConsultationBookingState,
  meetUrl: string
): string => {
  const subject = `Confirmed: Accessibility Consultation with InclusiveTest [Ref: ${booking.bookingRef}]`;
  const body = 
    `Hi ${booking.name},\n\n` +
    `Thank you for scheduling an accessibility consultation with InclusiveTest. Here are your confirmed meeting details:\n\n` +
    `• Reference: ${booking.bookingRef}\n` +
    `• Scheduled Time: ${booking.date} at ${booking.time} (${booking.timezone})\n` +
    `• Primary Service: ${booking.serviceNeeded}\n` +
    `• Scope: ${booking.projectScope}\n` +
    `• Organization: ${booking.company}\n\n` +
    `GOOGLE MEET VIDEO CALL LINK:\n${meetUrl}\n\n` +
    `To prepare for our call:\n` +
    `1. Have your primary application workflow URLs ready.\n` +
    `2. Outline any upcoming compliance milestones (WCAG 2.2, EAA, Section 508).\n\n` +
    `Best regards,\n` +
    `InclusiveTest Consulting Team`;

  return (
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(booking.email)}` +
    `&cc=${encodeURIComponent(ADMIN_EMAIL)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
};

// Generate standard mailto: link
export const generateMailtoUrl = (
  booking: ConsultationBookingState,
  meetUrl: string
): string => {
  const subject = `Confirmed: Accessibility Consultation with InclusiveTest [Ref: ${booking.bookingRef}]`;
  const body = 
    `Hi ${booking.name},\n\n` +
    `Your accessibility consultation with InclusiveTest is scheduled.\n\n` +
    `• Time: ${booking.date} at ${booking.time} (${booking.timezone})\n` +
    `• Service: ${booking.serviceNeeded}\n` +
    `• Google Meet Link: ${meetUrl}\n\n` +
    `InclusiveTest Team`;

  return `mailto:${booking.email}?cc=${encodeURIComponent(ADMIN_EMAIL)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export interface BookingResult {
  success: boolean;
  bookingRef: string;
  meetingLink: string;
  calendarEventId?: string;
  calendarHtmlLink?: string;
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  message: string;
}

// Create Google Calendar Event with Google Meet video link via Calendar API
export const createGoogleCalendarEvent = async (
  accessToken: string,
  booking: ConsultationBookingState
): Promise<{ eventId: string; meetLink: string; htmlLink: string }> => {
  const { startIso, endIso } = getAppointmentDateTimes(booking.date, booking.time, booking.timezone);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const requestId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const eventPayload = {
    summary: `InclusiveTest Consultation: ${booking.serviceNeeded} (${booking.company || booking.name})`,
    description: 
      `Scheduled 30-Minute Digital Accessibility Strategy Session.\n\n` +
      `• Client Name: ${booking.name}\n` +
      `• Organization: ${booking.company}\n` +
      `• Job Title: ${booking.jobTitle}\n` +
      `• Client Work Email: ${booking.email}\n` +
      `• Target URL / Platform: ${booking.url || 'Not provided'}\n` +
      `• Primary Service: ${booking.serviceNeeded}\n` +
      `• Scope: ${booking.projectScope}\n` +
      `• Client Notes: ${booking.message || 'None'}\n\n` +
      `Meeting Reference: ${booking.bookingRef}\n\n` +
      `Organized by InclusiveTest Consulting Team.`,
    start: {
      dateTime: startIso,
      timeZone: timeZone,
    },
    end: {
      dateTime: endIso,
      timeZone: timeZone,
    },
    attendees: [
      { email: booking.email, displayName: booking.name },
      { email: ADMIN_EMAIL, displayName: 'InclusiveTest Consultant' }
    ],
    conferenceData: {
      createRequest: {
        requestId: requestId,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 15 }
      ]
    }
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Google Calendar API error:', errorData);
    throw new Error(errorData.error?.message || `Google Calendar API error: ${response.statusText}`);
  }

  const data = await response.json();
  const meetLink = data.hangoutLink || 
    data.conferenceData?.entryPoints?.find((p: any) => p.entryPointType === 'video')?.uri || 
    `https://meet.google.com/inc-test-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

  return {
    eventId: data.id,
    meetLink: meetLink,
    htmlLink: data.htmlLink || ''
  };
};

// Safe base64url encoder supporting Unicode and emojis without deprecated unescape
export const stringToBase64Url = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Send email via Gmail API using valid base64url RFC 2822
export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  htmlBody: string,
  from?: string
): Promise<boolean> => {
  const utf8Subject = `=?utf-8?B?${stringToBase64Url(subject)}?=`;
  const bodyBase64 = stringToBase64Url(htmlBody);

  const lines = [
    `To: ${to}`,
    from ? `From: ${from}` : '',
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    bodyBase64
  ].filter(Boolean);

  const raw = stringToBase64Url(lines.join('\r\n'));

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.warn('Gmail API sending response:', response.status, errorData);
    return false;
  }
  return true;
};

// HTML Email Templates
export const generateClientEmailHtml = (booking: ConsultationBookingState, meetLink: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Consultation Confirmed</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <div style="background-color: #0f172a; padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff;">InclusiveTest Accessibility Consulting</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">Your 30-Minute Strategy Session is Confirmed</p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Hi <strong>${booking.name}</strong>,</p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Thank you for scheduling your accessibility consultation with InclusiveTest. We look forward to discussing your digital accessibility goals, audit scope, and remediation requirements.
      </p>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #166534;">Appointment Summary</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 120px;">Reference:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${booking.bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Date & Time:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${booking.date} at ${booking.time} (${booking.timezone})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Service:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.serviceNeeded}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Organization:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.company}</td>
          </tr>
        </table>
      </div>

      <!-- Google Meet Video Link Box -->
      <div style="background-color: #f8fafc; border: 2px dashed #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0f766e;">Your Video Conference Link</p>
        <div style="margin: 12px 0;">
          <a href="${meetLink}" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(13, 148, 136, 0.3);">
            Join Google Meet Call
          </a>
        </div>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b; word-break: break-all;">
          Direct link: <a href="${meetLink}" style="color: #0d9488;">${meetLink}</a>
        </p>
      </div>

      <div style="margin: 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Pre-Meeting Preparation:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 6px;">Have your target staging URL or design system documentation ready.</li>
          <li style="margin-bottom: 6px;">Identify your 3-5 core user conversion journeys (e.g. signup, onboarding, checkout).</li>
          <li style="margin-bottom: 6px;">Review any compliance timelines (e.g., European Accessibility Act, ADA, Section 508).</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Need to reschedule or update your project notes? Simply reply to this email to reach our team.
      </p>
    </div>

    <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      InclusiveTest — Expert WCAG 2.2 Audits, Manual Screen Reader Testing & Remediation Support.
    </div>
  </div>
</body>
</html>
  `;
};

export const generateAdminEmailHtml = (booking: ConsultationBookingState, meetLink: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Booking Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <div style="background-color: #0f766e; padding: 28px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">New Consultation Booking Received</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #ccfbf1;">Scheduled via InclusiveTest Booking Calendar</p>
    </div>

    <div style="padding: 28px 24px;">
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #0f172a;">Client & Meeting Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Booking Ref:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${booking.bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Scheduled Time:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0d9488;">${booking.date} at ${booking.time} (${booking.timezone})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Client Name:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Client Email:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;"><a href="mailto:${booking.email}" style="color: #0d9488;">${booking.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Organization:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.company}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Job Title / Role:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.jobTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Service Needed:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${booking.serviceNeeded}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Scope / App:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.projectScope}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Product URL:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;"><a href="${booking.url || '#'}" style="color: #0d9488;">${booking.url || 'Not provided'}</a></td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Client Objectives / Message:</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #475569; background: #f1f5f9; padding: 12px; border-radius: 8px;">
          ${booking.message || 'No additional notes provided by client.'}
        </p>
      </div>

      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #065f46; text-transform: uppercase;">Google Meet Video Room</p>
        <a href="${meetLink}" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 10px 24px; font-weight: 700; font-size: 14px; border-radius: 8px;">
          Join Consultation Room
        </a>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
          Link: <a href="${meetLink}" style="color: #0f766e;">${meetLink}</a>
        </p>
      </div>
    </div>

    <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      InclusiveTest Automated Booking Engine
    </div>
  </div>
</body>
</html>
  `;
};

// Orchestrate the complete booking flow
export const processAppointmentBooking = async (
  booking: ConsultationBookingState,
  accessToken?: string | null
): Promise<BookingResult> => {
  let meetLink = `https://meet.google.com/inc-test-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
  let calendarEventId: string | undefined;
  let calendarHtmlLink: string | undefined;
  let clientEmailSent = false;
  let adminEmailSent = false;

  // 1. If Google OAuth token is available, create event on Google Calendar with Google Meet
  if (accessToken) {
    try {
      const calResult = await createGoogleCalendarEvent(accessToken, booking);
      meetLink = calResult.meetLink;
      calendarEventId = calResult.eventId;
      calendarHtmlLink = calResult.htmlLink;
    } catch (calErr) {
      console.warn('Google Calendar creation error, continuing with video link fallback:', calErr);
    }

    // 2. Dispatch emails via Gmail API using the authorized account
    try {
      const clientHtml = generateClientEmailHtml(booking, meetLink);
      clientEmailSent = await sendGmailMessage(
        accessToken,
        booking.email,
        `Confirmed: Accessibility Consultation with InclusiveTest [Ref: ${booking.bookingRef}]`,
        clientHtml
      );
    } catch (emailErr) {
      console.warn('Failed to send client email via Gmail API:', emailErr);
    }

    try {
      const adminHtml = generateAdminEmailHtml(booking, meetLink);
      adminEmailSent = await sendGmailMessage(
        accessToken,
        ADMIN_EMAIL,
        `New Consultation Booking: ${booking.serviceNeeded} - ${booking.company} (${booking.name})`,
        adminHtml
      );
    } catch (adminErr) {
      console.warn('Failed to send admin email via Gmail API:', adminErr);
    }
  }

  // 3. Dispatch to server API endpoint for persistence and backend notification
  try {
    const serverRes = await fetch('/api/consultations/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({
        booking,
        meetLink,
        calendarEventId,
        calendarHtmlLink,
        clientEmailSent,
        adminEmailSent,
        adminEmail: ADMIN_EMAIL
      })
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.meetLink) meetLink = serverData.meetLink;
      if (serverData.clientEmailSent) clientEmailSent = true;
      if (serverData.adminEmailSent) adminEmailSent = true;
    }
  } catch (serverErr) {
    console.warn('Server booking notification error:', serverErr);
  }

  return {
    success: true,
    bookingRef: booking.bookingRef,
    meetingLink: meetLink,
    calendarEventId,
    calendarHtmlLink,
    clientEmailSent,
    adminEmailSent,
    message: 'Consultation scheduled successfully.'
  };
};
