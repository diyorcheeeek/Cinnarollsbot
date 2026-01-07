# Cinnarolls Telegram Mini App

Telegram Mini App для заказа свежих синнаролов с интеграцией Web App API.

## 🚀 Быстрый старт

### 1. Разместите Mini App на GitHub Pages

1. Создайте новый репозиторий на GitHub (например, `cinnarolls`)
2. Загрузите файлы:
   - `index.html`
   - `styles.css`
   - `app.js`
   - Все изображения (`.png` файлы)

3. Включите GitHub Pages:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root
   - Save

4. Ваш сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/cinnarolls/`

### 2. Настройте Web App URL в боте

1. Откройте `bot.py`
2. Замените `WEB_APP_URL` на ваш GitHub Pages URL:
   ```python
   WEB_APP_URL = "https://YOUR_USERNAME.github.io/cinnarolls/"
   ```

### 3. Установите зависимости для бота

```bash
pip install python-telegram-bot
```

### 4. Запустите бота

```bash
python bot.py
```

## 📱 Как это работает

1. Пользователь открывает бота и нажимает `/start`
2. Бот отправляет кнопку "🥐 Открыть меню"
3. При нажатии открывается Mini App с меню
4. Пользователь добавляет товары в корзину (+ / -)
5. Нажимает MainButton "Заказать (сумма)"
6. Данные отправляются в бота
7. Бот отправляет подтверждение заказа

## 🎨 Возможности

- ✅ Полная интеграция с Telegram Web App API
- ✅ Адаптация под тему Telegram
- ✅ Haptic feedback при нажатиях
- ✅ Корзина покупок с LocalStorage
- ✅ MainButton с отображением суммы
- ✅ Мобильно-ориентированный дизайн
- ✅ Отправка заказов в бот

## 📂 Структура файлов

```
cinnarolls/
├── index.html                              # Mini App интерфейс
├── styles.css                              # Стили с Telegram theme
├── app.js                                  # Web App API логика
├── bot.py                                  # Telegram бот
├── classic_cinnaroll_1767779816076.png    # Изображения
├── chocolate_cinnaroll_1767779830651.png
├── nutcaramel_cinnaroll_1767779845654.png
└── bakery_interior_1767779862290.png
```

## ⚙️ Настройка

### Изменить цены

Откройте `app.js` и измените объект `products`:

```javascript
const products = {
    classic: { name: 'Classic Cinnaroll', price: 35000 },
    chocolate: { name: 'Chocolate Cinnaroll', price: 40000 },
    nutcaramel: { name: 'Nut-Caramel Cinnaroll', price: 45000 }
};
```

### Добавить администратора для уведомлений

В `bot.py` раскомментируйте и настройте:

```python
ADMIN_CHAT_ID = 123456789  # Ваш Telegram ID

# В функции handle_web_app_data:
await context.bot.send_message(
    chat_id=ADMIN_CHAT_ID,
    text=order_message,
    parse_mode='Markdown'
)
```

### Изменить товары

1. Обновите HTML в `index.html` (добавьте/удалите `.product-item`)
2. Обновите объект `products` в `app.js`
3. Добавьте изображения в репозиторий

## 🐛 Отладка

### Локальное тестирование

Для тестирования локально используйте ngrok:

```bash
# Запустите локальный сервер
python -m http.server 8000

# В другом терминале
ngrok http 8000
```

Используйте ngrok URL в `WEB_APP_URL`.

### Проверка в Telegram

1. Откройте бота в Telegram
2. Нажмите `/start`
3. Откройте Mini App
4. Проверьте консоль браузера (Telegram Desktop: Settings → Advanced → Experimental → Enable webview inspecting)

## 📝 Лицензия

MIT

## 🤝 Поддержка

Если возникли вопросы, свяжитесь через:
- Telegram: @cinnarolls_uz
- Instagram: @cinnarolls_uz
