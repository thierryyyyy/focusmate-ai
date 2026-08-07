"""Init/verify the database schema using Alembic migrations.

Credentials are ONLY read from environment variables (DATABASE_URL).
Never hardcode credentials here.
"""

import os
import subprocess
import sys

import psycopg2


def get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        print("ERROR: DATABASE_URL is not set.", file=sys.stderr)
        sys.exit(1)
    return url


def verify_connection(database_url: str) -> None:
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        print("OK: database connection established.")
    except Exception as exc:
        print(f"ERROR: could not connect to database: {exc}", file=sys.stderr)
        sys.exit(1)


def run_migrations() -> None:
    print("Running Alembic migrations (alembic upgrade head)...")
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    )
    if result.returncode != 0:
        print("ERROR: Alembic migrations failed.", file=sys.stderr)
        sys.exit(result.returncode)


def main() -> None:
    database_url = get_database_url()
    verify_connection(database_url)
    run_migrations()
    print("Database is up to date.")


if __name__ == "__main__":
    main()
