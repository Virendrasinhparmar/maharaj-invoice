# Maharaj Bills

Invoice website for **MAHARAJ FOODS (Maharaj Samosa & Chawana House)**, Science City, Ahmedabad.

It's plain HTML, with no server and no database to install. It runs in any phone or computer browser and can be hosted free on GitHub Pages.

## Features

- **New bill in seconds:** tap-to-add menu items, quantities with decimals (3.5 Dzn, 0.250 Kg), editable price, and discount in ₹ or % (both shown, e.g. "Discount (11.765%) ₹120"), with round-off.
- **Bill numbers:** `MF/2026-27/001`, restarting every April. You can continue your Vyapar series from Settings.
- **Order details:** pickup or delivery time, fry status (Full / Half / Raw-Frozen) and instructions, all highlighted on the bill.
- **Payment:** Paid, Part paid or Unpaid (udhaar), by Cash, UPI or Card. Record later payments, and send WhatsApp reminders from the **Udhaar** tab.
- **Bill output:**
  - A4 PDF download
  - 80mm thermal receipt print
  - Share on WhatsApp (text, or the PDF itself on Android)
  - UPI QR code for the exact amount due
- **Daily report:** sales, Cash / UPI / Card, item-wise sales and udhaar. Download as **Excel** (Summary, Bills and Items sheets) or **PDF**, for any day or date range.
- **Cancel (VOID):** a cancelled bill keeps its number and is never deleted.

## ⚠️ Where your data lives

Bills are saved **inside the browser on each device** (IndexedDB). They are **not** on GitHub and are **not** shared between phones.

- **Back up daily:** go to Settings → **Download backup**, and keep the file in Google Drive or send it to yourself on WhatsApp.
- **New phone, or cleared browser data:** go to Settings → **Restore backup**.
- **Billing on two phones:** give each phone a different prefix (`MF` and `MF2`) so bill numbers never clash. Each phone keeps its own bills.
- **Don't use private / incognito mode.** The browser deletes the data when the tab closes.

## 🪔 Navratri orders (customer pre-order form)

| Page | Who uses it | What it does |
|---|---|---|
| `order.html` | Customers | A step-by-step **Navratri Pass** journey: say your name, fill a thali that fills up with samosas, pick a night from the garba circle, choose pickup or delivery, add contact details, then **hold to light the diya** to order. The customer gets a pass with an order number like **NAV-0001**, fireworks, a calendar reminder and a WhatsApp share button. |
| `leads.html` | You (login) | A festive dashboard: expected income, night-by-night order circles, an orders-by-night chart, and each order as a pass with a status timeline and a one-tap next step (Confirm → Preparing → Ready → Delivered). It also has call and WhatsApp buttons, **kitchen prep** tiles (dozens per item, split by fry type and time slot), Excel download, and **Make bill**, which opens the order as a new bill in `index.html`. |

The website is public, so orders are saved in a **free Google Sheet in your Google account**. The login is checked by Google, so **your password is never written in the website files**.

### One-time setup (about 10 minutes)

1. Open [sheets.new](https://sheets.new) and name the sheet **Maharaj Navratri Orders**.
2. In the sheet, go to **Extensions → Apps Script**. Delete everything there, then paste in the whole of `apps-script/Code.gs` and click 💾 **Save**.
3. Click ⚙️ **Project Settings**, then scroll to **Script Properties → Add script property** and add two properties:
   - `ADMIN_USER` = `Maharaj`
   - `ADMIN_PASS` = *your password*
4. Click **Deploy → New deployment**, then the ⚙️ next to "Select type" → **Web app**. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**. Google will ask you to authorize: choose your account, then **Advanced → Go to project → Allow**.
6. Copy the **Web app URL** (it ends in `/exec`).
7. Open `config.js` and paste the URL: `API_URL: 'https://script.google.com/macros/s/…/exec',`
8. Upload the updated `config.js` to GitHub.

You're done. Share `https://<username>.github.io/<repo>/order.html` with customers. You can use the **Share** button on `leads.html`, or post it on WhatsApp status and Instagram.

- **Change the password:** edit `ADMIN_PASS` in Script Properties. The website doesn't need to change.
- **Change the menu, prices, festival dates or time slots:** edit `config.js`.
- **Update the script:** after editing `Code.gs`, go to **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.

Until `API_URL` is set, `order.html` still works: customers send their order to **7990098044 on WhatsApp**.

## Run it on your computer

```bash
cd ~/maharaj-invoice
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Put it on GitHub Pages

1. Create a new repository on github.com, for example `maharaj-bills`.
2. Upload these files:
   - `index.html`
   - `order.html`
   - `leads.html`
   - `config.js`
   - `festive.js`
   - `apps-script/Code.gs`
   - `logo.png`
   - `icon-192.png`
   - `icon-512.png`
   - `manifest.webmanifest`
   - `.nojekyll`
3. Go to **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
4. After about a minute the site is live at `https://<your-username>.github.io/maharaj-bills/`.
5. On your phone, open that link in Chrome, then choose **⋮ → Add to Home screen**.

The page needs internet the first time, to load the Excel, PDF and QR tools from cdnjs. Bills themselves are stored on the device.
