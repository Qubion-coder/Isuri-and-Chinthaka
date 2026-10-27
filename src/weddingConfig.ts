// Single source of truth for this invitation's details.
export const WEDDING = {
  brideName: 'Isuri',
  groomName: 'Chinthaka',
  brideParents: 'Mr. & Mrs. Gunawardhane',
  groomParents: 'Mr. Jayathilaka (Late) & Mrs. Jayathilaka',
  date: new Date('2027-01-20T08:30:00+05:30'),
  dateLong: 'Wednesday, January 20',
  dateNumeric: '20 . 01 . 2027',
  dateFooter: 'January 20, 2027',
  eventTime: '08:30 AM – 04:30 PM',
  poruwaTime: '09:30 AM',
  venueName: 'Birds Garden Villa',
  venueArea: 'Kaudupalella, Matale',
  mapQuery: 'Birds Garden Villa, Kaudupalella, Matale',
  liveLocationUrl: 'https://maps.app.goo.gl/cRxBShDrMgAj96aWA',
};

// Google Apps Script Web App URL (see code.ts). Set VITE_GOOGLE_APPS_SCRIPT_URL in .env / Vercel.
export const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ?? '';

// Personalized links look like {baseURL}/{encoded display name}, e.g. /Mr.%20Sanjaya
export function getGuestDisplayName(): string {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!slug || slug === 'admin') return '';
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return '';
  }
}

// Posts as application/x-www-form-urlencoded so Apps Script receives fields in e.parameter.
export async function submitToSheet(sheet: 'RSVP' | 'Wishes', fields: Record<string, string>) {
  if (!SCRIPT_URL) throw new Error('VITE_GOOGLE_APPS_SCRIPT_URL is not configured');
  await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ sheet, ...fields }),
  });
}
