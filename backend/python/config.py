import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class Config:
    MODEL_NAME = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
    MAX_LENGTH = 512
    EMBEDDING_DIM = 768

    MILVUS_URI = os.getenv("MILVUS_URI")
    MILVUS_TOKEN = os.getenv("MILVUS_TOKEN")
    COLLECTION_NAME = os.getenv("COLLECTION_NAME", "pmc_papers_v1")

if __name__ == "__main__":
    config = Config()
    print(config.COLLECTION_NAME)