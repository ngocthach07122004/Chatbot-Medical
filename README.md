# Website UI


<img width="1511" height="735" alt="web4" src="https://github.com/user-attachments/assets/ef2d5161-673a-4eba-8790-6464eda9f721" />


<img width="1511" height="732" alt="web6" src="https://github.com/user-attachments/assets/d6f11c90-1a8c-4c23-af42-320998f47927" />


<img width="1512" height="734" alt="web5" src="https://github.com/user-attachments/assets/c055489c-c379-44b0-89cd-a53c4af844cb" />

<img width="1512" height="733" alt="web7" src="https://github.com/user-attachments/assets/1613b444-5a2f-4180-80ea-ce8c2578c565" />

<img width="1512" height="731" alt="web12" src="https://github.com/user-attachments/assets/5b504e07-33fc-4b59-a055-97b5c31b8b6a" />

<img width="1509" height="728" alt="web13" src="https://github.com/user-attachments/assets/4857e67a-80e3-432d-a451-0763508883dd" />




<img width="1512" height="736" alt="web8" src="https://github.com/user-attachments/assets/d7ff0e7f-17ca-489c-aa10-dd4e20fe89c8" />


<img width="1512" height="734" alt="web9" src="https://github.com/user-attachments/assets/90514f2b-f6a9-44c3-9db1-571825df5b1d" />


<img width="1512" height="734" alt="web10" src="https://github.com/user-attachments/assets/6bc048fd-43e0-4960-b877-977497270f37" />


<img width="1512" height="736" alt="web11" src="https://github.com/user-attachments/assets/b9fefa76-7c01-433b-9673-67590ce4364a" />


<img width="1511" height="734" alt="web1" src="https://github.com/user-attachments/assets/332cf777-8e6c-4892-8150-ebf19f27f10f" />


<img width="1512" height="733" alt="web2" src="https://github.com/user-attachments/assets/17591d48-4d95-4a2c-b6e7-d225dd282c9e" />



<img width="1512" height="690" alt="web3" src="https://github.com/user-attachments/assets/66476ccc-5a67-419f-9764-ea61a157fa66" />





# 🏥 Medical Chatbot - Intelligent Healthcare Chatbot System

> An AI-powered chatbot to assist doctors in medical information retrieval and patient management, integrated with PubMedBERT and Clinical QA API.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🎯 Introduction

**Medical Chatbot** is an intelligent chatbot system designed to assist healthcare professionals in:
- Retrieving medical information from the PubMed database
- Managing patient information and chat history
- Receiving AI-generated answers based on cited scientific articles

The system utilizes **PubMedBERT** model for processing and retrieving medical information, ensuring high accuracy and reliability for professional users.

---

## ✨ Features

### 🤖 AI Chatbot
- Answer medical questions with citations from PubMed
- Display responses in professional Markdown format
- Link to original research articles

### 👨‍⚕️ Patient Management
- View doctor's patient list
- Quick patient search functionality
- Store conversation history per patient

### 📚 Medical Document Retrieval
- Integrated Clinical QA API
- Article retrieval from Corpus API
- Display article details with PMID

### 🔐 Authentication & Security
- Login/Registration system
- Doctor profile management
- User authorization

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                 │
│                    - Chatbot UI                                 │
│                    - Patient Management                         │
│                    - Doctor Profile                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
    │ Backend (Java)│  │ Backend (Go)  │  │   AI Service      │
    │ - Doctor API  │  │ - Patient API │  │ - Clinical QA API │
    │ - Chat API    │  │ - Data API    │  │ - Corpus API      │
    └───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘
            │                  │                     │
            ▼                  ▼                     ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
    │  PostgreSQL   │  │  PostgreSQL   │  │  PubMedBERT +     │
    │  (Doctor DB)  │  │  (Patient DB) │  │  Milvus Vector DB │
    └───────────────┘  └───────────────┘  └───────────────────┘
            │                  │
            └────────┬─────────┘
                     │
              ┌──────▼──────┐
              │ Apache Kafka│
              │ (Messaging) │
              └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| React | 18.x | UI Library |
