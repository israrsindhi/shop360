/* =========================================================
   AUTH.JS — customer accounts (signup/login/session/profile)
   Session is a lightweight local flag (phone + name) stored in
   localStorage; the real check happens server-side on login.
   ========================================================= */

const SESSION_KEY = "shop360_session";

function getSession(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch(err){ return null; }
}
function setSession(profile){
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
}
function clearSession(){
  localStorage.removeItem(SESSION_KEY);
}
function isLoggedIn(){
  return !!getSession();
}

async function signupUser(payload){
  if(!CONFIG.API_URL){
    // demo mode: store account in localStorage
    const users = JSON.parse(localStorage.getItem("demoUsers") || "{}");
    if(users[payload.phone]) return { success:false, error:"An account with this phone number already exists." };
    if(!payload.password || payload.password.length < 6) return { success:false, error:"Password must be at least 6 characters." };
    users[payload.phone] = payload;
    localStorage.setItem("demoUsers", JSON.stringify(users));
    return { success:true, profile: payload, demo:true };
  }
  return await apiRequest("signup", {}, "POST", payload);
}

async function loginUser(phone, password){
  if(!CONFIG.API_URL){
    const users = JSON.parse(localStorage.getItem("demoUsers") || "{}");
    const u = users[phone];
    if(!u) return { success:false, error:"No account found with that phone number." };
    if(u.password !== password) return { success:false, error:"Incorrect password." };
    return { success:true, profile: u, demo:true };
  }
  return await apiRequest("login", {}, "POST", { phone, password });
}

async function updateProfileRemote(payload){
  if(!CONFIG.API_URL){
    const users = JSON.parse(localStorage.getItem("demoUsers") || "{}");
    if(users[payload.phone]) Object.assign(users[payload.phone], payload);
    localStorage.setItem("demoUsers", JSON.stringify(users));
    return { success:true, demo:true };
  }
  return await apiRequest("updateProfile", {}, "POST", payload);
}

async function changePasswordRemote(payload){
  if(!CONFIG.API_URL){
    const users = JSON.parse(localStorage.getItem("demoUsers") || "{}");
    const u = users[payload.phone];
    if(!u || u.password !== payload.currentPassword) return { success:false, error:"Current password is incorrect." };
    if(!payload.newPassword || payload.newPassword.length < 6) return { success:false, error:"New password must be at least 6 characters." };
    u.password = payload.newPassword;
    localStorage.setItem("demoUsers", JSON.stringify(users));
    return { success:true, demo:true };
  }
  return await apiRequest("changePassword", {}, "POST", payload);
}

async function fetchOrderHistory(phone){
  if(!CONFIG.API_URL){
    const orders = JSON.parse(localStorage.getItem("demoOrders") || "[]");
    return orders.filter(o => String(o.phone||"").endsWith(phone.slice(-10))).reverse();
  }
  const data = await apiRequest("getOrders", { phone }, "GET");
  return (data && data.orders) || [];
}

/* ---- cart sync: only used when a customer is logged in ---- */
async function pushCartToServer(){
  const session = getSession();
  if(!session || !CONFIG.API_URL) return;
  await apiRequest("saveCart", {}, "POST", { phone: session.phone, cartJson: JSON.stringify(getCart()) });
}
async function pullCartFromServer(phone){
  if(!CONFIG.API_URL) return null;
  const data = await apiRequest("getCart", { phone }, "GET");
  return (data && data.cart) || null;
}

/* ---- wishlist ---- */
async function toggleWishlistRemote(productId){
  const session = getSession();
  if(!session) return { success:false, error:"Please log in to save items." };
  if(!CONFIG.API_URL){
    const list = JSON.parse(localStorage.getItem("demoWishlist") || "[]");
    const idx = list.indexOf(productId);
    if(idx > -1){ list.splice(idx,1); localStorage.setItem("demoWishlist", JSON.stringify(list)); return { success:true, added:false, demo:true }; }
    list.push(productId); localStorage.setItem("demoWishlist", JSON.stringify(list));
    return { success:true, added:true, demo:true };
  }
  return await apiRequest("toggleWishlist", {}, "POST", { phone: session.phone, productId });
}
async function fetchWishlist(){
  const session = getSession();
  if(!session) return [];
  if(!CONFIG.API_URL){
    return JSON.parse(localStorage.getItem("demoWishlist") || "[]");
  }
  const data = await apiRequest("getWishlist", { phone: session.phone }, "GET");
  return (data && data.productIds) || [];
}
