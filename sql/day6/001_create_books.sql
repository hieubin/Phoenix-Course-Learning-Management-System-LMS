CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);