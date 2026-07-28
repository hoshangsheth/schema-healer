# SchemaHealer

> AI-powered schema recovery layer that detects CSV schema drift and automatically repairs recoverable schema mismatches using a hybrid recovery engine.

---

# Project Status

**Current Stage:** Phase 1 – Vertical Slice 4 Complete

SchemaHealer now supports end-to-end CSV schema validation with a layered recovery pipeline that combines rule-based matching, fuzzy matching, and AI-powered semantic matching.

## Completed

### Project Foundation

- Business Foundation
- Technical Foundation
- Stage 0 Development Environment Setup

### Phase 1 – Backend Core

#### Vertical Slice 1

- End-to-End Schema Validation Pipeline
- CSV Upload Processing
- Schema Validation Engine
- Structured API Responses
- FastAPI Integration

#### Vertical Slice 2

- Recovery Engine Architecture
- Rule-Based Recovery Strategy
- Recovery Result Models
- Recovery Engine Orchestration

#### Vertical Slice 3

- Fuzzy Matching Recovery Strategy
- Hybrid Recovery Pipeline (Rule → Fuzzy)
- Recovery Engine Integration
- Schema Validation Service Integration
- API Integration
- Recovery Engine Test Suite
- End-to-End Validation
- Swagger Verification

#### Vertical Slice 4

- Semantic Recovery Engine
- Provider-Agnostic LLM Architecture
- Google Gemini Integration
- Prompt Builder
- Semantic Column Matching
- Structured JSON Response Validation
- Environment-Based Configuration
- Exception Translation
- Semantic Recovery Validation
- Hybrid Recovery Pipeline (Rule → Fuzzy → Semantic)
- End-to-End Integration Testing
- Swagger Verification

---

# Features

- CSV schema validation
- Automatic header normalization
- Rule-based schema recovery
- Fuzzy string matching using RapidFuzz
- AI-powered semantic schema recovery
- Hybrid recovery orchestration
- Duplicate canonical field detection
- Invalid mapping detection
- Unresolved header detection
- Structured validation responses
- Provider-agnostic LLM integration

---

# Tech Stack

## Backend

- Python
- FastAPI
- Pydantic

## AI

- Google Gemini 3.6 Flash
- RapidFuzz

## Architecture

- Service Layer Architecture
- Factory Pattern
- Provider-Agnostic LLM Client
- Layered Recovery Engine

## Frontend (Planned)

- React 19
- TypeScript
- Vite
- Tailwind CSS

---

# Current Recovery Pipeline

```text
CSV Upload
    │
    ▼
Header Extraction
    │
    ▼
Header Normalization
    │
    ▼
Recovery Engine
    │
    ├── Rule Matcher
    │
    ├── Fuzzy Matcher
    │
    └── Semantic Matcher (Gemini)
    │
    ▼
Schema Validation
    │
    ▼
Validation Result
```

---

# Example Recovery Result

```json
{
  "mappings": [
    {
      "source_header": "customer_id",
      "recovery_method": "rule"
    },
    {
      "source_header": "custmer_name",
      "recovery_method": "semantic"
    },
    {
      "source_header": "favorite_pizza",
      "status": "pending"
    }
  ]
}
```

---

# Roadmap

## Completed

- Project Foundation
- Vertical Slice 1
- Vertical Slice 2
- Vertical Slice 3
- Vertical Slice 4

## Upcoming

- Vertical Slice 5
- Frontend Dashboard
- Recovery Audit Logs
- Authentication
- Docker Support
- Deployment
- Performance Benchmarks

---

More documentation, architecture diagrams, deployment instructions, evaluation benchmarks, and demo material will be added as the project progresses.