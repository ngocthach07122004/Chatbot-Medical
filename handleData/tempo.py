import os
import json
import psycopg2

CHECKPOINT = "pos.txt"
BATCH_SIZE = 5000
JSON_FILE = "bigfile.jsonl"

def save_pos(n):
    with open(CHECKPOINT, "w") as f:
        f.write(str(n))

def load_pos():
    if os.path.exists(CHECKPOINT):
        return int(open(CHECKPOINT).read())
    return 0

def insert_batch(conn, batch):
    with conn.cursor() as cur:
        args_str = ",".join(cur.mogrify("(%s)", (json.dumps(obj),)).decode("utf-8") for obj in batch)
        cur.execute("INSERT INTO raw_data (data) VALUES " + args_str)

def main():
    conn = psycopg2.connect("dbname=mydb user=myuser password=mypass host=localhost port=5432")
    conn.autocommit = False  # để rollback nếu batch lỗi

    start = load_pos()
    count = 0
    batch = []

    with open(JSON_FILE, "r") as f:
        for line in f:
            count += 1
            if count <= start:
                continue  # skip dòng đã xử lý

            obj = json.loads(line.strip())
            batch.append(obj)

            if len(batch) >= BATCH_SIZE:
                insert_batch(conn, batch)
                conn.commit()
                save_pos(count)  # lưu checkpoint tại dòng cuối cùng đã insert
                print(f"Đã insert tới dòng {count}")
                batch.clear()

    # insert nốt batch cuối
    if batch:
        insert_batch(conn, batch)
        conn.commit()
        save_pos(count)
        print(f"Đã insert tới dòng {count} (cuối file)")

    conn.close()

if __name__ == "__main__":
    main()
