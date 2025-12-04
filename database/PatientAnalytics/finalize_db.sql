-- 1. Clean up orphan data (Dữ liệu rác không có cha)
DELETE FROM research_relevance
WHERE case_id NOT IN (SELECT id FROM research_case);

DELETE FROM research_relevance
WHERE article_id NOT IN (SELECT id FROM medical_article);

-- 2. Create Foreign Keys (Tạo liên kết cứng)
ALTER TABLE research_relevance
    ADD CONSTRAINT fk_case
        FOREIGN KEY (case_id) REFERENCES research_case(id);

ALTER TABLE research_relevance
    ADD CONSTRAINT fk_article
        FOREIGN KEY (article_id) REFERENCES medical_article(id);