#!/usr/bin/env python3

import argparse
import csv
import json
import os
import subprocess
import sys

parser = argparse.ArgumentParser(description="Upload user data to Firebase")
parser.add_argument('user_auth_file')
parser.add_argument('user_data_file')
parser.add_argument('--upload', action='store_true')
args = parser.parse_args()

with open(args.user_auth_file) as f:
  auth = json.load(f)
  users_auth = auth["users"]

fieldnames = [
  "name",
  "phone",
  "email",
  "emailAlt",
  "communication",
  "startingPoint",
  "favoriteTransport",
  "favoriteSong",
  "favoriteDish",
  "favoritePlant",
  "favoriteInstitute",
  "quote",
  "favoriteToiletPaper",
  "prizedItem",
  "favoritePlace",
  "org",
  "img",
]

with open(args.user_data_file) as f:
  users = dict()
  reader = csv.DictReader(f, fieldnames=fieldnames, dialect='excel-tab')
  next(reader) # Skip header
  for user_data in reader:
    if not user_data["email"]:
      continue
    uid = None
    for auth in users_auth:
      auth_email = auth["email"]
      data_email = user_data["email"].strip().lower()
      data_email_alt = user_data["emailAlt"].strip().lower()
      if auth_email == data_email or auth_email == data_email_alt:
        uid = auth["localId"]
        break

    if uid is None:
      sys.stderr.write("Cannot find user ID for e-mail " + data_email+ "\n")
    else:
      users[uid] = user_data

def firebase_cmd():
  return os.environ.get('FIREBASE_CMD', "firebase")

def set_common_properties(users_data):
  for user_data in users_data.values():
    user_data["gameTime"] = 4.5 * 3600
    if user_data["org"].lower() == "true":
      user_data["team"] = "Orgové"
    else:
      user_data["team"] = ""
    del user_data["org"]

set_common_properties(users)
if args.upload:
  for user_id, user_data in users.items():
    # TODO: Ensure proper escaping of data_str
    data_str = json.dumps(user_data, ensure_ascii=False)
    subprocess.run(["echo",
      firebase_cmd(),
      "database:set",
      "-d", data_str
    ])
else:
  json.dump(users, sys.stdout, ensure_ascii=False)
  print("")
