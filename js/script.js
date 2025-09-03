// إدارة السلة في الذاكرة (بدون استخدام localStorage)
let cart = [];

// إضافة منتج إلى السلة
function addToCart(product, price) {
  cart.push({ product, price });
  updateCartDisplay();
  showNotification(`${product} تمت إضافته إلى السلة!`);
}

// إزالة منتج من السلة
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// تحديث عرض السلة في جميع الصفحات
function updateCartDisplay() {
  // تحديث العدد في الهيدر
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  // تحديث محتويات السلة في صفحة السلة
  const cartItems = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  const emptyCart = document.getElementById('empty-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    if (totalEl) totalEl.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cart-item-name">${item.product}</span>
      <div>
        <span class="cart-item-price">${item.price} TND</span>
        <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  if (totalEl) {
    totalEl.textContent = `المجموع: ${total} TND`;
    totalEl.style.display = 'block';
  }
  
  if (checkoutBtn) {
    checkoutBtn.href = `https://wa.me/21612345678?text=${encodeURIComponent(getCartSummary())}`;
    checkoutBtn.style.display = 'block';
  }
}

// إنشاء ملخص الطلب لواتساب
function getCartSummary() {
  let summary = "طلب جديد من متجر El Carthagi:\n\n";
  let total = 0;
  
  cart.forEach(item => {
    summary += `- ${item.product}: ${item.price} TND\n`;
    total += item.price;
  });
  
  summary += `\nالمجموع الكلي: ${total} TND`;
  return summary;
}

// عرض إشعار مؤقت
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // إزالة الإشعار بعد 3 ثوانٍ
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// تفعيل تأثير التمرير على الهيدر
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// تفعيل تأثير الظهور عند التمرير للمنتجات
document.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelectorAll('.product');
  
  if (products.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    products.forEach(product => {
      product.style.opacity = 0;
      product.style.transform = 'translateY(30px)';
      product.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(product);
    });
  }
  
  // تحديث عرض السلة عند تحميل الصفحة
  updateCartDisplay();
});