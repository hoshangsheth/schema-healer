# SchemaHealer

> AI-powered CRM data recovery and schema normalization layer that detects schema drift and automatically recovers resolvable schema mismatches using a hybrid recovery engine.

---

# Project Status

**Current Stage:** MVP - Phase 1 Vertical Slice 5 Complete

SchemaHealer is a founder-built product currently in MVP. It is designed to detect schema drift in uploaded CRM and structured datasets, recover resolvable schema mismatches through a hybrid recovery engine, verify the recovered dataset, generate healing and verification reports, and export the best recoverable dataset while preserving original data values.

---

# License

**Proprietary - All Rights Reserved**

SchemaHealer is proprietary software. This repository is publicly available for technical transparency, evaluation, and reference.

No permission is granted to copy, modify, distribute, sublicense, publish, or commercially use this software or any portion of its source code without prior written permission from the copyright holder.

The SchemaHealer name, branding, product identity, and associated intellectual property may not be used to imply endorsement, affiliation, or ownership.

For licensing or commercial use inquiries, contact:

**[hoshangsheth@gmail.com](mailto:hoshangsheth@gmail.com)**

---

# Completed

## Project Foundation

* Business Foundation
* Technical Foundation
* Stage 0 Development Environment Setup

## Phase 1 - Backend Core

### Vertical Slice 1

* End-to-End Schema Validation Pipeline
* CSV Upload Processing
* Schema Validation Engine
* Structured API Responses
* FastAPI Integration

### Vertical Slice 2

* Recovery Engine Architecture
* Rule-Based Recovery Strategy
* Recovery Result Models
* Recovery Engine Orchestration

### Vertical Slice 3

* Fuzzy Matching Recovery Strategy
* Hybrid Recovery Pipeline (Rule -> Fuzzy)
* Recovery Engine Integration
* Schema Validation Service Integration
* API Integration
* Recovery Engine Test Suite
* End-to-End Validation
* Swagger Verification

### Vertical Slice 4

* Semantic Recovery Engine
* Provider-Agnostic LLM Architecture
* Google Gemini 3.6 Flash Integration
* Prompt Builder
* Semantic Column Matching
* Structured JSON Response Validation
* Environment-Based Configuration
* Exception Translation
* Hybrid Recovery Pipeline (Rule -> Fuzzy -> Semantic)
* End-to-End Integration Testing
* Swagger Verification

### Vertical Slice 5

* Recovered DataFrame Builder
* Dataset Verification Service
* Healing Report Generation
* Recovery Summary Reporting
* Verification Findings
* Verification Severity Assessment
* Internal Processing Pipeline Models
* Public API Response Models
* Recovered CSV Export
* JSON and CSV Response Support
* Graceful LLM Failure Handling
* Semantic Recovery Fallback
* Dataset Integrity Verification
* Structured Recovery Logging
* Configurable LLM Timeout
* UTF-8 BOM Handling
* Comprehensive Integration Testing

---

# Features

* CSV schema validation
* Automatic header normalization
* Rule-based schema recovery
* Fuzzy matching using RapidFuzz
* AI-powered semantic schema recovery
* Hybrid recovery pipeline
* Recovered DataFrame generation
* Downloadable recovered CSV
* Dataset verification
* Healing report generation
* Recovery summary reporting
* Duplicate canonical field detection
* Invalid mapping detection
* Unresolved header detection
* Graceful LLM failure recovery
* Structured validation responses
* Provider-agnostic LLM integration

---

# Tech Stack

## Backend

* Python
* FastAPI
* Pydantic
* Pandas

## AI and Recovery

* Google Gemini 3.6 Flash
* RapidFuzz

## Architecture

* Layered Service Architecture
* Factory Pattern
* Builder Pattern
* Provider-Agnostic LLM Client
* Hybrid Recovery Engine

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* Framer Motion
* TanStack Query

See `frontend/README.md` for setup, environment configuration, and frontend architecture notes.

---

# Current Recovery Pipeline

```text
CSV Upload
    |
    v
Header Extraction
    |
    v
Header Normalization
    |
    v
Recovery Engine
    |
    +-- Rule Matcher
    |
    +-- Fuzzy Matcher
    |
    +-- Semantic Matcher (Gemini)
    |
    v
Schema Validation
    |
    v
Recovered DataFrame Builder
    |
    v
Dataset Verification
    |
    v
Healing Report Generation
    |
    +-- JSON Response
    |
    +-- Downloadable Recovered CSV
```

---

# Recovery Pipeline Resilience

SchemaHealer is designed to gracefully degrade when semantic recovery is unavailable.

```text
Rule Recovery
      |
      v
Fuzzy Recovery
      |
      v
Semantic Recovery
      |
      +-- Success
      |      |
      |      v
      |   Apply Semantic Matches
      |
      +-- Failure
             |
             v
Continue with Rule + Fuzzy Results
             |
             v
Leave Remaining Columns Pending
             |
             v
Verification
             |
             v
Healing Report
             |
             v
JSON / CSV Response
```

Temporary AI provider failures do not prevent successful rule-based and fuzzy recovery. When semantic recovery is unavailable, the pipeline continues with the best deterministic and fuzzy results available and clearly surfaces unresolved mappings through verification and reporting.

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

* Project Foundation
* Vertical Slice 1
* Vertical Slice 2
* Vertical Slice 3
* Vertical Slice 4
* Vertical Slice 5
* Frontend: Marketing Site and Recovery Workspace

## Upcoming

### Phase 2

* Manual Mapping Workflow
* Recovery Audit History
* Authentication and User Management
* Docker Support
* Cloud Deployment
* Performance Benchmarking

---

# Project Direction

SchemaHealer is being developed toward a broader CRM data recovery and migration workflow.

The long-term direction is to help transform inconsistent legacy or exported CRM data into validated, import-ready datasets through automated schema understanding, recovery, verification, and human review.

The current MVP focuses on establishing the core recovery and verification engine before expanding into broader product workflows and CRM integrations.

---

More documentation, architecture diagrams, deployment instructions, evaluation benchmarks, and demo material will be added as the project progresses.