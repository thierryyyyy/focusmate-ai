import psycopg2

conn = psycopg2.connect("postgresql://postgres:sEZ3djhnN31xAfxC@db.ppfewhxskigulpyrywem.supabase.co:5432/postgres")
cur = conn.cursor()

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
print("Tables:", [r[0] for r in cur.fetchall()])

for t in ["users", "goals", "habits", "activities", "ai_messages"]:
    cur.execute(f"SELECT COUNT(*) FROM {t}")
    print(f"  {t}: {cur.fetchone()[0]} rows")

conn.close()
