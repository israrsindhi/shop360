/* =========================================================
   CART.JS — localStorage-based cart, shared by every page
   ========================================================= */

const CART_KEY = "shop360_cart";

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  if(typeof pushCartToServer === "function") pushCartToServer();
}

/** line = {id, name, image, price, variant, qty} */
function addToCart(line){
  const cart = getCart();
  const existing = cart.find(i => i.id === line.id && i.variant === line.variant);
  if(existing){ existing.qty += line.qty; }
  else{ cart.push(line); }
  saveCart(cart);
  showToast(`Added "${line.name}" to cart`);
}

function removeFromCart(id, variant){
  let cart = getCart().filter(i => !(i.id === id && i.variant === variant));
  saveCart(cart);
}

function updateQty(id, variant, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.variant === variant);
  if(item){
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function cartSubtotal(){
  return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
}

function cartCount(){
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function clearCart(){
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

function updateCartCount(){
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = cartCount());
}

/* ---------- toast ---------- */
function showToast(msg){
  let toast = document.querySelector(".toast");
  if(!toast){
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = iconSvg("checkCircle", "icon-md") + `<span>${msg}</span>`;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
