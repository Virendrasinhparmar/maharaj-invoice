/* ═══════════════════════════════════════════════════════════════════
   Maharaj — Navratri pre-orders: settings shared by order.html & leads.html
   Edit this file to change the menu, dates, or the Google Script link.
   (Never put passwords here — this file is public on GitHub.)
   ═══════════════════════════════════════════════════════════════════ */
window.MAHARAJ = {
  // Paste your Google Apps Script "Web app" URL here after setup (see README → Navratri orders).
  // While it is empty, the order form still works by sending the order on WhatsApp.
  API_URL: '',

  businessName: 'MAHARAJ FOODS',
  tagline: 'Maharaj Samosa & Chawana House',
  phone: '7990098044',          // WhatsApp number that receives orders (10 digits)
  address: '8, Empire Skyline, Opp. Fortune Business Hub, Science City Rd, Science City, Ahmedabad',

  // Festival window shown on the order form. Customers can still pick other dates.
  festival: { name: 'Navratri', start: '2026-10-11', end: '2026-10-20' },

  // Pickup / delivery time slots
  slots: ['8:00 – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 – 2:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM', '6:00 – 8:00 PM', '8:00 – 10:00 PM'],

  // Menu: price in rupees; step = how much each + tap adds
  menu: [
    { id: 'dal',      name: 'Navtad Dal Samosa',    unit: 'Dzn', price: 120, step: 1 },
    { id: 'vatana',   name: 'Navtad Vatana Samosa', unit: 'Dzn', price: 120, step: 1 },
    { id: 'bataka',   name: 'Navtad Bataka Samosa', unit: 'Dzn', price: 120, step: 1 },
    { id: 'chinese',  name: 'Chinese Samosa',       unit: 'Dzn', price: 130, step: 1 },
    { id: 'cheese',   name: 'Cheese Corn Samosa',   unit: 'Dzn', price: 150, step: 1 },
    { id: 'pizza',    name: 'Pizza Samosa',         unit: 'Dzn', price: 160, step: 1 },
    { id: 'punjabi',  name: 'Punjabi Samosa',       unit: 'Pcs', price: 25,  step: 2 },
    { id: 'tikki',    name: 'Mexican Tikki',        unit: 'Kg',  price: 600, step: 0.5 },
    { id: 'pattice',  name: 'Coconut Pattice',      unit: 'Kg',  price: 500, step: 0.5 },
  ],
};
