# Shop360 — Free HTML/CSS/JS Ecommerce Store (Google Sheets backend)

A complete, working online store built with plain HTML, CSS and JavaScript —
no paid hosting, no paid database, no frameworks to install. Product data,
orders, and contact messages all live in a Google Sheet.

## What's included

```
index.html          Homepage
shop.html            Product listing with search/filter
product.html         Product detail page
cart.html            Shopping cart
checkout.html        Pakistan-specific checkout (COD / JazzCash / EasyPaisa)
order-success.html   Order confirmation + WhatsApp confirm
track-order.html     Customers look up order status by Order ID
profile.html          Customer accounts: signup/login, profile, order history, wishlist
about.html, contact.html   Contact form saves to Google Sheets + WhatsApp button
assets/               Logo, favicon (SVG + PNG + ICO)
css/style.css         All styling (charcoal + accent design system)
js/api.js             Talks to your Google Sheet
js/cart.js             Cart logic (saved in the browser)
js/main.js             Shared page behavior
js/icons.js             Inline SVG icon set (no emojis, no external requests)
js/auth.js               Customer account signup/login/session + wishlist
apps-script/Code.gs    Paste this into Google Apps Script — it's your backend
```

Right now the site runs on **sample demo products** so you can preview and
customize the design immediately. Follow the steps below to connect your
real Google Sheet — it takes about 10 minutes.

## Step 1 — Create your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet.
2. Rename the file to something like "Shop360 Store Data".
3. Rename the first tab to **Products** and add this header row exactly:

   `ID | Name | Category | Price | DiscountPrice | Stock | Images | Variants | Description | Status`

   Add a few product rows under it. Notes:
   - `Images`: paste one or more image URLs, separated by commas
   - `Variants`: e.g. `S,M,L,XL` — leave blank if not needed
   - `DiscountPrice`: leave as `0` if there's no sale price
   - `Status`: `Active` (shows on site) or `Hidden` (hides it)

4. Add a second tab named **Orders** with this header row:

   `OrderID | Date | Name | Phone | Street | City | Postal | Notes | PaymentMethod | TxnID | Items | Subtotal | Shipping | Total | Status`

   (Leave the rows under it empty — orders will fill in automatically.)

5. Add a third tab named **Messages** with this header row:

   `Date | Name | Phone | Message`

   (Leave the rows under it empty — messages from the Contact page form
   fill in automatically.)

6. Add a fourth tab named **Users** with this header row:

   `Phone | PasswordHash | Salt | Name | Email | Address | City | CreatedAt`

   This powers the "My Account" login/signup on `profile.html`. Passwords
   are never stored as plain text — only a salted SHA-256 hash, computed
   in Apps Script. Leave the rows under it empty — filled automatically
   when someone creates an account.

7. Add a fifth tab named **Carts** with this header row:

   `Phone | CartJson | UpdatedAt`

   This lets a logged-in customer's cart follow them to a new device —
   e.g. add items on their phone, check out later on a laptop.

8. Add a sixth tab named **Wishlist** with this header row:

   `Phone | ProductID | AddedAt`

   Powers the heart icon on products — logged-in customers can save
   items for later and see them under the Wishlist tab on their profile.

## Step 2 — Turn the Sheet into a free API

1. In your Sheet: **Extensions → Apps Script**.
2. Delete the placeholder code, and paste in the entire contents of
   `apps-script/Code.gs` from this project.
3. Click **Save**.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" → choose **Web app**.
6. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**. Google will ask you to authorize — approve it (it's
   your own script talking to your own Sheet).
8. Copy the **Web app URL** shown — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## Step 3 — Connect the website to your Sheet

1. Open `js/api.js`.
2. Find this line near the top:
   ```js
   API_URL: "",
   ```
