import logging
import json
from telegram import Update, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Токен бота
BOT_TOKEN = "8237381360:AAG8hJaT5-uFeNyrzSahJH__LJzu1lbkp-0"

# URL вашего Mini App (замените на ваш GitHub Pages URL)
WEB_APP_URL = "https://diyorcheeeek.github.io/Cinnarollsbot/"

# ===== Обработчик команды /start =====
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отправляет приветственное сообщение с кнопкой для открытия Mini App"""
    
    # Создаем кнопку с Web App
    keyboard = [
        [KeyboardButton(
            text="🥐 Открыть меню",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    # Приветственное сообщение
    welcome_text = (
        "🥐 *Добро пожаловать в Cinnarolls!*\n\n"
        "Свежие синнаролы каждый день, выпеченные с любовью в Узбекистане 🇺🇿\n\n"
        "Нажмите кнопку ниже, чтобы открыть меню и сделать заказ!"
    )
    
    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

# ===== Обработчик данных из Web App =====
async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обрабатывает данные, отправленные из Mini App"""
    
    try:
        # Получаем данные
        data = json.loads(update.message.web_app_data.data)
        
        user = data.get('user', {})
        items = data.get('items', [])
        total = data.get('total', 0)
        
        # Формируем сообщение о заказе
        order_message = "🎉 *Новый заказ!*\n\n"
        order_message += f"👤 Клиент: {user.get('first_name', 'Неизвестно')}"
        
        if user.get('username'):
            order_message += f" (@{user['username']})"
        
        order_message += "\n\n📦 *Заказ:*\n"
        
        # Добавляем товары
        for item in items:
            order_message += f"• {item['name']} x{item['quantity']} = {format_price(item['total'])}\n"
        
        order_message += f"\n💰 *Итого:* {format_price(total)}\n\n"
        order_message += "✅ Заказ принят! Мы свяжемся с вами в ближайшее время."
        
        # Отправляем подтверждение клиенту
        await update.message.reply_text(
            order_message,
            parse_mode='Markdown'
        )
        
        # Логируем заказ
        logger.info(f"Новый заказ от {user.get('first_name')} на сумму {total} сум")
        
        # Здесь можно добавить отправку заказа администратору
        # await context.bot.send_message(
        #     chat_id=ADMIN_CHAT_ID,
        #     text=order_message,
        #     parse_mode='Markdown'
        # )
        
    except Exception as e:
        logger.error(f"Ошибка обработки заказа: {e}")
        await update.message.reply_text(
            "❌ Произошла ошибка при обработке заказа. Пожалуйста, попробуйте снова."
        )

# ===== Вспомогательные функции =====
def format_price(price):
    """Форматирует цену"""
    return f"{price:,}".replace(',', ' ') + " сум"

# ===== Главная функция =====
def main():
    """Запуск бота"""
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Регистрируем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Запускаем бота
    logger.info("Бот запущен!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()

