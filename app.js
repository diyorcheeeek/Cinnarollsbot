// ===== CINNAROLLS PREMIUM ENGINE =====

// Initializing Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Database
const products = {
    classic: { name: 'Classic Cinnaroll', price: 35000 },
    chocolate: { name: 'Choco Roll', price: 40000 },
    nutcaramel: { name: 'Nut & Caramel', price: 45000 },
    meringue: { name: 'Meringue Roll', price: 50000 },
    combo: { name: 'Premium Gift Box', price: 150000 }
};

let cart = {};

// ===== Core Functions =====

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateUI();

    // Theme Sync
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#FDFBF7';
});

function addToCart(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;

    // Haptic
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

    saveCart();
    updateUI();
    updateProductCardUI(id);
}

function removeFromCart(id) {
    if (cart[id] > 0) {
        cart[id]--;
        if (cart[id] === 0) delete cart[id];

        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

        saveCart();
        updateUI();
        updateProductCardUI(id);
    }
}

function getQuantity(id) {
    return cart[id] || 0;
}

// ===== UI Updates =====

function updateProductCardUI(id) {
    const actionContainer = document.getElementById(`action-${id}`);
    if (!actionContainer) return;

    const qty = getQuantity(id);

    if (qty > 0) {
        actionContainer.innerHTML = `
            <div class="qty-control">
                <button class="qty-btn" onclick="removeFromCart('${id}')">－</button>
                <span class="qty-val">${qty}</span>
                <button class="qty-btn" onclick="addToCart('${id}')">＋</button>
            </div>
        `;
    } else {
        actionContainer.innerHTML = `
            <button class="add-btn" onclick="addToCart('${id}')">
                <i class="ri-add-line"></i>
            </button>
        `;
    }
}

function updateUI() {
    let total = 0;
    let count = 0;

    // Calculate totals
    for (let id in cart) {
        total += products[id].price * cart[id];
        count += cart[id];

        // Ensure card UI is synced (in case of page reload)
        updateProductCardUI(id);
    }

    // Update Sticky Cart
    const stickyCart = document.getElementById('cart-sticky');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (count > 0) {
        stickyCart.classList.add('visible');

        // Pulse Animation
        stickyCart.classList.add('pulse');
        setTimeout(() => stickyCart.classList.remove('pulse'), 300);

        cartCount.textContent = count;
        cartTotal.textContent = total.toLocaleString('ru-RU') + " so'm";

        // Update MainButton (Telegram Native)
        tg.MainButton.setText(`Buyurtma berish: ${total.toLocaleString('ru-RU')} so'm`);
        tg.MainButton.show();
        tg.MainButton.onClick(checkout);
    } else {
        stickyCart.classList.remove('visible');
        tg.MainButton.hide();
    }
}

function saveCart() {
    localStorage.setItem('cinnarolls_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cinnarolls_cart');
    if (saved) cart = JSON.parse(saved);
}

// ===== Checkout Flow =====

function checkout() {
    if (Object.keys(cart).length === 0) return;

    const orderData = {
        user: tg.initDataUnsafe.user,
        items: [],
        total: 0
    };

    for (let id in cart) {
        orderData.items.push({
            id: id,
            name: products[id].name,
            price: products[id].price,
            quantity: cart[id],
            total: products[id].price * cart[id]
        });
        orderData.total += products[id].price * cart[id];
    }

    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

    // Send to Bot
    tg.sendData(JSON.stringify(orderData));

    // Optional: Show alert if not closing
    // tg.showAlert("Buyurtmangiz qabul qilindi!");
}
