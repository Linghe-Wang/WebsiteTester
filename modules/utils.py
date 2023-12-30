from pymongo import MongoClient
from datetime import datetime
from dateutil.relativedelta import relativedelta
from rich.console import Console

console = Console()
client = MongoClient('localhost', 27017)
db = client.flask_db
collection = db.activity

# Maybe not needed for admin page.
user_data = db["user_data"]
project_IDs = db["project_IDs"]

mili_a_day = 24 * 3600000
