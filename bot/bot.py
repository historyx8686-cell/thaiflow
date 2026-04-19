import asyncio
import os
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-vercel-app.vercel.app")

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN environment variable is not set")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def start_handler(message: types.Message):
    user_name = message.from_user.first_name or "друг"

    # Check deeplink
    args = message.text.split(maxsplit=1)
    deeplink_url = WEBAPP_URL

    if len(args) > 1 and args[1].startswith("post_"):
        post_id = args[1][5:]
        deeplink_url = f"{WEBAPP_URL}?post={post_id}"

    builder = InlineKeyboardBuilder()
    builder.button(
        text="🌏 Открыть ThaiFlow",
        web_app=WebAppInfo(url=deeplink_url)
    )

    welcome_text = (
        f"🌴 Привет, {user_name}!\n\n"
        "Добро пожаловать в **ThaiFlow** — агрегатор объявлений по Таиланду!\n\n"
        "📋 Здесь ты найдёшь:\n"
        "🏠 Аренду жилья в Паттайе, Пхукете и Бангкоке\n"
        "🛵 Аренду байков и машин\n"
        "💼 Работу для русскоязычных\n"
        "🎉 Мероприятия и афишу\n"
        "🔧 Услуги и сервис\n"
        "🛒 Барахолку и объявления\n\n"
        "Нажми кнопку ниже чтобы открыть приложение! 👇"
    )

    await message.answer(
        welcome_text,
        reply_markup=builder.as_markup(),
        parse_mode="Markdown"
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
