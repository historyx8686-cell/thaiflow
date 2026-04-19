from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from contextlib import asynccontextmanager
from typing import Optional, List
from datetime import datetime, timedelta, timezone
import json

from database import init_db, get_db
from models import Post, Business, Favorite, Banner

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Seed demo data if DB is empty
    from sqlalchemy.ext.asyncio import AsyncSession
    from database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        count = await db.execute(select(func.count(Post.id)))
        if count.scalar() == 0:
            await seed_demo_data(db)
    yield

app = FastAPI(title="ThaiFlow API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def seed_demo_data(db: AsyncSession):
    """Seed database with demo posts"""
    demo_posts = [
        Post(
            source_group="pattaya_nedvizhimost",
            city="pattaya",
            category="rent",
            message_id=1001,
            text="🏠 Сдаётся студия в центре Паттайи\n\n📍 Центральная Паттайя, ул. Второй\n🛏 Студия, 35 кв.м\n💰 12,000 ฿/месяц\n\nВ квартире: кондиционер, холодильник, Wi-Fi, горячая вода\nРядом: ТЦ Terminal 21, пляж 5 минут\n\n📞 Писать в личку @pattaya_rent",
            photos=[],
            price="12000",
            rooms="студия",
            posted_at=datetime.now(timezone.utc) - timedelta(hours=2),
            tg_link="https://t.me/pattaya_nedvizhimost/1001",
            is_active=True,
            views=145
        ),
        Post(
            source_group="pattaya_rent_buy",
            city="pattaya",
            category="rent",
            message_id=1002,
            text="🏡 Аренда дома в Джомтьен!\n\n3 спальни, 2 ванные, своя парковка\n💰 25,000 ฿/месяц\n📍 Джомтьен, тихий район\n\nДом двухэтажный, есть сад и бассейн в кондо\nВсе документы в порядке, длительная аренда\n\nЗвоните: +66 88 123 4567",
            photos=[],
            price="25000",
            rooms="3 спальни",
            posted_at=datetime.now(timezone.utc) - timedelta(hours=5),
            tg_link="https://t.me/pattaya_rent_buy/1002",
            is_active=True,
            views=89
        ),
        Post(
            source_group="pattaya_job",
            city="pattaya",
            category="job",
            message_id=2001,
            text="💼 Требуется русскоязычный менеджер\n\nКомпания: туристическое агентство\n💰 Зарплата: 35,000-45,000 ฿\n🕐 График: 5/2, 10:00-19:00\n\nТребования:\n- Опыт в туризме от 1 года\n- Разговорный тайский или английский\n- Коммуникабельность\n\nПисать: @thai_hr",
            photos=[],
            price=None,
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(hours=8),
            tg_link="https://t.me/pattaya_job/2001",
            is_active=True,
            views=212
        ),
        Post(
            source_group="pattaya_services",
            city="pattaya",
            category="services",
            message_id=3001,
            text="🔧 Ремонт квартир в Паттайе\n\nВыполняем любые виды ремонтных работ:\n✅ Плиточные работы\n✅ Электрика\n✅ Сантехника\n✅ Установка кондиционеров\n✅ Покраска стен\n\nОпыт 10 лет, быстро и качественно\nФото работ в профиле\n\n📞 @repair_pattaya",
            photos=[],
            price=None,
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(hours=12),
            tg_link="https://t.me/pattaya_services/3001",
            is_active=True,
            views=67
        ),
        Post(
            source_group="pattayarent",
            city="pattaya",
            category="bike_rent",
            message_id=4001,
            text="🛵 Аренда скутеров в Паттайе\n\nHonda PCX 150 - 300 ฿/день\nHonda Click 125 - 250 ฿/день\nYamaha NMAX - 350 ฿/день\n\nВсе байки в отличном состоянии\n🔑 Залог: 1000 ฿\n📍 Паттайя Нуа\n\nПишите: @bike_pattaya",
            photos=[],
            price="300",
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(hours=15),
            tg_link="https://t.me/pattayarent/4001",
            is_active=True,
            views=178
        ),
        Post(
            source_group="pattaya_events",
            city="pattaya",
            category="events",
            message_id=5001,
            text="🎉 Русская вечеринка в Паттайе!\n\n📅 Дата: ближайшая суббота\n⏰ Начало: 21:00\n📍 Ресторан «Волга», Walking Street\n\n🎵 Live music: русские хиты 80-90х\n🍹 Специальное меню коктейлей\n💃 Дискотека до рассвета\n\n🎫 Вход: 500 ฿ (включает первый напиток)\n\nРезервация: @pattaya_party",
            photos=[],
            price=None,
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(hours=20),
            tg_link="https://t.me/pattaya_events/5001",
            is_active=True,
            views=543
        ),
        Post(
            source_group="phuket_rent",
            city="phuket",
            category="rent",
            message_id=6001,
            text="🌴 Аренда виллы на Пхукете\n\n3 спальни, частный бассейн\n🌊 До пляжа Камала: 5 минут\n💰 85,000 ฿/месяц\n\nВилла с садом, беседкой, барбекю\nKitchen full equipped\nFree parking for 2 cars\n\nLong-term rental preferred\n📱 @phuket_villas",
            photos=[],
            price="85000",
            rooms="3 спальни",
            posted_at=datetime.now(timezone.utc) - timedelta(days=1, hours=3),
            tg_link="https://t.me/phuket_rent/6001",
            is_active=True,
            views=234
        ),
        Post(
            source_group="bangkok_rent",
            city="bangkok",
            category="rent",
            message_id=7001,
            text="🏙️ Аренда апартаментов в Бангкоке\n\nРайон: Sukhumvit Soi 11\n2 спальни, 65 кв.м\n💰 35,000 ฿/месяц\n\nВ кондо: бассейн, спортзал, охрана 24/7\nRooftop с видом на город\nBTS Nana - 3 минуты пешком\n\n@bangkok_agent",
            photos=[],
            price="35000",
            rooms="2 спальни",
            posted_at=datetime.now(timezone.utc) - timedelta(days=1, hours=8),
            tg_link="https://t.me/bangkok_rent/7001",
            is_active=True,
            views=156
        ),
        Post(
            source_group="pattaya_forsale",
            city="pattaya",
            category="flea_market",
            message_id=8001,
            text="🛒 Продаю мебель — переезд!\n\n✅ Диван 2-местный (IKEA) — 3,500 ฿\n✅ Обеденный стол + 4 стула — 2,000 ฿\n✅ Шкаф-купе белый — 4,000 ฿\n✅ Холодильник Samsung — 6,000 ฿\n✅ Микроволновка — 800 ฿\n\nВсё в хорошем состоянии, самовывоз\n📍 Центральная Паттайя\n\n@moving_sale_pattaya",
            photos=[],
            price=None,
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(days=2, hours=2),
            tg_link="https://t.me/pattaya_forsale/8001",
            is_active=True,
            views=89
        ),
        Post(
            source_group="pattaya_health",
            city="pattaya",
            category="health",
            message_id=9001,
            text="🦷 Стоматология в Паттайе — цены ниже чем в России!\n\nLemon Dental Clinic\n📍 Паттайя Клэнг, рядом с BigC\n\n💰 Прайс:\n• Консультация — БЕСПЛАТНО\n• Чистка зубов — 800 ฿\n• Пломба — от 500 ฿\n• Отбеливание — 2,500 ฿\n• Имплант — от 30,000 ฿\n\nРусскоязычный персонал ✅\n\n@lemon_dental",
            photos=[],
            price=None,
            rooms=None,
            posted_at=datetime.now(timezone.utc) - timedelta(days=2, hours=15),
            tg_link="https://t.me/pattaya_health/9001",
            is_active=True,
            views=421
        ),
    ]

    demo_businesses = [
        Business(
            name="Pattaya Rent Pro",
            description="Профессиональная аренда недвижимости в Паттайе. Квартиры, дома, виллы",
            city="pattaya",
            categories=["rent", "real_estate"],
            photos=[],
            tg_link="https://t.me/pattaya_rent_pro",
            likes=234,
            views=1567,
            is_new=True
        ),
        Business(
            name="Thai Bike Rental",
            description="Аренда мотоциклов и скутеров. Большой выбор, доступные цены",
            city="pattaya",
            categories=["bike_rent"],
            photos=[],
            tg_link="https://t.me/thai_bike_rental",
            likes=156,
            views=892,
            is_new=False
        ),
        Business(
            name="Phuket Villas",
            description="Элитная аренда вилл на Пхукете с бассейном",
            city="phuket",
            categories=["rent"],
            photos=[],
            tg_link="https://t.me/phuket_villas",
            likes=412,
            views=2341,
            is_new=True
        ),
        Business(
            name="Bangkok Living",
            description="Аренда квартир в Бангкоке рядом со станциями BTS",
            city="bangkok",
            categories=["rent"],
            photos=[],
            tg_link="https://t.me/bangkok_living",
            likes=178,
            views=1203,
            is_new=False
        ),
    ]

    demo_banners = [
        Banner(
            username="pattaya_rent_pro",
            description="🏠 Лучшие квартиры в Паттайе от 8,000 ฿/мес",
            tg_link="https://t.me/pattaya_rent_pro",
            category="rent",
            city="pattaya"
        ),
        Banner(
            username="thai_bike_rental",
            description="🛵 Аренда байков с доставкой по всей Паттайе",
            tg_link="https://t.me/thai_bike_rental",
            category="bike_rent",
            city="pattaya"
        ),
        Banner(
            username="pattaya_jobs",
            description="💼 Работа в Таиланде для русскоязычных",
            tg_link="https://t.me/pattaya_jobs",
            category="job",
            city=None
        ),
        Banner(
            username="thaiflow_ads",
            description="📢 Разместите рекламу в ThaiFlow — охват 10,000+ человек",
            tg_link="https://t.me/thaiflow_ads",
            category="all",
            city=None
        ),
    ]

    for post in demo_posts:
        db.add(post)
    for biz in demo_businesses:
        db.add(biz)
    for banner in demo_banners:
        db.add(banner)

    await db.commit()

@app.get("/api/posts")
async def get_posts(
    city: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(Post).where(Post.is_active == True)

    if city:
        query = query.where(Post.city == city)
    if category and category != "all":
        query = query.where(Post.category == category)
    if search:
        query = query.where(Post.text.ilike(f"%{search}%"))

    query = query.order_by(Post.posted_at.desc())

    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    posts = result.scalars().all()

    return [
        {
            "id": p.id,
            "source_group": p.source_group,
            "city": p.city,
            "category": p.category,
            "message_id": p.message_id,
            "text": p.text,
            "photos": p.photos or [],
            "price": p.price,
            "rooms": p.rooms,
            "posted_at": p.posted_at.isoformat() if p.posted_at else None,
            "tg_link": p.tg_link,
            "views": p.views
        }
        for p in posts
    ]

@app.get("/api/posts/{post_id}")
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {
        "id": post.id,
        "source_group": post.source_group,
        "city": post.city,
        "category": post.category,
        "message_id": post.message_id,
        "text": post.text,
        "photos": post.photos or [],
        "price": post.price,
        "rooms": post.rooms,
        "posted_at": post.posted_at.isoformat() if post.posted_at else None,
        "tg_link": post.tg_link,
        "views": post.views
    }

@app.get("/api/cities")
async def get_cities():
    return [
        {"id": "pattaya", "name": "Паттайя", "emoji": "🏖️"},
        {"id": "phuket", "name": "Пхукет", "emoji": "🌴"},
        {"id": "bangkok", "name": "Бангкок", "emoji": "🏙️"},
    ]

@app.get("/api/categories")
async def get_categories():
    return [
        {"id": "all", "name": "Все", "emoji": "📋"},
        {"id": "rent", "name": "Аренда", "emoji": "🏠"},
        {"id": "bike_rent", "name": "Аренда байков", "emoji": "🛵"},
        {"id": "bike_sale", "name": "Продажа байков", "emoji": "💰"},
        {"id": "flea_market", "name": "Барахолка", "emoji": "🛒"},
        {"id": "events", "name": "Афиша", "emoji": "🎉"},
        {"id": "car_rent", "name": "Аренда машин", "emoji": "🚗"},
        {"id": "job", "name": "Работа", "emoji": "👷"},
        {"id": "services", "name": "Услуги", "emoji": "🔧"},
        {"id": "sport", "name": "Спорт", "emoji": "🏃"},
        {"id": "health", "name": "Здоровье", "emoji": "🏥"},
        {"id": "news", "name": "Новости", "emoji": "📰"},
        {"id": "visa", "name": "Виза", "emoji": "🎫"},
        {"id": "exchange", "name": "Обмен", "emoji": "💱"},
        {"id": "lost_found", "name": "Потеряно/Найдено", "emoji": "🔍"},
    ]

@app.get("/api/showcase")
async def get_showcase(
    city: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Business)
    if city:
        query = query.where(Business.city == city)
    if search:
        query = query.where(
            or_(Business.name.ilike(f"%{search}%"), Business.description.ilike(f"%{search}%"))
        )
    result = await db.execute(query)
    businesses = result.scalars().all()
    return [
        {
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "city": b.city,
            "categories": b.categories or [],
            "photos": b.photos or [],
            "tg_link": b.tg_link,
            "likes": b.likes,
            "views": b.views,
            "is_new": b.is_new
        }
        for b in businesses
    ]

@app.post("/api/favorites")
async def add_favorite(
    tg_user_id: str,
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(Favorite).where(
            and_(Favorite.tg_user_id == tg_user_id, Favorite.post_id == post_id)
        )
    )
    if existing.scalar_one_or_none():
        return {"status": "already_exists"}

    fav = Favorite(tg_user_id=tg_user_id, post_id=post_id)
    db.add(fav)
    await db.commit()
    return {"status": "added"}

@app.get("/api/favorites")
async def get_favorites(tg_user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Favorite).where(Favorite.tg_user_id == tg_user_id)
    )
    favs = result.scalars().all()
    return [{"post_id": f.post_id} for f in favs]

@app.get("/api/banners")
async def get_banners(
    category: Optional[str] = None,
    city: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Banner)
    if category and category != "all":
        query = query.where(or_(Banner.category == category, Banner.category == "all"))
    if city:
        query = query.where(or_(Banner.city == city, Banner.city == None))
    result = await db.execute(query)
    banners = result.scalars().all()
    return [
        {
            "id": b.id,
            "username": b.username,
            "description": b.description,
            "tg_link": b.tg_link,
            "category": b.category
        }
        for b in banners
    ]
