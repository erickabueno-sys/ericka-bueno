// Put realistic photos in /images using these file names (jpg).
// If a photo is missing, an emoji is shown instead.
const MENU = [
  {id:1,name:"Fresh Fruit Smoothies",img:"images/smoothie.jpg",emoji:"🥤",price:65,desc:"Blended seasonal fruits, ice cold and refreshing."},
  {id:2,name:"Classic Chicken Ramen",img:"images/ramen.jpg",emoji:"🍜",price:120,desc:"Rich broth, tender chicken, soft egg and noodles."},
  {id:3,name:"Crispy Fried Shrimp",img:"images/shrimp.jpg",emoji:"🍤",price:150,desc:"Golden battered shrimp served with spicy dip."},
  {id:4,name:"Crispy Combo Platter",img:"images/combo.jpg",emoji:"🍗",price:180,desc:"Fried chicken and crispy fries combo."},
  {id:5,name:"Ultimate Bacon Cheeseburger",img:"images/burger.jpg",emoji:"🍔",price:95,desc:"Juicy beef patty, bacon, melted cheese and fresh veggies."}
];
const DELIVERY = 25;
let cart = [];
const $ = s => document.querySelector(s);
const peso = n => "₱" + n;

function picHTML(m){
  return `<img src="${m.img}" alt="${m.name}" onerror="this.replaceWith(document.createTextNode('${m.emoji}'))">`;
}

// ---- Menu ----
const track = $("#track");
function renderMenu(){
  track.innerHTML = MENU.map(m => `
    <div class="item" data-name="${m.name.toLowerCase()}">
      <div class="pic">${picHTML(m)}</div>
      <div>${m.name}</div>
      <button class="btn" data-id="${m.id}">View more</button>
    </div>`).join("");
}
renderMenu();
track.addEventListener("click", e => {
  const id = e.target.dataset.id; if(id) openModal(+id);
});
// Enlarge the item nearest the center, like the mockup
function focusCenter(){
  const r=track.getBoundingClientRect(), mid=r.left+r.width/2;
  document.querySelectorAll(".item").forEach(i=>{
    const b=i.getBoundingClientRect(), d=Math.abs(b.left+b.width/2-mid);
    i.style.transform=`scale(${d<60?1.45:1})`;
    i.style.margin=d<60?"0 22px":"0";
  });
}
track.addEventListener("scroll",focusCenter);
window.addEventListener("load",()=>{track.scrollLeft=(track.scrollWidth-track.clientWidth)/2;focusCenter();});
$("#prev").onclick = () => track.scrollBy({left:-130,behavior:"smooth"});
$("#next").onclick = () => track.scrollBy({left: 130,behavior:"smooth"});

// ---- Search ----
$("#search").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll(".item").forEach(i => i.classList.toggle("hide", !i.dataset.name.includes(q)));
});

// ---- Modal ----
let current = null;
function openModal(id){
  current = MENU.find(m => m.id === id);
  $("#mImg").innerHTML = picHTML(current);
  $("#mName").textContent = current.name;
  $("#mDesc").textContent = current.desc;
  $("#mPrice").textContent = peso(current.price);
  $("#modal").classList.add("open");
}
const closeModal = () => $("#modal").classList.remove("open");
$("#closeModal").onclick = closeModal;
$("#modal").onclick = e => { if(e.target.id === "modal") closeModal(); };
$("#addCart").onclick = () => { cart.push(current); updateCart(); closeModal(); };
$("#cartBtn").onclick = () => $("#contact").scrollIntoView();

// ---- Cart + Receipt ----
function updateCart(){
  $("#cartCount").textContent = cart.length;
  renderReceipt();
}
function renderReceipt(){
  // Sample order from the mockup until the user adds something
  const items = cart.length ? cart : [MENU[4], MENU[1], MENU[0]];
  const sub = items.reduce((s,i) => s + i.price, 0);
  $("#receiptItems").innerHTML = items.map(i => `<li>${i.name}<span>${peso(i.price)}</span></li>`).join("");
  $("#sub").textContent = peso(sub);
  $("#fee").textContent = peso(DELIVERY);
  $("#total").textContent = peso(sub + DELIVERY);
}
renderReceipt();

// ---- Hero / Sign in ----
$("#getStarted").onclick = () => $("#signin").scrollIntoView();
$("#signinForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = $("#signMsg");
  if(!$("#email").value.trim() || !$("#password").value){
    msg.style.color = "#c0392b"; msg.textContent = "Please enter your email/username and password."; return;
  }
  msg.style.color = "#1e8449"; msg.textContent = "Welcome back, " + $("#email").value.trim() + "!";
  setTimeout(() => $("#menu").scrollIntoView(), 700);
});

// ---- Contact ----
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = $("#contactMsg");
  const ok = ["address","phone","name","message"].every(id => $("#"+id).value.trim());
  msg.style.color = ok ? "#1e8449" : "#c0392b";
  msg.textContent = ok ? "Thanks! We'll get back to you soon." : "Please fill in all fields.";
  if(ok) e.target.reset();
});
