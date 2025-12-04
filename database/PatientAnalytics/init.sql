-- 1. Bảng Medical Article (Kho tri thức từ corpus.jsonl)
CREATE TABLE IF NOT EXISTS medical_article (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector TSVECTOR
    );

-- Index cho full-text search (Quan trọng với 17GB text)
CREATE INDEX IF NOT EXISTS idx_article_search ON medical_article USING GIN(search_vector);

-- 2. Bảng Research Case (Bệnh nhân mẫu từ PMC-Patients.json)
CREATE TABLE IF NOT EXISTS research_case (
    id VARCHAR(50) PRIMARY KEY,
    age DOUBLE PRECISION,
    gender VARCHAR(10),
    disease_name TEXT,
    description TEXT
    );

-- 3. Bảng Relevance (Mối quan hệ giữa Bệnh nhân và Bài báo)
CREATE TABLE IF NOT EXISTS research_relevance (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(50),
    article_id VARCHAR(50),
    relevance_score VARCHAR(50)
    -- Tạm thời chưa tạo Foreign Key cứng để tránh lỗi khi import nếu thiếu dữ liệu
    );

-- Index phụ trợ
CREATE INDEX IF NOT EXISTS idx_res_case_id ON research_relevance(case_id);
CREATE INDEX IF NOT EXISTS idx_res_article_id ON research_relevance(article_id);