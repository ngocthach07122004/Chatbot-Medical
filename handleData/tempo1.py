#!/usr/bin/env python3
import json
import ijson
import psycopg2
from psycopg2.extras import execute_values

BATCH_SIZE = 1000
# PATH_DATA = "test1.jsonl"
PATH_DATA = "/Users/huynhthach/Documents/PMC_Patients_Dataset/ReCDS_benchmark/PPR/corpus.jsonl";
conn = psycopg2.connect(
    dbname="mydb",
    user="postgres",
    password="postgres",
    host="localhost",
    port=5432
)
cur = conn.cursor()

with open(PATH_DATA, "r", encoding="utf-8") as f:
    # bigfile.json chứa 1 array JSON rất lớn
    # objects = ijson.items(f, "item")

    batch = []
    # for obj in objects:
    for line in f:
        obj = json.loads(line)
        batch.append((obj["_id"], obj["text"]))  # chỉ lấy _id và text

        if len(batch) >= BATCH_SIZE:
            execute_values(
                cur,
                "INSERT INTO table_PPR (id, text) VALUES %s ON CONFLICT (id) DO NOTHING",
                batch
            )
            conn.commit()
            batch = []

    # insert phần còn lại
    if batch:
        execute_values(
            cur,
            "INSERT INTO documents (id, text) VALUES %s ON CONFLICT (id) DO NOTHING",
            batch
        )
        conn.commit()

cur.close()
conn.close()
