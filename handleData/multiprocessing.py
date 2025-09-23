import os
import json
import psycopg2
from multiprocessing import Pool

JSON_FILE = "bigfile.jsonl"
BATCH_SIZE = 5000
NUM_WORKERS = 4  # số tiến trình song song
DB_DSN = "dbname=mydb user=myuser password=mypass host=localhost port=5432"

def insert_batch(batch):
    conn = psycopg2.connect(DB_DSN)
    conn.autocommit = False
    try:
        with conn.cursor() as cur:
            args_str = ",".join(
                cur.mogrify("(%s)", (json.dumps(obj),)).decode("utf-8")
                for obj in batch
            )
            cur.execute("INSERT INTO raw_data (data) VALUES " + args_str)
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise
    finally:
        conn.close()

def process_chunk(args):
    """Mỗi worker xử lý một chunk file"""
    start_line, end_line = args
    batch = []
    conn = psycopg2.connect(DB_DSN)
    conn.autocommit = False
    count = 0

    with open(JSON_FILE, "r") as f:
        for idx, line in enumerate(f, 1):
            if idx < start_line:
                continue
            if idx > end_line:
                break

            obj = json.loads(line.strip())
            batch.append(obj)

            if len(batch) >= BATCH_SIZE:
                insert_batch(batch)
                batch.clear()
                count += BATCH_SIZE

    if batch:
        insert_batch(batch)
        count += len(batch)

    conn.close()
    print(f"Worker xử lý từ dòng {start_line} đến {end_line}, inserted {count} records.")
    return count

def get_file_chunks(total_lines, num_workers):
    """Chia file thành các khoảng dòng cho mỗi worker"""
    chunk_size = total_lines // num_workers
    chunks = []
    for i in range(num_workers):
        start = i * chunk_size + 1
        end = (i + 1) * chunk_size if i < num_workers - 1 else total_lines
        chunks.append((start, end))
    return chunks

def main():
    # Đếm số dòng trước (có thể hơi tốn thời gian cho file lớn)
    with open(JSON_FILE, "r") as f:
        total_lines = sum(1 for _ in f)

    print(f"Tổng số dòng: {total_lines}")
    chunks = get_file_chunks(total_lines, NUM_WORKERS)

    with Pool(NUM_WORKERS) as pool:
        results = pool.map(process_chunk, chunks)

    print(f"Tổng số records đã insert: {sum(results)}")

if __name__ == "__main__":
    main()
