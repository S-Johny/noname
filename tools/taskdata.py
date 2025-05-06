#!/usr/bin/env python3

import argparse
import csv
import datetime
import json
import sys

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
      "shown": True,
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

def load_task_details(f, tasks):
  for task in tasks.values():
    task["description"] = find_description(task["name"])

def find_description(name):
  return "xxx"

def main():
  with open(args.table_file) as f:
    tasks = load_task_table(f, int(args.skip))

  with open(args.details_file) as f:
    load_task_details(f, tasks)

  json.dump(tasks, sys.stdout, ensure_ascii=False)

if __name__ == "__main__":
  main()
