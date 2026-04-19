from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    source_group = Column(String, index=True)
    city = Column(String, index=True)
    category = Column(String, index=True)
    message_id = Column(Integer)
    text = Column(Text)
    photos = Column(JSON, default=[])
    price = Column(String, nullable=True)
    rooms = Column(String, nullable=True)
    posted_at = Column(DateTime, default=datetime.utcnow)
    tg_link = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    views = Column(Integer, default=0)

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    city = Column(String, index=True)
    categories = Column(JSON, default=[])
    photos = Column(JSON, default=[])
    tg_link = Column(String, nullable=True)
    likes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    is_new = Column(Boolean, default=True)

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    tg_user_id = Column(String, index=True)
    post_id = Column(Integer)

class Banner(Base):
    __tablename__ = "banners"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    description = Column(Text)
    tg_link = Column(String)
    category = Column(String, index=True)
    city = Column(String, index=True, nullable=True)
