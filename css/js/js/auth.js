// Auth State Listener
auth.onAuthStateChanged(user => {
    updateAuthUI();
    if(user) {
        // Sync cart from Firestore if exists
        syncCartFromFirestore(user.uid);
    } else {
        // Keep cart in localStorage for guests
    }
});

// Update UI based on auth state
function updateAuthUI() {
    const user = auth.currentUser;
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userEmail = document.getElementById('user-email');
    
    if(user) {
        if(authButtons) authButtons.style.display = 'none';
        if(userMenu) userMenu.style.display = 'flex';
        if(userEmail) {
            userEmail.textContent = user.email;
            userEmail.href = "dashboard.html";
        }
    } else {
        if(authButtons) authButtons.style.display = 'flex';
        if(userMenu) userMenu.style.display = 'none';
    }
}

// Login function
function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Login successful!");
            window.location.href = "dashboard.html";
            return userCredential;
        })
        .catch(error => {
            alert("Error: " + error.message);
            throw error;
        });
}

// Signup function
function signup(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Save additional user data to Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("Account created successfully!");
            window.location.href = "dashboard.html";
        })
        .catch(error => {
            alert("Error: " + error.message);
            throw error;
        });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    });
}

// Sync cart with Firestore for logged in users
function syncCartFromFirestore(userId) {
    db.collection('carts').doc(userId).get()
        .then(doc => {
            if(doc.exists) {
                const firestoreCart = doc.data().items;
                const localCart = getCart();
                
                // Merge carts (prioritize Firestore for logged in users)
                if(firestoreCart.length > 0) {
                    localStorage.setItem('cart', JSON.stringify(firestoreCart));
                    updateCartCount();
                }
            }
        });
}

// Save cart to Firestore for logged in users
function saveCartToFirestore(userId, cartItems) {
    if(userId) {
        db.collection('carts').doc(userId).set({
            items: cartItems,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(error => console.error("Error saving cart:", error));
    }
}
