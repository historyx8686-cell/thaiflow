import asyncio
import os
import re
import json
import logging
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

TG_API_ID = os.getenv("TG_API_ID")
TG_API_HASH = os.getenv("TG_API_HASH")
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from telethon import TelegramClient, events
    TELETHON_AVAILABLE = True
except ImportError:
    TELETHON_AVAILABLE = False
    logger.warning("Telethon not available")

try:
    import aiohttp
    AIOHTTP_AVAILABLE = True
except ImportError:
    AIOHTTP_AVAILABLE = False

from sources import SOURCES, CATEGORY_KEYWORDS, STOP_KEYWORDS


def detect_category(text: str) -> str:
    text_lower = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text_lower:
                return category
    return "news"


def extract_price(text: str) -> str | None:
    patterns = [
        r'(\d[\d,\s]*)\s*฿',
        r'฿\s*(\d[\d,\s]*)',
        r'(\d[\d,\s]*)\s*бат',
        r'(\d[\d,\s]*)\s*thb',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            price = re.sub(r'[\s,]', '', match.group(1))
            return price
    return None


def is_stop_post(text: str) -> bool:
    text_lower = text.lower()
    return any(kw.lower() in text_lower for kw in STOP_KEYWORDS)


async def save_post(session, city: str, group: str, message_id: int, text: str, photos: list, posted_at: datetime, tg_link: str):
    if is_stop_post(text):
        return

    category = detect_category(text)
    price = extract_price(text)

    payload = {
        "source_group": group,
        "city": city,
        "category": category,
        "message_id": message_id,
        "text": text,
        "photos": photos,
        "price": price,
        "posted_at": posted_at.isoformat(),
        "tg_link": tg_link,
    }

    try:
        async with session.post(f"{BACKEND_URL}/api/internal/posts", json=payload) as resp:
            if resp.status == 200:
                logger.info(f"Saved post {group}/{message_id}")
            else:
                logger.warning(f"Failed to save post: {resp.status}")
    except Exception as e:
        logger.error(f"Error saving post: {e}")


async def parse_group(client, session, city: str, group: str):
    try:
        entity = await client.get_entity(group)
        cutoff = datetime.now(tz=timezone.utc) - timedelta(days=30)

        async for message in client.iter_messages(entity, limit=100):
            if not message.text:
                continue
            if message.date < cutoff:
                break

            photos = []
            if message.media and hasattr(message.media, 'photo'):
                photos = [f"photo_{message.id}"]

            tg_link = f"https://t.me/{group}/{message.id}"
            await save_post(session, city, group, message.id, message.text, photos, message.date, tg_link)

    except Exception as e:
        logger.error(f"Error parsing {group}: {e}")


async def mark_old_posts_inactive(session):
    try:
        async with session.post(f"{BACKEND_URL}/api/internal/cleanup") as resp:
            logger.info(f"Cleanup result: {resp.status}")
    except Exception as e:
        logger.error(f"Cleanup error: {e}")


async def run_parser():
    if not TELETHON_AVAILABLE or not TG_API_ID or not TG_API_HASH:
        logger.warning("Parser disabled: missing Telethon or API credentials")
        return

    client = TelegramClient('thaiflow_parser', int(TG_API_ID), TG_API_HASH)

    async with client:
        async with aiohttp.ClientSession() as session:
            logger.info("Starting parser...")

            for city, groups in SOURCES.items():
                for group in groups:
                    await parse_group(client, session, city, group)
                    await asyncio.sleep(2)

            await mark_old_posts_inactive(session)
            logger.info("Parser finished")


async def setup_realtime(client, session):
    """Setup realtime monitoring for new messages"""
    for city, groups in SOURCES.items():
        for group in groups:
            @client.on(events.NewMessage(chats=group))
            async def handler(event, _city=city, _group=group):
                if event.message.text:
                    photos = []
                    if event.message.media and hasattr(event.message.media, 'photo'):
                        photos = [f"photo_{event.message.id}"]
                    tg_link = f"https://t.me/{_group}/{event.message.id}"
                    await save_post(session, _city, _group, event.message.id, event.message.text, photos, event.message.date, tg_link)


async def main():
    if not TELETHON_AVAILABLE or not TG_API_ID or not TG_API_HASH:
        logger.warning("Parser disabled: missing credentials. Set TG_API_ID and TG_API_HASH in .env")
        while True:
            await asyncio.sleep(3600)

    client = TelegramClient('thaiflow_parser', int(TG_API_ID), TG_API_HASH)

    async with aiohttp.ClientSession() as session:
        async with client:
            # Setup realtime monitoring
            await setup_realtime(client, session)

            # Run initial parse
            await run_parser()

            # Schedule periodic parsing every 30 minutes
            async def periodic_parse():
                while True:
                    await asyncio.sleep(1800)
                    await run_parser()

            await asyncio.gather(
                client.run_until_disconnected(),
                periodic_parse()
            )


if __name__ == "__main__":
    asyncio.run(main())
