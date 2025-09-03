```javascript
// إدارة السلة في الذاكرة (بدون استخدام localStorage)
let cart = [];

// إضافة منتج إلى السلة
function addToCart(name, price) {
  cart.push({ name, price, quantity: 1 });
  updateCartDisplay();
  showNotification(`${name} تمت إضافته إلى السلة!`);
}

// إزالة منتج من السلة
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
  showNotification("تمت إزالة المنتج من السلة");
}

// تحديث كمية المنتج في السلة
function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  // إذا كانت الكمية 0 أو أقل، قم بإزالة المنتج
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCartDisplay();
  }
}

// تحديث عرض السلة في جميع الصفحات
function updateCartDisplay() {
  // تحديث العدد في الهيدر
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length > 0 ? cart.reduce((sum, item) => sum + item.quantity, 0) : '0';
  }

  // تحديث محتويات السلة في صفحة السلة
  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');
  const emptyCart = document.getElementById('empty-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '';
      if (emptyCart) emptyCart.style.display = 'flex';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      if (subtotalEl) subtotalEl.textContent = '0 TND';
      if (totalEl) totalEl.textContent = '0 TND';
      return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${getProductImage(item.name)}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} TND</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });

    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;
    
    if (subtotalEl) subtotalEl.textContent = `${subtotal} TND`;
    if (shippingEl) shippingEl.textContent = `${shipping} TND`;
    if (totalEl) totalEl.textContent = `${total} TND`;
    
    if (checkoutBtn) {
      checkoutBtn.href = `https://wa.me/21612345678?text=${encodeURIComponent(getCartSummary())}`;
      checkoutBtn.style.display = 'block';
    }
  }
}

// الحصول على صورة المنتج بناءً على اسمه
function getProductImage(name) {
  const products = {
    "قميص Carthagi": "https://placehold.co/300x300/e67e22/ffffff?text=قميص",
    "قبعة Carthagi": "https://placehold.co/300x300/3498db/ffffff?text=قبعة",
    "شنطة Carthagi": "https://placehold.co/300x300/2ecc71/ffffff?text=شنطة",
    "ساعة Carthagi": "https://placehold.co/300x300/9b59b6/ffffff?text=ساعة",
    "حذاء Carthagi": "https://placehold.co/300x300/e74c3c/ffffff?text=حذاء",
    "نظارة Carthagi": "https://placehold.co/300x300/1abc9c/ffffff?text=نظارة"
  };
  
  return products[name] || "https://placehold.co/300x300/95a5a6/ffffff?text=منتج";
}

// إنشاء ملخص الطلب لواتساب
function getCartSummary() {
  let summary = "طلب جديد من متجر El Carthagi:\n\n";
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    summary += `- ${item.name} x${item.quantity}: ${itemTotal} TND\n`;
  });
  
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;
  
  summary += `\nالمجموع الفرعي: ${subtotal} TND`;
  summary += `\nرسوم التوصيل: ${shipping} TND`;
  summary += `\nالمجموع الكلي: ${total} TND`;
  
  return summary;
}

// عرض إشعار مؤقت
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-update-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // إزالة الإشعار بعد 3 ثوانٍ
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// تفعيل تأثير التمرير على الهيدر
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header-container');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// تفعيل تأثير الظهور عند التمرير للمنتجات
document.addEventListener('DOMContentLoaded', () => {
  // تفعيل تأثير الظهور للمنتجات
  const products = document.querySelectorAll('.product');
  if (products.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    products.forEach(product => {
      product.style.opacity = 0;
      product.style.transform = 'translateY(30px)';
      product.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(product);
    });
  }
  
  // تفعيل نافذة العرض السريع
  const quickViewButtons = document.querySelectorAll('.quick-view');
  const modal = document.querySelector('.quick-view-modal');
  const closeModal = document.querySelector('.close-modal');
  
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const product = this.closest('.product');
      const name = product.querySelector('h3').textContent;
      const price = product.querySelector('.price').textContent;
      const image = product.querySelector('img').src;
      
      // ملء محتوى النافذة
      modal.querySelector('.modal-product-image img').src = image;
      modal.querySelector('.modal-product-info h2').textContent = name;
      modal.querySelector('.modal-price').textContent = price;
      
      // إعداد زر السلة
      const addToCartBtn = modal.querySelector('.add-to-cart-btn');
      addToCartBtn.dataset.name = name;
      addToCartBtn.dataset.price = price.replace('TND', '').trim();
      
      // عرض النافذة
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
    });
  });
  
  // إغلاق النافذة عند النقر على الزر أو خارج النافذة
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // تفعيل تبديل عرض الشبكة/القائمة
  const viewGrid = document.querySelector('.view-grid');
  const viewList = document.querySelector('.view-list');
  const productsContainer = document.querySelector('.products');
  
  if (viewGrid && viewList && productsContainer) {
    viewGrid.addEventListener('click', () => {
      productsContainer.classList.remove('list-view');
      viewGrid.classList.add('active');
      viewList.classList.remove('active');
    });
    
    viewList.addEventListener('click', () => {
      productsContainer.classList.add('list-view');
      viewList.classList.add('active');
      viewGrid.classList.remove('active');
    });
  }
  
  // تفعيل تصفية المنتجات
  const categoryFilter = document.querySelector('.category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      // هنا يمكنك إضافة منطق تصفية المنتجات
      showNotification(`تم تصفية المنتجات حسب: ${this.options[this.selectedIndex].text}`);
    });
  }
  
  // تفعيل ترتيب المنتجات
  const sortFilter = document.querySelector('.sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      // هنا يمكنك إضافة منطق ترتيب المنتجات
      showNotification(`تم ترتيب المنتجات حسب: ${this.options[this.selectedIndex].text}`);
    });
  }
  
  // تفعيل أزرار.pagination
  const pageButtons = document.querySelectorAll('.page-btn');
  pageButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (!this.classList.contains('active')) {
        pageButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showNotification(`عرض الصفحة ${this.textContent.replace('→', '').trim()}`);
      }
    });
  });
  
  // تفعيل زر تطبيق كود الخصم
  const applyBtn = document.querySelector('.btn-apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      const promoInput = document.querySelector('.promo-code input');
      if (promoInput && promoInput.value.trim() !== '') {
        showNotification(`تم تطبيق كود الخصم: ${promoInput.value}`);
        // هنا يمكنك إضافة منطق تطبيق الخصم
      } else {
        showNotification('يرجى إدخال كود خصم صحيح');
      }
    });
  }
  
  // تفعيل أزرار السلة في نافذة العرض السريع
  const modalAddToCartBtn = document.querySelector('.modal-actions .add-to-cart-btn');
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', function() {
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      addToCart(name, price);
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    });
  }
  
  // تفعيل أزرار السلة في صفحة المنتجات
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const name = this.dataset.name || this.closest('.product').querySelector('h3').textContent;
      const price = parseFloat(this.dataset.price || this.closest('.product').querySelector('.price').textContent.replace('TND', '').trim());
      addToCart(name, price);
    });
  });
  
  // تحديث عرض السلة عند تحميل الصفحة
  updateCartDisplay();
});
```