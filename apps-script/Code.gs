/**
 * Maharaj — Navratri pre-orders backend (Google Apps Script + Google Sheet)
 *
 * Setup (once): see README → "Navratri orders".
 *   Project Settings → Script Properties:
 *     ADMIN_USER = Maharaj
 *     ADMIN_PASS = <your password>
 *   Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone
 *
 * The website talks to this script with POST requests (JSON body):
 *   { action: 'order',  order: {...} }                 — public, adds a row
 *   { action: 'list',   user, pass }                   — returns all orders
 *   { action: 'update', user, pass, ref, status, note }— changes status / adds an admin note
 */

const SHEET_NAME = 'Orders';
const HEADERS = [
  'Ref', 'Created', 'Status', 'Name', 'Mobile', 'WhatsApp', 'Type', 'Address', 'Date', 'Time slot',
  'Items', 'Estimated total (₹)', 'Fry', 'Occasion', 'Notes', 'Admin note', 'Updated', 'Items JSON',
];
const STATUSES = ['NEW', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

function doPost(e) {
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (req.action === 'order') return json(addOrder(req.order || {}));
    if (req.action === 'list') { requireAdmin(req); return json({ ok: true, orders: listOrders() }); }
    if (req.action === 'update') { requireAdmin(req); return json(updateOrder(req)); }
    if (req.action === 'login') { requireAdmin(req); return json({ ok: true }); }
    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'Maharaj Navratri orders' });
}

// ───────── helpers ─────────
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#E8491D').setFontColor('#ffffff');
  }
  return sh;
}

function requireAdmin(req) {
  const p = PropertiesService.getScriptProperties();
  const user = String(p.getProperty('ADMIN_USER') || '');
  const pass = String(p.getProperty('ADMIN_PASS') || '');
  if (!user || !pass) throw new Error('Admin login is not set up (Script Properties ADMIN_USER / ADMIN_PASS)');
  // Slow down password guessing: max 10 wrong tries per 10 minutes
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('fails') || 0);
  if (fails >= 10) throw new Error('Too many wrong attempts. Try again in 10 minutes.');
  const ok = String(req.user || '').trim().toLowerCase() === user.trim().toLowerCase() && String(req.pass || '') === pass;
  if (!ok) {
    cache.put('fails', String(fails + 1), 600);
    throw new Error('Wrong username or password');
  }
}

const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
// Stop spreadsheet formula injection (cells starting with = + - @)
const safeCell = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);

function addOrder(o) {
  if (o.website) return { ok: true, ref: 'NAV-0000' }; // honeypot field filled by bots
  const name = clean(o.name, 80);
  const mobile = clean(o.mobile, 20).replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  if (!name) throw new Error('Please enter your name');
  if (!/^[6-9]\d{9}$/.test(mobile)) throw new Error('Please enter a valid 10-digit mobile number');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(o.date || ''))) throw new Error('Please choose a date');
  const items = (Array.isArray(o.items) ? o.items : [])
    .map((it) => ({ name: clean(it.name, 60), unit: clean(it.unit, 10), qty: Math.round(Number(it.qty) * 1000) / 1000, price: Number(it.price) || 0 }))
    .filter((it) => it.name && it.qty > 0 && it.qty < 100000);
  if (!items.length) throw new Error('Please add at least one item');
  const total = items.reduce((a, it) => a + Math.round(it.qty * it.price * 100), 0) / 100;

  // Same phone can't flood the sheet: max 5 orders per 10 minutes
  const cache = CacheService.getScriptCache();
  const k = 'o:' + mobile;
  const n = Number(cache.get(k) || 0);
  if (n >= 5) throw new Error('Too many orders from this number. Please call us.');
  cache.put(k, String(n + 1), 600);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet();
    const props = PropertiesService.getScriptProperties();
    const seq = Number(props.getProperty('SEQ') || 0) + 1;
    props.setProperty('SEQ', String(seq));
    const ref = 'NAV-' + String(seq).padStart(4, '0');
    const now = new Date();
    sh.appendRow([
      ref, now, 'NEW', safeCell(name), "'" + mobile, "'" + clean(o.whatsapp, 20).replace(/\D/g, ''),
      o.type === 'DELIVERY' ? 'DELIVERY' : 'PICKUP', safeCell(clean(o.address, 300)), o.date, safeCell(clean(o.slot, 40)),
      items.map((it) => `${it.name} × ${it.qty} ${it.unit}`).join(', '), total,
      safeCell(clean(o.fry, 20)), safeCell(clean(o.occasion, 40)), safeCell(clean(o.notes, 600)), '', now, JSON.stringify(items),
    ]);
    return { ok: true, ref, total };
  } finally {
    lock.releaseLock();
  }
}

function listOrders() {
  const sh = sheet();
  const rows = sh.getDataRange().getValues();
  rows.shift();
  const tz = Session.getScriptTimeZone();
  const fmt = (d) => (d instanceof Date ? Utilities.formatDate(d, tz, "yyyy-MM-dd'T'HH:mm:ss") : String(d || ''));
  const day = (d) => (d instanceof Date ? Utilities.formatDate(d, tz, 'yyyy-MM-dd') : String(d || ''));
  return rows.filter((r) => r[0]).map((r) => {
    let items = [];
    try { items = JSON.parse(r[17] || '[]'); } catch (e) {}
    return {
      ref: r[0], created: fmt(r[1]), status: r[2], name: String(r[3]).replace(/^'/, ''), mobile: String(r[4]).replace(/^'/, ''),
      whatsapp: String(r[5]).replace(/^'/, ''), type: r[6], address: String(r[7]).replace(/^'/, ''), date: day(r[8]), slot: String(r[9]).replace(/^'/, ''),
      itemsText: r[10], total: Number(r[11]) || 0, fry: String(r[12]).replace(/^'/, ''), occasion: String(r[13]).replace(/^'/, ''),
      notes: String(r[14]).replace(/^'/, ''), adminNote: String(r[15]).replace(/^'/, ''), updated: fmt(r[16]), items,
    };
  });
}

function updateOrder(req) {
  const status = String(req.status || '').toUpperCase();
  if (status && STATUSES.indexOf(status) < 0) throw new Error('Unknown status');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet();
    const refs = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
    const idx = refs.findIndex((r) => r[0] === req.ref);
    if (idx < 0) throw new Error('Order not found');
    const row = idx + 2;
    if (status) sh.getRange(row, 3).setValue(status);
    if (req.note !== undefined) sh.getRange(row, 16).setValue(safeCell(clean(req.note, 300)));
    sh.getRange(row, 17).setValue(new Date());
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
