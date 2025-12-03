// Cart array in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Also save to Firestore if user is logged in
    const user = auth.currentUser;
    if(user) {
        saveCartToFirestore(user.uid, cart);
    }
}

// Add to cart
function addToCart(productId, name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if(existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    alert("Added to cart!");
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    location.reload(); // Refresh cart page
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if(item) {
        item.quantity = parseInt(newQuantity);
        if(item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
        }
    }
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count in navbar
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    countElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Render cart items on cart page
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if(!cartContainer) return;
    
    if(cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button onclick="removeFromCart('${item.id}')" class="btn-outline">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update total
    const totalElement = document.getElementById('cart-total');
    if(totalElement) {
        totalElement.textContent = `$${calculateTotal().toFixed(2)}`;
    }
}

// Checkout function
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const user = auth.currentUser;
    if(!user) {
        alert("Please login to checkout");
        window.location.href = "login.html";
        return;
    }
    
    // Save order to Firestore
    db.collection('orders').add({
        userId: user.uid,
        items: cart,
        total: calculateTotal(),
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Order placed successfully!");
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
        window.location.href = "dashboard.html";
    })
    .catch(error => {
        alert("Error placing order: " + error.message);
    });
}
