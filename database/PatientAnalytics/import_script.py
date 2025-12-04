import json
import os
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv
from tqdm import tqdm

# 1. Load environment variables
# Path: PatientAnalytics -> database -> Chatbot-Medical (Root) -> .env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

# 2. Database Configuration
try:
    DB_CONFIG = {
        "host": os.getenv("DB_HOST_DOCTOR"),
        "port": os.getenv("POSTGRES_PORT_DOCTOR"), # 5601
        "database": os.getenv("POSTGRES_DB_DOCTOR"), # DoctorDb
        "user": os.getenv("POSTGRES_USER_DOCTOR"),
        "password": os.getenv("POSTGRES_PASSWORD_DOCTOR")
    }

    FILE_CORPUS = os.getenv("PATH_CORPUS_JSONL")
    FILE_PATIENTS = os.getenv("PATH_PATIENTS_JSON")

    # Print config for verification (masking password)
    print(f"DB Configuration: Host={DB_CONFIG['host']}, Port={DB_CONFIG['port']}, DB={DB_CONFIG['database']}")
    print(f"Corpus File Path: {FILE_CORPUS}")

except Exception as e:
    print("Error loading .env file. Please ensure the file exists and variables are set correctly.")
    exit(1)

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def init_database():
    print("\nInitializing database schema...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # Read init.sql from the same directory
        with open("init.sql", "r", encoding="utf-8") as f:
            cur.execute(f.read())
        conn.commit()
        cur.close()
        conn.close()
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")

def import_corpus():
    if not os.path.exists(FILE_CORPUS):
        print(f"File not found: {FILE_CORPUS}. Skipping corpus import.")
        return

    # --- DEMO LIMIT ---
    # 17GB ~ 11.7 million rows => 2GB ~ 1.4 million rows
    LIMIT_LINES = 1_400_000
    # ------------------

    print(f"\nStarting Corpus import (Demo Limit: {LIMIT_LINES} rows)...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        batch_size = 3000
        batch_data = []
        count = 0

        with open(FILE_CORPUS, 'r', encoding='utf-8') as f:
            for line in tqdm(f, desc="Importing Articles", unit=" rows", total=LIMIT_LINES):

                if count >= LIMIT_LINES:
                    break

                try:
                    doc = json.loads(line)
                    batch_data.append((
                        doc.get('_id'),
                        doc.get('title', ''),
                        doc.get('text', '')
                    ))

                    if len(batch_data) >= batch_size:
                        query = """
                            INSERT INTO medical_article (id, title, content)
                            VALUES (%s, %s, %s)
                            ON CONFLICT (id) DO NOTHING
                        """
                        execute_batch(cur, query, batch_data)
                        conn.commit()
                        batch_data = []
                    count += 1
                except Exception:
                    continue

            # Insert remaining rows
            if batch_data:
                query = "INSERT INTO medical_article (id, title, content) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING"
                execute_batch(cur, query, batch_data)
                conn.commit()

        cur.close()
        conn.close()
        print(f"Corpus data imported: {count} articles.")
    except Exception as e:
        print(f"Error importing corpus: {e}")

def import_patients():
    if not os.path.exists(FILE_PATIENTS):
        print(f"File not found: {FILE_PATIENTS}. Skipping patients import.")
        return

    print("\nStarting Patients import...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        with open(FILE_PATIENTS, 'r', encoding='utf-8') as f:
            data = json.load(f)

        cases_data = []
        relevance_data = []

        for item in tqdm(data, desc="Processing Patients"):
            # Extract age
            age = None
            if item.get('age') and len(item['age']) > 0:
                try:
                    age = float(item['age'][0][0])
                except:
                    age = None

            case_id = item.get('human_patient_uid')

            cases_data.append((
                case_id,
                age,
                item.get('geneder'),
                item.get('title'),
                item.get('patient')
            ))

            rel_articles = item.get('relevant_articles', {})
            for art_id, score in rel_articles.items():
                relevance_data.append((case_id, art_id, score))

        # Insert Cases
        q_case = """
            INSERT INTO research_case (id, age, gender, disease_name, description)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cur, q_case, cases_data)

        # Insert Relevance
        q_rel = "INSERT INTO research_relevance (case_id, article_id, relevance_score) VALUES (%s, %s, %s)"
        try:
            execute_batch(cur, q_rel, relevance_data)
        except Exception as e:
            print(f"Warning during relevance insert (ignoring): {e}")
            conn.rollback()

        conn.commit()
        cur.close()
        conn.close()
        print("Patients data imported successfully.")
    except Exception as e:
        print(f"Error importing patients: {e}")

def update_search_vector():
    print("\nUpdating Search Vector (Safe Batch Mode)...")
    try:
        conn = get_db_connection()
        conn.autocommit = True # Enable autocommit to prevent huge transaction logs
        cur = conn.cursor()

        batch_size = 5000
        total_updated = 0

        while True:
            # Only update rows that have NULL search_vector in small batches
            query = f"""
                UPDATE medical_article
                SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))
                WHERE id IN (
                    SELECT id FROM medical_article
                    WHERE search_vector IS NULL
                    LIMIT {batch_size}
                );
            """
            cur.execute(query)
            rows_affected = cur.rowcount
            total_updated += rows_affected

            print(f" -> Processed {rows_affected} rows... (Total: {total_updated})")

            if rows_affected == 0:
                break

        cur.close()
        conn.close()
        print("Search Vector update completed.")

    except Exception as e:
        print(f"Error updating vector: {e}")

def finalize_database():
    print("\nFinalizing database (Cleaning data & Adding Foreign Keys)...")
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Clean up orphan data
        print("   -> Cleaning orphan records in 'research_relevance'...")
        cur.execute("DELETE FROM research_relevance WHERE case_id NOT IN (SELECT id FROM research_case);")
        cur.execute("DELETE FROM research_relevance WHERE article_id NOT IN (SELECT id FROM medical_article);")
        conn.commit()

        # 2. Create Foreign Keys
        print("   -> Creating Foreign Key constraints...")

        try:
            cur.execute("""
                ALTER TABLE research_relevance
                ADD CONSTRAINT fk_case
                FOREIGN KEY (case_id) REFERENCES research_case(id);
            """)
            conn.commit()
            print("      + Added constraint: fk_case")
        except psycopg2.errors.DuplicateObject:
            conn.rollback()
            print("      - Constraint fk_case already exists.")

        try:
            cur.execute("""
                ALTER TABLE research_relevance
                ADD CONSTRAINT fk_article
                FOREIGN KEY (article_id) REFERENCES medical_article(id);
            """)
            conn.commit()
            print("      + Added constraint: fk_article")
        except psycopg2.errors.DuplicateObject:
            conn.rollback()
            print("      - Constraint fk_article already exists.")

        cur.close()
        conn.close()
        print("Database structure finalized!")

    except Exception as e:
        print(f"Error finalizing database: {e}")

if __name__ == "__main__":
    init_database()
    import_corpus()
    import_patients()
    update_search_vector()
    finalize_database()
    print("\n--- ALL TASKS COMPLETED ---")