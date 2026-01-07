// ===== Telegram Mini App для Cinnarolls =====

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Расширяем приложение на весь экран
tg.expand();

// Включаем закрывающее подтверждение
tg.enableClosingConfirmation();

// Продукты с ценами
const products = {
    classic: { name: 'Classic Cinnaroll', price: 35000 },
    chocolate: { name: 'Chocolate Cinnaroll', price: 40000 },
    nutcaramel: { name: 'Nut-Caramel Cinnaroll', price: 45000 },
    meringue: { name: 'Meringue Roll', price: 50000 }
};

// Корзина покупок
let cart = {};

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем корзину из localStorage
    loadCart();

    // Настраиваем кнопки количества
    setupQuantityButtons();

    // Настраиваем MainButton
    setupMainButton();

    // Применяем тему Telegram
    applyTelegramTheme();

    // Обновляем UI
    updateCartUI();
});

// ===== Загрузка корзины =====
function loadCart() {
    const saved = localStorage.getItem('cinnarolls_cart');
    if (saved) {
        cart = JSON.parse(saved);
        // Обновляем отображение количества
        Object.keys(cart).forEach(productId => {
            const qtyDisplay = document.getElementById(`qty-${productId}`);
            if (qtyDisplay) {
                qtyDisplay.textContent = cart[productId];
            }
        });
    }
}

// ===== Сохранение корзины =====
function saveCart() {
    localStorage.setItem('cinnarolls_cart', JSON.stringify(cart));
}

// ===== Настройка кнопок количества =====
function setupQuantityButtons() {
    // Кнопки "+"
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            addToCart(productId);
            // Haptic feedback
            tg.HapticFeedback.impactOccurred('light');
        });
    });

    // Кнопки "-"
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            removeFromCart(productId);
            // Haptic feedback
            tg.HapticFeedback.impactOccurred('light');
        });
    });
}

// ===== Добавить в корзину =====
function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    cart[productId]++;

    // Обновляем отображение
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    if (qtyDisplay) {
        qtyDisplay.textContent = cart[productId];
    }

    saveCart();
    updateCartUI();
}

// ===== Удалить из корзины =====
function removeFromCart(productId) {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;

        if (cart[productId] === 0) {
            delete cart[productId];
        }

        // Обновляем отображение
        const qtyDisplay = document.getElementById(`qty-${productId}`);
        if (qtyDisplay) {
            qtyDisplay.textContent = cart[productId] || 0;
        }

        saveCart();
        updateCartUI();
    }
}

// ===== Обновление UI корзины =====
function updateCartUI() {
    const cartSummary = document.getElementById('cart-summary');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartTotal = document.getElementById('cart-total');

    // Подсчет товаров и суммы
    let totalItems = 0;
    let totalPrice = 0;

    Object.keys(cart).forEach(productId => {
        const quantity = cart[productId];
        totalItems += quantity;
        totalPrice += products[productId].price * quantity;
    });

    // Показываем/скрываем сводку корзины
    if (totalItems > 0) {
        cartSummary.style.display = 'block';
        cartItemsCount.textContent = `${totalItems} ${getItemsWord(totalItems)}`;
        cartTotal.textContent = formatPrice(totalPrice);

        // Обновляем MainButton
        tg.MainButton.setText(`Заказать (${formatPrice(totalPrice)})`);
        tg.MainButton.show();
    } else {
        cartSummary.style.display = 'none';
        tg.MainButton.hide();
    }
}

// ===== Настройка MainButton =====
function setupMainButton() {
    tg.MainButton.setText('Выберите товары');
    tg.MainButton.color = '#8B6F47';
    tg.MainButton.textColor = '#FFFFFF';

    // Обработчик нажатия
    tg.MainButton.onClick(() => {
        sendOrder();
    });
}

// ===== Отправка заказа =====
function sendOrder() {
    // Haptic feedback
    tg.HapticFeedback.notificationOccurred('success');

    // Формируем данные заказа
    const orderData = {
        user: {
            id: tg.initDataUnsafe.user?.id,
            first_name: tg.initDataUnsafe.user?.first_name,
            last_name: tg.initDataUnsafe.user?.last_name,
            username: tg.initDataUnsafe.user?.username
        },
        items: [],
        total: 0
    };

    // Добавляем товары
    Object.keys(cart).forEach(productId => {
        const quantity = cart[productId];
        const product = products[productId];
        const itemTotal = product.price * quantity;

        orderData.items.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            total: itemTotal
        });

        orderData.total += itemTotal;
    });

    // Отправляем данные в бот
    tg.sendData(JSON.stringify(orderData));

    // Очищаем корзину
    cart = {};
    saveCart();
    updateCartUI();

    // Показываем уведомление об успехе
    tg.showAlert('Заказ отправлен! Мы свяжемся с вами в ближайшее время.');
}

// ===== Применение темы Telegram =====
function applyTelegramTheme() {
    // Применяем цвета темы
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
}

// ===== Вспомогательные функции =====

// Форматирование цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' сум';
}

// Склонение слова "товар"
function getItemsWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'товаров';
    }

    if (lastDigit === 1) {
        return 'товар';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'товара';
    }

    return 'товаров';
}

// ===== Debug (только для разработки) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Telegram WebApp initialized:', tg);
    console.log('User data:', tg.initDataUnsafe.user);
    console.log('Theme params:', tg.themeParams);
}
