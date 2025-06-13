// Mobile navigation toggle logic
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const navClose = navOverlay.querySelector('.close-btn');

hamburger && hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  navOverlay.setAttribute('aria-hidden', expanded);
  navOverlay.classList.toggle('active');
});

navClose && navClose.addEventListener('click', () => {
  hamburger.setAttribute('aria-expanded', 'false');
  navOverlay.setAttribute('aria-hidden', 'true');
  navOverlay.classList.remove('active');
  hamburger.focus();
});

// Close mobile nav on link click
navOverlay.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    navOverlay.classList.remove('active');
  });
});

// Animate elements on scroll into view
const animateElements = document.querySelectorAll('[data-animate]');
function onScrollAnimate() {
  const triggerBottom = window.innerHeight * 0.88;
  animateElements.forEach(el => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < triggerBottom) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScrollAnimate);
window.addEventListener('load', onScrollAnimate);

// Order logic
const order = [];

const orderList = document.querySelector('.order-list');
const orderEmpty = document.getElementById('order-empty');
const orderTotalSpan = document.getElementById('order-total');
const paymentMessage = document.getElementById('payment-message');

// Add functionality to menu cards for ordering
document.querySelectorAll('.menu-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const name = card.querySelector('.menu-item-name').textContent;
    const price = parseInt(card.querySelector('.menu-item-price').textContent.replace('₹',''), 10);
    addToOrder(name, price);
  });
});

function addToOrder(name, price) {
  paymentMessage.textContent = '';
  let item = order.find(i => i.name === name);
  if(item) {
    item.qty++;
  } else {
    order.push({name, price, qty:1});
  }
  updateOrderUI();
}

function updateOrderUI() {
  if(order.length === 0) {
    orderEmpty.style.display = 'block';
    orderList.innerHTML = '';
    orderTotalSpan.textContent = '0';
    return;
  }
  orderEmpty.style.display = 'none';
  orderList.innerHTML = '';
  order.forEach(item => {
    const orderItemEl = document.createElement('div');
    orderItemEl.className = 'order-item';
    orderItemEl.setAttribute('role', 'listitem');
    orderItemEl.innerHTML = `
      <span><span class="order-item-qty">${item.qty}x</span>${item.name}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    orderList.appendChild(orderItemEl);
  });
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  orderTotalSpan.textContent = total;
}

// Clear the current order and payment message
function clearOrder() {
  order.length = 0;
  updateOrderUI();
  clearPaymentResult();
}

// Clear payment result message area
function clearPaymentResult() {
  paymentMessage.textContent = '';
  paymentMessage.style.color = '#2e7d32'; // green color
}

// Payment buttons event listeners
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if(order.length === 0) {
      paymentMessage.textContent = 'Please add items to your order before paying.';
      paymentMessage.style.color = '#d32f2f'; // red
      return;
    }
    const method = btn.getAttribute('data-method');
    simulatePayment(method);
  });
});

function simulatePayment(method) {
  paymentMessage.style.color = '#2e7d32';
  paymentMessage.textContent = `Processing payment via ${formatMethodName(method)}...`;

  setTimeout(() => {
    if(Math.random() < 0.9) {
      paymentMessage.textContent = `Payment successful using ${formatMethodName(method)}. Thank you for your order!`;
      clearOrder();
    } else {
      paymentMessage.style.color = '#d32f2f';
      paymentMessage.textContent = `Payment failed with ${formatMethodName(method)}. Please try again or choose another method.`;
    }
  }, 1800);
}

function formatMethodName(method) {
  switch(method) {
    case 'bharatpay': return 'Bharat Pay';
    case 'googlepay': return 'Google Pay';
    case 'indiapost': return 'India Post Payment Bank';
    case 'upi': return 'UPI';
    case 'creditcard': return 'Credit Card';
    default: return 'Payment';
  }
}

updateOrderUI();
