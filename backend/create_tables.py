import psycopg2

url = "postgresql://postgres:sEZ3djhnN31xAfxC@db.ppfewhxskigulpyrywem.supabase.co:5432/postgres"

sql = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(250) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'personal',
    start_date VARCHAR(10) NOT NULL,
    end_date VARCHAR(10) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'pending',
    estimated_time FLOAT DEFAULT 1.0,
    spent_time FLOAT DEFAULT 0.0,
    progression FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) DEFAULT '',
    frequency VARCHAR(20) DEFAULT 'daily',
    completed_dates JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
    type VARCHAR(20) DEFAULT 'focus',
    duration INTEGER DEFAULT 0,
    date VARCHAR(10) NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content VARCHAR(5000) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

conn = psycopg2.connect(url)
cur = conn.cursor()
cur.execute(sql)
conn.commit()
print("Tables created!")

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
print("Tables:", [r[0] for r in cur.fetchall()])
conn.close()
