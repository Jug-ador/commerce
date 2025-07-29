const api = 'https://commerce-backend-ukft.onrender.com'; 

// Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(signupForm);
    const res = await fetch(`${api}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password')
      })
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert('Signed up!');
    window.location.href = 'profile.html';
  });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(loginForm);
    const res = await fetch(`${api}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password')
      })
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert('Logged in!');
    window.location.href = 'profile.html';
  });
}

// Load Profile
if (window.location.pathname.includes('profile.html')) {
  fetch(`${api}/api/user/profile`, {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  })
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById('profile-info');
      div.innerHTML = `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><img src="${data.avatarUrl}" width="100" />`;
    });
}

// Avatar Upload
const avatarForm = document.getElementById('avatar-form');
if (avatarForm) {
  avatarForm.addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData(avatarForm);
    const res = await fetch(`${api}/api/user/profile/avatar`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: form
    });
    const data = await res.json();
    alert('Avatar updated!');
    window.location.reload();
  });
}

// Load Products
const productList = document.getElementById('product-list');
if (productList) {
  fetch(`${api}/api/user/products`)
    .then(res => res.json())
    .then(products => {
      productList.innerHTML = products.map(
        p => `<div><h3>${p.name}</h3><p>${p.description}</p><img src="${p.imageUrl}" width="200" /><br><button onclick="addToCart('${p._id}')">Add to Cart</button></div>`
      ).join('');
    });
}

function addToCart(productId) {
  fetch(`${api}/api/user/cart`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity: 1 })
  })
    .then(res => res.json())
    .then(() => alert('Added to cart!'));
}

// Load Cart
const cartItems = document.getElementById('cart-items');
if (cartItems) {
  fetch(`${api}/api/user/cart`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(res => res.json())
    .then(cart => {
      cartItems.innerHTML = cart.map(item =>
        `<li>Product ID: ${item.productId}, Quantity: ${item.quantity}</li>`
      ).join('');
    });
}
