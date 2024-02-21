from pymongo import MongoClient
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask, render_template, redirect, send_from_directory
from flask import request, session, jsonify
import json
from rich.console import Console
import re
from pylatexenc.latex2text import LatexNodes2Text
import threading

console = Console()
client = MongoClient('localhost', 27017)
db = client.flask_db
collection = db.activity

# Maybe not needed for admin page.
user_data = db["user_data"]
project_IDs = db["project_IDs"]

mili_a_day = 24 * 3600000


def _find_titles():
    for pid in collection.distinct("project"):
        cursor = collection.find({
            "project": pid,
            "message": {"$ne": "assist"},
            "state": {"$ne": "user_selection"}
        }).sort("timestamp", -1)
        titles[pid] = pid
        for doc in cursor:
            positions = re.finditer(r'[ ]*\\title\{', doc['text'])
            positions = list(positions)
            title = None
            if len(positions) != 0:
                for each in positions:
                    if doc['text'][each.start() - 1] != '%':
                        bracket = 1
                        idx = each.end()
                        while bracket != 0:
                            if doc['text'][idx] == '{':
                                bracket += 1
                            elif doc['text'][idx] == '}':
                                bracket -= 1
                            idx += 1
                        raw_title = doc['text'][each.start():idx] + "\\maketitle"
                        title = LatexNodes2Text().latex_to_text(raw_title).split("\n    ")[0].replace("\n", "")
                        titles[pid] = title
                        break
                if title is None:
                    for each in positions:
                        bracket = 1
                        idx = each.end()
                        while bracket != 0:
                            if doc['text'][idx] == '{':
                                bracket += 1
                            elif doc['text'][idx] == '}':
                                bracket -= 1
                            idx += 1
                        raw_title = doc['text'][each.start():idx] + "\\maketitle"
                        title = LatexNodes2Text().latex_to_text(raw_title).split("\n    ")[0].replace("\n", "")
                        titles[pid] = title
                        break
                break
    timer = threading.Timer(60 * 60, _find_titles)
    timer.start()


titles = {}
_find_titles()
console.log(titles)