| Vite | 5.x | Build Tool |
| SCSS Modules | - | Styling |
| Axios | - | HTTP Client |
| React Router | - | Routing |
| React Markdown | - | Markdown Rendering |

### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| Java Spring Boot | 3.x | Main Backend |
| Go | 1.21+ | Microservice |
| PostgreSQL | 16 | Database |
| Apache Kafka | 8.1.0 | Message Queue |

### AI/ML
| Technology | Description |
|------------|-------------|
| PubMedBERT | Medical NLP Model |
| Bi-Encoder | Dual-encoder Architecture |
| Milvus | Vector Database |
| PyTorch | Deep Learning Framework |
| Transformers (HuggingFace) | NLP Library |

### DevOps
| Technology | Description |
|------------|-------------|
| Docker & Docker Compose | Containerization |
| pgAdmin | Database Management |

---

## 📁 Project Structure

```
ChatBotMedical/
├── frontend/                 # React Frontend Application
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   │   ├── Chatbot/          # Chatbot interface
│   │   ├── Login/            # Authentication
│   │   └── Profile/          # User profile
│   ├── services/             # API services
│   │   ├── chatServiceApi.js
│   │   ├── clinicalQaService.js
│   │   └── corpusService.js
│   └── layouts/              # Layout components
│
├── backend/
│   ├── java/Medical/         # Spring Boot Backend
│   │   ├── controller/       # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Data Access
│   │   └── dto/              # Data Transfer Objects
│   └── go/                   # Go Microservice
│
├── chatBot/                  # AI/ML Training Module
│   ├── model.py              # BiEncoder Model
│   ├── train.py              # Training Script
│   ├── evaluate_par.py       # Evaluation
│   ├── data_loader.py        # Data Processing
│   ├── retrieve.py           # Document Retrieval
│   └── insert_to_milvus.py   # Vector DB Insertion
│
├── database/                 # Database Scripts
├── handleData/               # Data Processing Utilities
├── docker-compose.yml        # Docker Configuration
├── .env.example              # Environment Variables Template
└── README.md                 # This File
```

---

## 🚀 Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Java 17+
- Python 3.9+
- Go 1.21+

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/ChatBotMedical.git
cd ChatBotMedical
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env file with required configurations
```

### Step 3: Start Services with Docker
```bash
docker-compose up -d
```

### Step 4: Install Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Start Backend (Java)
```bash
cd backend/java/Medical
./mvnw spring-boot:run
```

### Step 6: Start Backend (Go)
```bash
cd backend/go
go run main.go
```

---

## 📖 Usage Guide

### Login
1. Navigate to `http://localhost:5173`
2. Login with doctor credentials

### Using the Chatbot
1. Select a patient from the left sidebar
2. Type a medical question in the chat input
3. AI will respond with citations from PubMed
4. Click on PMID to view article details

### Patient Management
- Search patients using the search bar
- View chat history for each patient
- Chat history is automatically saved

---

## 📡 API Documentation

### Clinical QA API
```http
POST /chat
Content-Type: application/json

{
  "query": "What are the symptoms of diabetes?",
  "top_k": 5
}
```

### Corpus API
```http
POST /api/corpus
Content-Type: application/json

{
  "pmids": ["12345678", "87654321"]
}
```

### Chat History API
```http
GET /api/history/{doctorId}/{patientId}
POST /api/chat/save
```

---

## 🧠 AI Model

### Patient Article Retrieval (PAR)
The system uses a **Bi-Encoder** architecture with PubMedBERT:

- **Query Encoder**: Encodes user questions
- **Document Encoder**: Encodes medical articles
- **Loss Function**: InfoNCE with in-batch negatives
- **Similarity**: Cosine similarity on L2-normalized embeddings

### Model Performance
| Metric | Score |
|--------|-------|
| MRR | 0.30 - 0.45 |
| Recall@10 | 0.40 - 0.60 |
| NDCG@10 | 0.35 - 0.50 |

---

## 👥 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

- **Author**: Huynh Thach
- **Email**: [your-email@example.com]
- **Project Link**: [https://github.com/your-username/ChatBotMedical](https://github.com/your-username/ChatBotMedical)

---

<p align="center">
  Made with ❤️ for Healthcare Professionals
</p>
