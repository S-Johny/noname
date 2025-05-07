#!/usr/bin/env python3

import argparse
import csv
import datetime
import html
import json
import sys

from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(description="Upload user data to Firebase")
parser.add_argument('table_file')
parser.add_argument('details_file')
parser.add_argument('--skip', type=int)
parser.add_argument('--start-date')
args = parser.parse_args()

fieldnames = [
  "info",
  "maxTime",
  "estTimePerPlayer",
  "estTime",
  "estTimeHours",
  "estTimeCumulativeHours",
  "endTimeCumulative",
  "startTime",
  "endTime",
  "maxTimeRepeated",
  "estTimeRepeatedHours",
  "estTimeRequiredHours",
  "name",
  "id",
  "required",
  "maxTimeStr",
  "shown",
]

def load_task_table(f, skip=0):
  tasks = dict()
  reader = csv.DictReader(f, fieldnames=fieldnames, dialect='excel-tab')

  # Skip header lines
  for i in range(skip):
    next(reader)

  for data in reader:
    id = data["id"]
    if not id:
      continue
    tasks[id] = {
      "name": data["name"],
      "reward": data["maxTimeStr"],
      "required": data["required"].lower() == "true",
      "shown": data["shown"].lower() == "true",
      "startAt": time_str_to_epoch(data["startTime"]),
      "endAt": time_str_to_epoch(data["endTime"]),
    }
  return tasks

def time_str_to_epoch(time_str):
  try:
    dt = datetime.datetime.strptime(time_str, "%d.%m.%Y %H:%M:%S")
    return dt.timestamp() * 1000
  except Exception as e:
    sys.stderr.write("Cannot parse datetime '%s'\n" % time_str)
    return None

def print_task_details(f):
  raw = html.unescape(f.read())
  soup = BeautifulSoup(raw, features="lxml")
  print(soup.prettify())

def load_task_details(f):
  raw = html.unescape(f.read())
  soup = BeautifulSoup(raw, features="lxml")
  map = dict()

  blocks = iter(soup.body)
  block = next(blocks)
  while block:
    if block.name == "h3":
      task_name = block.text.strip().lower()
      content = []
      block = next(blocks, None)
      while block and block.name not in ["h1", "h2", "h3"]:
        content.append(block)
        block = next(blocks, None)
      map[task_name] = content
    else:
      block = next(blocks, None)
  return map

def combine_task_data(tasks, details):
  for task in tasks.values():
    det = details.get(task["name"].strip().lower(), None)
    if not det:
      sys.stderr.write("Cannot find details for task '%s'\n" % task["name"])
    task["description"] = description_str(det)

def description_str(elements):
  if not elements:
    return None
  eit = iter(elements)
  # Skip first paragraph
  e = next(eit, None)
  return "".join(element_str(e) for e in eit)

def element_str(element):
  if element.content and "//" in element.content:
    return ""
  del element["class"]
  return str(element)

def main():
  with open(args.table_file) as f:
    tasks = load_task_table(f, int(args.skip))

  with open(args.details_file) as f:
    details = load_task_details(f)

  combine_task_data(tasks, details)
  json.dump(tasks, sys.stdout, ensure_ascii=False)

if __name__ == "__main__":
  main()
