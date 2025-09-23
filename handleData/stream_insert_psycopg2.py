#!/usr/bin/env python3
"""
Stream large JSON (root array) with ijson and insert into Postgres in batches.
- If your file is NDJSON (1 object per line), see notes below.
"""

import ijson
import json
import time
import psycopg2
from psycopg2.extras import execute_values

# ==== CONFIG ====
PG_CONN = {
    'host': 'localhost',
    'port': 5432,
    'dbname': 'mydb',
    'user': 'myuser',
    'password': 'mypassword'
}
INPUT_FILE = 'bigfile.json'   # path to original JSON (root is array)
BATCH_SIZE = 5000             # thử 5k, tăng/giảm tuỳ kích thước record và memory
COMMIT_EVERY = 1              # commit after each execute_values call (1)
# =================

def stream_json_array(path):
    """Stream objects from a JSON file where top-level is an array: [ {...}, {...} ]"""
    with open(path, 'rb') as f:
        # 'item' iterator yields each object in the top-level array
        for obj in ijson.items(f, 'item'):
            yield obj

def main():
    conn = psycopg2.connect(**PG_CONN)
    cur = conn.cursor()
    total = 0
    batch = []
    t0 = time.time()

    # Optional performance hints (session-level)
    cur.execute("SET synchronous_commit = off;")   # be careful: may lose last transactions on crash
    cur.execute("SET work_mem = '128MB';")        # tune if needed

    for obj in stream_json_array(INPUT_FILE):
        # If you want to transform object -> new_obj, do it here
        # e.g. new_obj = {'id': obj['id'], 'name': obj['name'], ...}
        # For now we store raw object as JSON string and cast to jsonb on insert
        batch.append((json.dumps(obj),))
        if len(batch) >= BATCH_SIZE:
            # insert batch
            execute_values(cur,
                           "INSERT INTO raw_data (data) VALUES %s",
                           batch,
                           template="(%s::jsonb)")
            if COMMIT_EVERY:
                conn.commit()
            total += len(batch)
            elapsed = time.time() - t0
            print(f"Inserted {total} rows — last batch {len(batch)} — {elapsed:.1f}s elapsed")
            batch = []

    # insert remaining
    if batch:
        execute_values(cur,
                       "INSERT INTO raw_data (data) VALUES %s",
                       batch,
                       template="(%s::jsonb)")
        conn.commit()
        total += len(batch)
        print(f"Inserted final batch. Total = {total}")

    # finalize
    cur.close()
    conn.close()
    print("Done.")

if __name__ == '__main__':
    main()
