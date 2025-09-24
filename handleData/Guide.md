### How to set up env and install library 
```
python3 -m venv venv
source venv/bin/activate
pip install ijson psycopg2-binary
```
### Create table in postgres 
CREATE TABLE table_PPR (
    id TEXT PRIMARY KEY,
    text TEXT
);