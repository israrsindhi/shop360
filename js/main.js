/* =========================================================
   MAIN.JS — shared behavior on every page (nav, whatsapp, footer)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // mobile menu toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.main-nav");
  if(toggle && nav){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // whatsapp float button -> opens chat with store number
  const wa = document.querySelector(".whatsapp-float");
  if(wa){
    wa.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about a product on " + CONFIG.STORE_NAME)}`;
  }

  // footer year
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  // brand name injection (so CONFIG.STORE_NAME is the single source of truth)
  document.querySelectorAll(".store-name").forEach(el => el.textContent = CONFIG.STORE_NAME);

  updateAccountLink();
});

/** Reflects login state in the header "Account" link on every page. */
function updateAccountLink(){
  const labels = document.querySelectorAll(".account-link-label");
  if(!labels.length) return;
  const session = (typeof getSession === "function") ? getSession() : null;
  labels.forEach(el => {
    el.textContent = session ? (session.name || "Account").split(" ")[0] : "Account";
  });
}
