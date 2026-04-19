# 🌴 ThaiFlow — Агрегатор объявлений Таиланда

Telegram Mini App для поиска объявлений об аренде, работе, услугах и мероприятиях в Таиланде (Паттайя, Пхукет, Бангкок).

## Структура проекта

```
thaiflow/
├── bot/          — Telegram-бот (aiogram 3)
├── backend/      — FastAPI REST API + SQLite
├── parser/       — Парсер Telegram-каналов (Telethon)
├── frontend/     — React + Vite Mini App
└── docker-compose.yml
```

## Быстрый старт

### 1. Клонировать и настроить окружение

```bash
git clone <repo>
cd thaiflow
cp .env.example .env
# Заполните .env своими данными
```

### 2. Заполнить .env

```
BOT_TOKEN=        # токен от @BotFather
TG_API_ID=        # от my.telegram.org
TG_API_HASH=      # от my.telegram.org
WEBAPP_URL=       # URL задеплоенного фронтенда (Vercel)
DATABASE_URL=sqlite+aiosqlite:///./thaiflow.db
```

### 3. Запустить через Docker Compose

```bash
docker-compose up -d
```

Бэкенд будет доступен на `http://localhost:8000`.

## Деплой фронтенда на Vercel

```bash
cd frontend
npm install
npm run build
# Загрузить папку dist/ на Vercel или использовать vercel CLI
```

Установите переменную окружения в Vercel:
```
VITE_API_URL=https://your-backend-url.com/api
```

## Разработка

### Бэкенд

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

### Бот

```bash
cd bot
pip install -r requirements.txt
python bot.py
```

## API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/posts` | Список объявлений (фильтры: city, category, search, page) |
| GET | `/api/posts/{id}` | Одно объявление |
| GET | `/api/cities` | Список городов |
| GET | `/api/categories` | Список категорий |
| GET | `/api/showcase` | Витрина бизнесов |
| GET | `/api/banners` | Рекламные баннеры |
| POST | `/api/favorites` | Добавить в избранное |
| GET | `/api/favorites` | Список избранного |

## Категории

🏠 Аренда · 🛵 Аренда байков · 💰 Продажа байков · 🛒 Барахолка · 🎉 Афиша · 🚗 Аренда машин · 👷 Работа · 🔧 Услуги · 🏃 Спорт · 🏥 Здоровье · 📰 Новости · 🎫 Виза · 💱 Обмен · 🔍 Потеряно/Найдено

## Города

🏖️ Паттайя · 🌴 Пхукет · 🏙️ Бангкок

ThaiFlow Mini App
