# Phase 7: AI Assistant & Ecosystem Architecture

## RAG (Retrieval-Augmented Generation) Architecture
```mermaid
sequenceDiagram
    participant User
    participant ChatAPI as Chat Controller
    participant Embed as EmbeddingService
    participant VectorDB as VectorDatabase (Pinecone/MongoAtlas)
    participant LLM as OpenAI/Groq
    
    User->>ChatAPI: "What projects did Abhijeet build?"
    ChatAPI->>Embed: Generate query vector
    Embed-->>ChatAPI: [0.01, 0.05, ...]
    ChatAPI->>VectorDB: Semantic Search (similarity > 0.8)
    VectorDB-->>ChatAPI: Context (Project chunks)
    ChatAPI->>LLM: Prompt + Context
    LLM-->>ChatAPI: Streaming response
    ChatAPI-->>User: "Abhijeet built PresiBot..."
```

## Resume Intelligence Pipeline
```mermaid
graph TD
    A[PDF Upload] --> B(Extract Text)
    B --> C{LLM Extraction}
    C --> D[Identify Skills]
    C --> E[Identify Metrics]
    F[Job Description] --> G{LLM Extraction}
    G --> H[Identify Requirements]
    D --> I(Comparison Engine)
    H --> I
    I --> J[Score Generation]
    I --> K[Gap Analysis]
```

## API Contracts

### AI Assistant
- `POST /api/v1/assistant/chat` -> Accepts `{ message, history }`, returns `stream`
- `GET /api/v1/assistant/history` -> Fetch chat session history

### Resume Intelligence
- `POST /api/v1/resume/analyze` -> Analyze uploaded PDF against Job Description
- `POST /api/v1/resume/score` -> Return detailed JSON metric analysis

### GitHub & Analytics
- `POST /api/v1/github/sync` -> Trigger Background Queue (BullMQ) for Repo Sync
- `GET /api/v1/analytics/overview` -> Aggregation pipeline for Dashboard Quick Stats
