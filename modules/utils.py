from pymongo import MongoClient
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask, render_template, redirect, send_from_directory
from flask import request, session
from rich.console import Console
import json

console = Console()
client = MongoClient('localhost', 27017)
db = client.flask_db
collection = db.activity

# Maybe not needed for admin page.
user_data = db["user_data"]
project_IDs = db["project_IDs"]

mili_a_day = 24 * 3600000
