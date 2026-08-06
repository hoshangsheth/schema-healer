# SchemaHealer

> AI-powered schema recovery layer that detects CSV schema drift and automatically repairs recoverable schema mismatches using a hybrid recovery engine.

---

# Project Status

**Current Stage:** Phase 1 – Vertical Slice 5 Complete

SchemaHealer is a production-oriented backend service that automatically detects schema drift in uploaded CSV files, recovers recoverable schema mismatches through a hybrid recovery engine, verifies the recovered dataset, generates a healing report, and exports the best recoverable dataset while preserving all original data.

---

# Completed

## Project Foundation

- Business Foundation
- Technical Foundation
- Stage 0 Development Environment Setup

## Phase 1 – Backend Core

### Vertical Slice 1

- End-to-End Schema Validation Pipeline
- CSV Upload Processing
- Schema Validation Engine
- Structured API Responses
- FastAPI Integration

### Vertical Slice 2

- Recovery Engine Architecture
- Rule-Based Recovery Strategy
- Recovery Result Models
- Recovery Engine Orchestration

### Vertical Slice 3

- Fuzzy Matching Recovery Strategy
- Hybrid Recovery Pipeline (Rule → Fuzzy)
- Recovery Engine Integration
- Schema Validation Service Integration
- API Integration
- Recovery Engine Test Suite
- End-to-End Validation
- Swagger Verification

### Vertical Slice 4

- Semantic Recovery Engine
- Provider-Agnostic LLM Architecture
- Google Gemini 3.6 Flash Integration
- Prompt Builder
- Semantic Column Matching
- Structured JSON Response Validation
- Environment-Based Configuration
- Exception Translation
- Hybrid Recovery Pipeline (Rule → Fuzzy → Semantic)
- End-to-End Integration Testing
- Swagger Verification

### Vertical Slice 5

- Recovered DataFrame Builder
- Dataset Verification Service
- Healing Report Generation
- Recovery Summary Reporting
- Verification Findings
- Verification Severity Assessment
- Internal Processing Pipeline Models
- Public API Response Models
- Recovered CSV Export
- JSON and CSV Response Support
- Graceful LLM Failure Handling
- Semantic Recovery Fallback
- Dataset Integrity Verification
- Structured Recovery Logging
- Configurable LLM Timeout
- UTF-8 BOM Handling
- Comprehensive Integration Testing

---

# Features

- CSV schema validation
- Automatic header normalization
- Rule-based schema recovery
- Fuzzy matching using RapidFuzz
- AI-powered semantic schema recovery
- Hybrid recovery pipeline
- Recovered DataFrame generation
- Downloadable recovered CSV
- Dataset verification
- Healing report generation
- Recovery summary reporting
- Duplicate canonical field detection
- Invalid mapping detection
- Unresolved header detection
- Graceful LLM failure recovery
- Structured validation responses
- Provider-agnostic LLM integration

---

# Tech Stack

## Backend

- Python
- FastAPI
- Pydantic
- Pandas

## AI

- Google Gemini 3.6 Flash
- RapidFuzz

## Architecture

- Layered Service Architecture
- Factory Pattern
- Builder Pattern
- Provider-Agnostic LLM Client
- Hybrid Recovery Engine

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
Recovered DataFrame Builder
    │
    ▼
Dataset Verification
    │
    ▼
Healing Report Generation
    │
    ├── JSON Response
    │
    └── Downloadable Recovered CSV
```

---

# Recovery Pipeline Resilience

SchemaHealer is designed to gracefully degrade when semantic recovery is unavailable.

```text
Rule Recovery
      │
      ▼
Fuzzy Recovery
      │
      ▼
Semantic Recovery
      │
      ├── Success
      │      │
      │      ▼
      │   Apply Semantic Matches
      │
      └── Failure
             │
             ▼
Continue with Rule + Fuzzy Results
             │
             ▼
Leave Remaining Columns Pending
             │
             ▼
Verification
             │
             ▼
Healing Report
             │
             ▼
JSON / CSV Response
```

This ensures that temporary AI provider failures never prevent successful rule-based and fuzzy recovery.

---

# Example Recovery Result

```json
{
  "mappings": [
    {
      "source_header": "customer_id",
      "canonical_field": "customer_id",
      "recovery_method": "rule",
      "status": "resolved"
    },
    {
      "source_header": "custmer_name",
      "canonical_field": "customer_name",
      "recovery_method": "semantic",
      "status": "resolved"
    },
    {
      "source_header": "favorite_pizza",
      "canonical_field": null,
      "recovery_method": null,
      "status": "pending"
    }
  ],
  "verification_result": {
    "is_dataset_verified": false
  },
  "healing_report": {
    "summary": {
      "requires_manual_intervention": true
    }
  }
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
- Vertical Slice 5

## Upcoming

### Phase 2

- React Frontend
- Interactive Recovery Dashboard
- Manual Mapping Workflow
- Recovery Audit History
- Authentication & User Management
- Docker Support
- Cloud Deployment
- Performance Benchmarking

---

More documentation, architecture diagrams, deployment instructions, evaluation benchmarks, and demo material will be added as the project progresses.