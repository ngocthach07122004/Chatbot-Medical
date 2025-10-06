CREATE TABLE historyChat (
  id SERIAL PRIMARY KEY,
  data JSONB,
  createdAt TIMESTAMP
);
-- chỉ mục GIN toàn cột (tốt cho truy vấn @> containment)
CREATE INDEX idx_data_gin ON data_store USING gin (data);
-- chỉ mục chức năng nếu bạn thường truy vấn theo key cụ thể (ví dụ key 'user')
CREATE INDEX idx_data_user ON data_store ((data ->> 'user'));