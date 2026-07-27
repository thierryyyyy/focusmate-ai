import psycopg2
import sys

url = "postgresql://postgres:sEZ3djhnN31xAfxC@db.ppfewhxskigulpyrywem.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    cur.execute("SELECT 1")
    print("OK: connected")
    cur.execute("SELECT datname FROM pg_database WHERE datistemplate = false")
    print("DBs:", [r[0] for r in cur.fetchall()])
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
