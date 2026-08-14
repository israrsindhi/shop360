/* =========================================================
   API.JS
   Talks to the Google Apps Script Web App (which reads/writes
   your Google Sheet). See /apps-script/Code.gs for the backend.

   HOW TO CONNECT YOUR OWN SHEET:
   1. Open your Google Sheet.
   2. Extensions -> Apps Script -> paste apps-script/Code.gs
   3. Deploy -> New deployment -> Web app -> Execute as: Me,
      Who has access: Anyone.
   4. Copy the deployment URL and paste it below as API_URL.

   Until you do that, the store runs on the sample data below
   so you can preview and customize the design first.
   ========================================================= */

const CONFIG = {
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
  API_URL: "https://script.google.com/macros/s/AKfycbw9qHi38yyrJl97Y6-aWQbq5c6H0l-qM9SsrUUs6xvP8qtp8zn7e1ecyNU9ku0AXXe_/exec",
  STORE_NAME: "Shop360",
  WHATSAPP_NUMBER: "923267013520",  // country code + number, no + or spaces
  CURRENCY: "Rs",
  FREE_SHIPPING_OVER: 4000,
  SHIPPING_FLAT: 160
};

/* ---------------- sample/demo data (used until API_URL is set) --------------- */
const SAMPLE_PRODUCTS = [
  { id:"P001", name:"Printed Wool-Blend Shawl", category:"Shawls", price:2200, discountPrice:1800, stock:14,
    images:["https://images.unsplash.com/photo-1601924357840-3e50ad0eb1b8?w=800"], variants:"Blue,Maroon,Black",
    description:"Soft wool-blend shawl with an all-over printed pattern. Lightweight, breathable, and perfect for gifting or everyday wear.", status:"Active" },
  { id:"P002", name:"Embroidered Cap", category:"Accessories", price:900, discountPrice:0, stock:22,
    images:["https://images.unsplash.com/photo-1622560481939-84a55f4f9cf7?w=800"], variants:"Small,Medium,Large",
    description:"Handmade mirror-work cap, breathable cotton base with detailed thread embroidery.", status:"Active" },
  { id:"P003", name:"Men's Lawn Kurta", category:"Men", price:2600, discountPrice:2100, stock:8,
    images:["https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800"], variants:"M,L,XL,XXL",
    description:"Premium stitched lawn kurta with side pockets, breathable fabric ideal for warm weather.", status:"Active" },
  { id:"P004", name:"Women's Printed Lawn Suit (3pc)", category:"Women", price:3400, discountPrice:2900, stock:0,
    images:["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800"], variants:"S,M,L",
    description:"Unstitched 3-piece printed lawn suit: shirt, dupatta, and trouser. Soft-touch fabric, colorfast print.", status:"Active" },
  { id:"P005", name:"Leather Handmade Chappal", category:"Footwear", price:1800, discountPrice:0, stock:5,
    images:["https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800"], variants:"7,8,9,10,11",
    description:"Genuine leather handmade chappal, comfortable sole, built to last.", status:"Active" },
  { id:"P006", name:"Kids Printed Frock", category:"Kids", price:1500, discountPrice:1250, stock:11,
    images:["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800"], variants:"2-3y,4-5y,6-7y",
    description:"Comfortable cotton frock with playful print detailing, ideal for daily wear and festive days alike.", status:"Active" },
];

/* ---------------- generic request helper ---------------- */
async function apiRequest(action, params = {}, method = "GET", body = null){
  if(!CONFIG.API_URL){
    return null; // signals "use demo data" to callers
  }
  try{
    let url = `${CONFIG.API_URL}?action=${encodeURIComponent(action)}`;
    for(const k in params) url += `&${k}=${encodeURIComponent(params[k])}`;

    const opts = { method };
    if(method === "POST"){
      opts.headers = { "Content-Type": "text/plain;charset=utf-8" }; // avoids CORS preflight on Apps Script
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    return await res.json();
  }catch(err){
    console.error("API error:", err);
    return { error: true, message: err.message };
  }
}

/** Get all active products (from Sheet, or demo data if not configured yet) */
async function fetchProducts(){
  const data = await apiRequest("getProducts");
  if(data && data.products) return data.products.filter(p => (p.status||"Active") !== "Hidden");
  return SAMPLE_PRODUCTS; // fallback for preview / before API is connected
}

/** Get a single product by id */
async function fetchProductById(id){
  const products = await fetchProducts();
  return products.find(p => String(p.id) === String(id));
}

/** Submit a new order. Falls back to storing locally (demo mode) if no API configured. */
async function submitOrder(order){
  if(!CONFIG.API_URL){
    // demo mode: just simulate success and store locally
    const orders = JSON.parse(localStorage.getItem("demoOrders") || "[]");
    order.orderId = "DEMO-" + Date.now().toString().slice(-6);
    orders.push(order);
    localStorage.setItem("demoOrders", JSON.stringify(orders));
    return { success:true, orderId: order.orderId, demo:true };
  }
  const data = await apiRequest("createOrder", {}, "POST", order);
  return data;
}

/** Submit a contact form message. Falls back to storing locally (demo mode) if no API configured. */
async function submitMessage(msg){
  if(!CONFIG.API_URL){
    const messages = JSON.parse(localStorage.getItem("demoMessages") || "[]");
    messages.push({ ...msg, sentAt: new Date().toISOString() });
    localStorage.setItem("demoMessages", JSON.stringify(messages));
    return { success:true, demo:true };
  }
  const data = await apiRequest("createMessage", {}, "POST", msg);
  return data;
}

/** Track an order by Order ID (optionally verified with phone number). */
async function trackOrder(orderId, phone){
  if(!CONFIG.API_URL){
    // demo mode: check localStorage for a matching demo order
    const orders = JSON.parse(localStorage.getItem("demoOrders") || "[]");
    const match = orders.find(o => String(o.orderId).toUpperCase() === String(orderId).trim().toUpperCase());
    if(!match) return { found:false, error:"No order found with that ID. (Demo mode: only orders placed on this device/browser are trackable.)" };
    return {
      found:true, orderId: match.orderId, date: match.createdAt, name: match.fullName,
      city: match.city, items: match.items, paymentMethod: match.paymentMethod,
      total: match.total, status: match.status || "Pending", demo:true
    };
  }
  const data = await apiRequest("trackOrder", { orderId, phone: phone||"" }, "GET");
  return data;
}

/* utility: format a price in PKR */
function fmtPrice(n){
  return `${CONFIG.CURRENCY} ${Number(n).toLocaleString("en-PK")}`;
}
