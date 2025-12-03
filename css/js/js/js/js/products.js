// Sample products data
const products = [
    {
        id: '1',
        name: 'Luxury Velvet Sofa',
        price: 1299.99,
        category: 'Living Room',
        description: 'Handcrafted velvet sofa with premium hardwood frame',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        featured: true
    },
    {
        id: '2',
        name: 'Oak Dining Table',
        price: 899.99,
        category: 'Dining',
        description: 'Solid oak table with extendable leaf',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        featured: true
    },
    {
        id: '3',
        name: 'King Bed Frame',
        price: 1499.99,
        category: 'Bedroom',
        description: 'Upholstered bed frame with storage',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        featured: true
    },
    {
        id: '4',
        name: 'Executive Desk',
        price: 749.99,
        category: 'Office',
        description: 'Modern executive desk with cable management',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        featured: false
    }
];

// Load featured products on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if(!container) return;
    
    const featured = products.filter(p => p.featured);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-img" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" 
                        class="btn-primary">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Load all products on products page
function loadAllProducts() {
    const container = document.getElementById('all-products');
    if(!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" 
                        class="btn-primary">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter products by category
function filterProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    const container = document.getElementById('all-products');
    if(container) {
        container.innerHTML = filtered.map(product => `
            <div class="product-card">
                <div class="product-img" style="background-image: url('${product.image}')"></div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p>${product.description}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" 
                            class="btn-primary">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}
