let cart = [];

function addToCart(product, price) {
  cart.push({ product, price });
  alert(product + " تمت إضافته إلى السلة!");
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemsList = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  if (itemsList) {
    itemsList.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      let li = document.createElement("li");
      li.textContent = `${item.product} - ${item.price} TND`;
      itemsList.appendChild(li);
      total += item.price;
    });
    totalEl.textContent = "المجموع: " + total + " TND";
  }
}

window.onload = loadCart;
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});
const products = document.querySelectorAll(".product");

window.addEventListener("scroll", () => {
  products.forEach(product => {
    const rect = product.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      product.classList.add("show");
    }
  });
});