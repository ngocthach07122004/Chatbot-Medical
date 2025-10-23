# ĐỌC
VD sử dụng
```
curl -X POST "http://localhost:8000/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Patient with diabetes and hypertension",
    "top_k": 10,
    "metric_type": "COSINE"
  }'

```
hoặc post /search với body này
```
{
  "query": "Patient with diabetes and hypertension",
  "top_k": 10,
  "metric_type": "COSINE"
}
```