3. Paste your Web app URL between the quotes:
   ```js
   API_URL: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
4. Save the file. Your site now reads live products from your Sheet, and
   every order placed on checkout — and every message sent from the
   Contact page — gets written to your Sheet automatically.

## Step 4 — Customize your store details

Still in `js/api.js`, update:
```js
STORE_NAME: "Shop360",                 // your store's name
WHATSAPP_NUMBER: "923267013520",       // your WhatsApp number, country code first, no + or spaces
CURRENCY: "Rs",
FREE_SHIPPING_OVER: 3000,              // orders above this get free shipping
SHIPPING_FLAT: 200                     // flat shipping fee below that
```

The WhatsApp number is already set to **0326-7013520** (923267013520). It
powers the floating WhatsApp button, the checkout confirmation link, and
the "Chat on WhatsApp" button on the Contact page.

In `checkout.html`, update the JazzCash/EasyPaisa account numbers to your own
(search for `0300-1234567` and `0333-7654321`).

## Step 5 — Put it online for free

Any of these work great and are free:

**Option A: GitHub Pages**
1. Create a free GitHub account and a new repository.
2. Upload all these files to it.
3. Go to Settings → Pages → set source to the main branch.
4. Your store is live at `https://yourusername.github.io/reponame`.

**Option B: Netlify**
1. Go to [netlify.com](https://netlify.com) → sign up free.
2. Drag and drop this whole folder onto the "Deploy" area.
3. Your store is live instantly with a free `.netlify.app` link.

Either way, you can later connect a real `.pk` or `.com` domain.

## How managing your store works day-to-day

- **Add a product** → add a new row in the Products sheet. It appears on
  the site instantly, no code changes.
- **Change a price / mark something out of stock** → edit that cell in
  the Sheet.
- **Hide a product** → set its Status to `Hidden`.
- **View orders** → open the Orders tab. Update the Status column
  (Pending → Confirmed → Shipped → Delivered) as you process them. Use
  exactly these words (case-sensitive) so they match the Track Order page:
  `Pending`, `Confirmed`, `Shipped`, `Delivered`, or `Cancelled`.
- **View contact messages** → open the Messages tab.
- **Verify a JazzCash/EasyPaisa payment** → the customer's Transaction ID
  is saved in the TxnID column so you can cross-check it in your JazzCash/
  EasyPaisa app before confirming the order.

## Customer accounts (My Account)

`profile.html` gives customers a simple account system, backed by the
**Users**, **Carts**, and **Wishlist** tabs:

- **Sign up / log in** with a phone number + password (minimum 6
  characters). Passwords are hashed (SHA-256 + a random salt per user)
  before being written to the Sheet — the plain password is never stored.
- **Profile** — name, email, address, and city are saved once and reused
  to pre-fill the checkout form on future orders.
- **My Orders** — pulls their past orders straight from the Orders tab by
  matching phone number, no separate order database needed.
- **Wishlist** — a heart icon on product cards and the product page lets
  a logged-in customer save items for later; they show up on the
  Wishlist tab of their profile.
- **Cart sync** — once logged in, their cart is saved to the Carts tab
  and restored automatically if they log in again from a different
  device or browser.

This is intentionally lightweight — good for a small store where the
owner and customers trust each other, not a bank-grade auth system.
There's no email verification, password reset flow, or rate-limiting on
login attempts. If your store grows and needs stronger security, moving
to a proper auth provider (e.g. Firebase Auth) would be the next step.

## Design system

- **Colors**: charcoal neutrals (`--charcoal-950` → `--charcoal-600`) with a
  single accent orange (`--accent: #FF5A36`). All defined as CSS variables
  at the top of `css/style.css` — change them there to re-theme the whole site.
- **Fonts**: Sora (headings) + Inter (body), loaded from Google Fonts.
- **Icons**: every icon on the site is an inline SVG from `js/icons.js` —
  no emojis, no icon-font downloads. Add new ones by adding a `name: path`
  entry to the `ICONS` object, then use `<span data-icon="name"></span>`
  in HTML or `iconSvg("name")` in JS.
- **Logo/favicon**: `assets/logo-mark.svg` is the master logo file;
  `assets/favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`,
  and `apple-touch-icon.png` are pre-generated from it for browser tabs
  and mobile home screens.

## Notes for beginners

- The cart is stored in the visitor's own browser (`localStorage`), so it's
  free and needs no login — but it clears if they clear browser data.
- There's no payment gateway integration (Stripe/PayPal don't work well in
  Pakistan) — payments are Cash on Delivery or manual JazzCash/EasyPaisa
  transfer verified by you, which is how most small Pakistani stores operate.
- Everything is plain HTML/CSS/JS on purpose — you can open any file in a
  text editor and change text, colors, or images directly.
