// --- Data ---
const menuData = [
    { id: 1, name: "Classic Cheeseburger", category: "burger", price: 8.99, emoji: "🍔", desc: "Juicy beef patty with melted cheese." },
    { id: 2, name: "Double Trouble", category: "burger", price: 12.99, emoji: "🍔", desc: "Two patties, extra bacon, BBQ sauce." },
    { id: 3, name: "Margherita Pizza", category: "pizza", price: 14.99, emoji: "🍕", desc: "Fresh tomatoes, mozzarella, basil." },
    { id: 4, name: "Pepperoni Blast", category: "pizza", price: 16.99, emoji: "🍕", desc: "Loaded with crispy pepperoni." },
    { id: 5, name: "Chocolate Lava", category: "dessert", price: 6.99, emoji: "🍫", desc: "Gooey chocolate center cake." },
    { id: 6, name: "Strawberry Ice Cream", category: "dessert", price: 4.99, emoji: "🍦", desc: "Sweet and creamy delight." },
    { id: 7, name: "Tropical Smoothie", category: "drink", price: 5.99, emoji: "🍹", desc: "Mango, pineapple, and coconut." },
    { id: 8, name: "Iced Caramel Latte", category: "drink", price: 4.49, emoji: "🧋", desc: "Rich espresso with caramel." }
];

let cart = [];

// --- DOM Elements ---
const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotalValue = document.getElementById('cartTotalValue');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// --- Functions ---

// Render Menu
function renderMenu(category = 'all') {
    menuGrid.innerHTML = '';
    const filteredData = category === 'all' ? menuData : menuData.filter(item => item.category === category);
    
    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="menu-emoji">${item.emoji}</div>
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p class="menu-desc">${item.desc}</p>
                <div class="menu-bottom">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">+</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Filtering Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
    });
});

// Cart Logic
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    updateCartUI();
    
    // Tiny animation on cart badge
    cartBadge.style.transform = 'scale(1.5)';
    setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
}

window.addToCart = addToCart; // Make it accessible globally

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

window.updateQty = updateQty; // Make it accessible globally

function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.innerText = totalItems;
    
    // Render Items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotalValue.innerText = '$0.00';
        return;
    }
    
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-emoji">${item.emoji}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotalValue.innerText = '$' + total.toFixed(2);
}

// UI Toggles
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    toggleCart();
    checkoutModal.classList.add('active');
    // Clear cart
    cart = [];
    updateCartUI();
});

closeModalBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

// Initialize
renderMenu();
