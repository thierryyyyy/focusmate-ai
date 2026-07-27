import psycopg2

urls = [
    "postgresql://postgres.ppfewhxskigulpyrywem:sEZ3djhnN31xAfxC@aws-0-eu-west-3.pooler.supabase.com:6543/postgres",
    "postgresql://postgres.ppfewhxskigulpyrywem:sEZ3djhnN31xAfxC@aws-0-eu-west-3.pooler.supabase.com:5432/postgres",
]

for url in urls:
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        print(f"OK: port {url.split(':')[-1].split('/')[0]}")
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        print("  Tables:", [r[0] for r in cur.fetchall()])
        conn.close()
    except Exception as e:
        err = str(e)[:150]
        print(f"FAIL: port {url.split(':')[-1].split('/')[0]} -> {err}")
