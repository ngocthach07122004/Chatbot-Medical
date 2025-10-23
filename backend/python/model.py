import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel, AutoTokenizer


class BiEncoder(nn.Module):
    def __init__(self, model_name, embedding_dim=768):
        super(BiEncoder, self).__init__()
        self.query_encoder = AutoModel.from_pretrained(model_name)
        self.doc_encoder = AutoModel.from_pretrained(model_name)
        self.embedding_dim = embedding_dim

    def pool_embeddings(self, last_hidden_state, attention_mask):
        token_embeddings = last_hidden_state
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        return sum_embeddings / sum_mask

    def encode_query(self, input_ids, attention_mask):
        outputs = self.query_encoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=True
        )

        pooled = self.pool_embeddings(outputs.last_hidden_state, attention_mask)
        return F.normalize(pooled, p=2, dim=1)

    def encode_doc(self, input_ids, attention_mask):
        outputs = self.doc_encoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=True
        )

        pooled = self.pool_embeddings(outputs.last_hidden_state, attention_mask)
        return F.normalize(pooled, p=2, dim=1)

    def forward(self, query_input_ids=None, query_attention_mask=None,
                doc_input_ids=None, doc_attention_mask=None, mode='dual'):
        if mode == 'dual':
            query_embeddings = self.encode_query(query_input_ids, query_attention_mask)
            doc_embeddings = self.encode_doc(doc_input_ids, doc_attention_mask)
            return query_embeddings, doc_embeddings
        elif mode == 'doc':
            return self.encode_doc(doc_input_ids, doc_attention_mask)
        elif mode == 'query':
            return self.encode_query(query_input_ids, query_attention_mask)
        else:
            raise ValueError(f"Unknown mode: {mode}")

if __name__ == "__main__":
    model = BiEncoder()

