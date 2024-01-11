'''
This file is a python_script to convert all the email to firstname in database
'''

from rich.console import Console
import os
from pymongo import MongoClient
import traceback

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

console = Console()
client = MongoClient('localhost', 27017)
db = client.flask_db
collection = db.activity

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SAMPLE_SPREADSHEET_ID = "13gvKW7gmto4vsn-xBvqMqm2Kt8LoI8AQwlN5-x2y9a4"
EMAIL_RANGE = "G3:G17"
FIRST_NAME_RANGE = "B3:B17"
TOKEN_FILE = "token.json"
CREDENTIAL_FILE = "sheet_credentials.json"
name_dict = {}


def fetch_google_sheet():
    creds = None
    global name_dict

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIAL_FILE, SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    try:
        service = build("sheets", "v4", credentials=creds)

        # Call the Sheets API
        sheet = service.spreadsheets()
        result = (
            sheet.values()
            .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=EMAIL_RANGE)
            .execute()
        )
        email = result.get("values", [])

        result = (
            sheet.values()
            .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=FIRST_NAME_RANGE)
            .execute()
        )
        first_name = result.get("values", [])

        if (not email) or (not first_name):
            console.log("No data found.")
        else:
            for i in range(len(email)):
                name_dict[email[i][0]] = first_name[i][0]
        return name_dict

    except:
        traceback.print_exc()


fetch_google_sheet()

for each in name_dict:
    collection.update_many(
       {"username": each},
       {"$set": {"username": name_dict[each] }}
    )

username_mappings = [
    {"old_username": "Zae", "new_username": "Zae Myung"},
    {"old_username": "kooryan", "new_username": "Ryan"},
    {"old_username": "ryankoo", "new_username": "Ryan"},
    {"old_username": "debaratidas", "new_username": "debarati"},
    {"old_username": "debarati ", "new_username": "debarati"},
    {"old_username": "tyagi055", "new_username": "Aahan"},
    {"old_username": "parka438", "new_username": "Ritik Sachin"},
    {"old_username": "amrutha38", "new_username": "Amrutha Shetty"}
]

for mapping in username_mappings:
    collection.update_many(
        {"username": mapping["old_username"]},
        {"$set": {"username": mapping["new_username"]}}
    )