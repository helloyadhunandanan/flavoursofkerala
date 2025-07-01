// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const navClose = navOverlay.querySelector('.close-btn');

hamburger && hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  navOverlay.classList.toggle('active');
});

navClose && navClose.addEventListener('click', () => {
  hamburger.setAttribute('aria-expanded', 'false');
  navOverlay.classList.remove('active');
});

// Order Logic
const order = [];
const orderList = document.querySelector('.order-list');
const orderTotalSpan = document.getElementById('order-total');
const paymentMessage = document.getElementById('payment-message');

// Add to cart button click
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');
    const name = card.querySelector('.menu-item-name').textContent;
    const price = parseInt(card.querySelector('.menu-item-price').textContent.replace('₹',''), 10);
    addToOrder(name, price);
  });
});

function addToOrder(name, price) {
  let item = order.find(i => i.name === name);
  if(item) {
    item.qty++;
  } else {
    order.push({name, price, qty:1});
  }
  updateOrderUI();
}

function updateOrderUI() {
  orderList.innerHTML = '';
  if(order.length === 0) {
    orderList.innerHTML = '<p>Your order is empty.</p>';
    orderTotalSpan.textContent = '0';
    return;
  }
  let total = 0;
  order.forEach(item => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `<span>${item.qty}x ${item.name}</span><span>₹${item.qty * item.price}</span>`;
    orderList.appendChild(div);
    total += item.qty * item.price;
  });
  orderTotalSpan.textContent = total;
}

// Payment simulation
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if(order.length === 0) {
      paymentMessage.style.color = 'red';
      paymentMessage.textContent = 'Please add items to your order before paying.';
      return;
    }
    const method = btn.getAttribute('data-method');
    simulatePayment(method);
  });
});

function simulatePayment(method) {
  paymentMessage.style.color = 'green';
  paymentMessage.textContent = `Processing payment via ${formatMethodName(method)}...`;

  setTimeout(() => {
    if(Math.random() < 0.9) {
      paymentMessage.textContent = `Payment successful with ${formatMethodName(method)}. Generating receipt...`;
      showReceipt(method);
      clearOrder();
    } else {
      paymentMessage.style.color = 'red';
      paymentMessage.textContent = `Payment failed with ${formatMethodName(method)}. Please try again.`;
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

function showReceipt(method) {
  let receipt = '---- Kerala Restaurant Invoice ----\n\n';
  order.forEach(item => {
    receipt += `${item.qty} x ${item.name} - ₹${item.qty * item.price}\n`;
  });
  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);
  receipt += `\nTotal Paid: ₹${total}\n`;
  receipt += `Payment Method: ${formatMethodName(method)}\n`;
  receipt += `\nThank you for ordering with us!`;

  alert(receipt);
}

function clearOrder() {
  order.length = 0;
  updateOrderUI();
}

