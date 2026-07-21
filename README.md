# SchemaHealer

> AI-powered schema recovery layer that detects CSV schema drift and automatically repairs recoverable schema mismatches using a hybrid recovery engine.

## Project Status

Currently under active development.

### Completed

#### Project Foundation

- Business Foundation
- Technical Foundation
- Stage 0 Development Environment Setup

#### Phase 1 Backend Core

**Vertical Slice 1**

- End-to-End Schema Validation Pipeline
- CSV Upload Processing
- Schema Validation Engine
- Structured API Responses
- FastAPI Integration

**Vertical Slice 2**

- Recovery Engine Architecture
- Rule-Based Recovery Strategy
- Recovery Result Models
- Recovery Engine Orchestration

**Vertical Slice 3**

- Fuzzy Matching Recovery Strategy
- Hybrid Recovery Pipeline (Rule → Fuzzy)
- Recovery Engine Integration
- Schema Validation Service Integration
- API Integration
- Recovery Engine Test Suite
- End-to-End Validation
- Swagger Verification

**Vertical Slice 4 (Infrastructure Completed)**

- Provider Agnostic LLM Architecture
- Google Gemini Integration
- LLM Request and Response Models
- Environment Based Configuration
- Exception Translation
- Structured JSON Response Parsing
- Token Usage and Latency Tracking
- Live Integration Testing

### In Progress

#### Phase 1 Backend Core

**Vertical Slice 4**

- Semantic Recovery Engine
- Semantic Column Matching
- Prompt Construction
- AI Powered Schema Recovery
- Recovery Validation
- Hybrid Recovery Pipeline (Rule → Fuzzy → Semantic)

## Tech Stack

### Backend

- Python
- FastAPI

### AI

- Google Gemini 3.6 Flash
- RapidFuzz

### Frontend (Planned)

- React 19
- TypeScript
- Vite
- Tailwind CSS

## Current Recovery Pipeline

```text
CSV Upload
    │
    ▼
Schema Validation
    │
    ▼
Recovery Engine
    │
    ▼
Rule Based Recovery
    │
    ▼
Fuzzy Matching Recovery
    │
    ▼
Semantic Recovery
```

## Planned

- Frontend Dashboard
- Recovery Audit Logs
- Authentication
- Docker Support
- Deployment
- Performance Benchmarks

More documentation, architecture diagrams, deployment instructions, evaluation benchmarks, and demo material will be added as the project progresses.