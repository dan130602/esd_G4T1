import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import pathlib
from sqlalchemy import text 

# Resolve the root directory (Backend/.env)
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent.parent  # Moves up two levels
ENV_PATH = BASE_DIR / ".env"  # Points to Backend/.env

# Load environment variables from .env
load_dotenv(ENV_PATH)

# Initialize Flask app
app = Flask(__name__)

# Configure database from environment variables
DATABASE_URL = "postgresql://user:password@commerce-db:5432/commerce_db"


app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db = SQLAlchemy() 

