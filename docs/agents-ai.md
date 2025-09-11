---
layout: default
title: AI Agents Service PRD
---

[← Back to Index](index.html)

# AGNO AI Agents Service PRD (v2)

## 1. Service Overview

The AGNO AI Agents Service is the core intelligence and orchestration layer of the TSX.AI platform. It is responsible for hosting, executing, and managing the lifecycle of all specialized AI agents that power the platform's data processing and insight generation pipeline. This service will be built entirely on the AGNO framework, leveraging its native capabilities to ensure a robust, scalable, and maintainable multi-agent system. The primary directive is to use AGNO's out-of-the-box features for memory, knowledge, and agent orchestration, avoiding any custom-built solutions for these components.

## 2. Core AGNO Concepts Leveraged

The TSX.AI platform will utilize the following core AGNO components as fundamental building blocks:

*   **Agentic Workflows:** The entire per-tenant data processing pipeline will be defined as a deterministic, stateful `Agentic Workflow`. This provides robust error handling, caching, and logging, and allows for complex orchestration logic written in pure Python.
*   **Agent Teams:** To manage the analysis pipeline, we will implement an `Analysis Team`. This team will contain our specialized agents and operate in a `coordinate` mode, ensuring a structured handoff of data between the classification, analysis, and insight generation steps.
*   **Agents:** The central actors in our system. Each agent will be a specialized Python class inheriting from AGNO's `Agent` class, configured with specific tools, knowledge, and memory.
*   **Knowledge Base:** We will use AGNO's `KnowledgeBase` feature to provide agents with domain-specific information at runtime via **Agentic RAG**.
    *   **Use Case:** Storing financial instrument details, company profiles, historical market events, and best practices for sentiment analysis to guide the agents.
*   **Vector Store:** MongoDB will serve as the underlying vector database for the Knowledge Base.
*   **State Management:** The `session_state` within each workflow instance will be used to manage the state of a single tenant's processing job, passing data between agents efficiently without requiring intermediate database writes.
*   **Long-Term Memory (`UserMemories`):** AGNO's long-term memory will be associated with a `tenant_id` to store persistent facts and preferences (e.g., reporting preferences, feedback on alert quality).
*   **Tools:** Agents will be equipped with `Tools` (e.g., `FirecrawlTools`, `GeminiServiceTools`) to interact with external services.

## 3. Agent Architecture

The platform's logic is executed by a stateful `Agentic Workflow` that orchestrates a primary agent and a specialized agent team. All tasks are executed within the context of a `tenant_id`.

### The `DataProcessingWorkflow`
This workflow is the entry point for processing a tenant's data. It manages the entire lifecycle from ingestion to insight.

1.  **Initiation:** The workflow is triggered for a specific `tenant_id`.
2.  **State Management:** It holds the `session_state` for the run, containing the raw and processed data as it moves through the pipeline.
3.  **Orchestration:** It first invokes the `Ingestion Agent`, then passes the results to the `Analysis Team`.

### Agent 1: Ingestion Agent
*   **Role:** A standalone agent responsible for scraping raw content from the web.
*   **AGNO Components:**
    *   **Tools:** `FirecrawlTools`.
*   **Task:**
    1.  Read scraping targets from the `tenants` collection.
    2.  Execute scraping jobs and return the raw content to the workflow.
*   **Output:** A list of scraped documents, which is passed into the workflow's `session_state`.

### The `Analysis Team`
A coordinated team of agents responsible for the core analysis pipeline.
*   **Mode:** `coordinate` (sequential task handoff).
*   **Team Members:**
    1.  `Content Classifier Agent`
    2.  `Sentiment Analyzer Agent`
    3.  `Insight & Alerting Agent`

#### Team Member 1: Content Classifier Agent
*   **Role:** Filters and categorizes raw content.
*   **Input:** Receives raw documents from the `Ingestion Agent` via the workflow's state.
*   **Output:** Enriches the documents with classification metadata and passes them to the next agent in the team.

#### Team Member 2: Sentiment Analyzer Agent
*   **Role:** Performs deep sentiment analysis on classified content.
*   **Input:** Receives classified documents from the `Content Classifier Agent`.
*   **Output:** Adds detailed sentiment analysis to the documents and passes them to the final agent.

#### Team Member 3: Insight & Alerting Agent
*   **Role:** Generates final insights and alerts.
*   **Input:** Receives fully analyzed documents from the `Sentiment Analyzer Agent`.
*   **Output:** Generates `alert` and `analytics` data structures, which are the final product of the workflow. It also updates the tenant's `Long-Term Memory` with any relevant feedback or patterns.

## 4. Deployment & Monitoring

The entire AGNO AI Agents Service, including all workflows, teams, and agents, will be deployed and managed using the **AgentOS Runtime**. This provides a production-ready control plane for monitoring sessions, managing knowledge bases, and ensuring the health of the agentic system within our own cloud environment.

## 5. Future Enhancements

*   **Human-in-the-Loop:** For future phases, we can enhance the `DataProcessingWorkflow` to incorporate a `Human-in-the-Loop` step. For high-priority alerts, the workflow could pause and require manual validation from a tenant user via the AgentOS Playground before finalizing the alert.

## 6. Dependencies

*   **Frontegg:** For providing the `tenant_id` and user context.
*   **MongoDB:** Serves as the primary data store and the vector store for the Knowledge Base.
*   **Gemini Service:** Provides advanced AI capabilities to the agents via a `Tool`.
*   **Firecrawl Service:** Provides web scraping capabilities to the `Ingestion Agent` via a `Tool`.

## 7. Acceptance Criteria

*   The `DataProcessingWorkflow` is implemented as an AGNO `Agentic Workflow` class.
*   The `Analysis Team` is implemented as an AGNO `Agent Team` with the three specified member agents.
*   The workflow correctly uses `session_state` to pass data between the `Ingestion Agent` and the `Analysis Team`.
*   The `Insight & Alerting Agent` successfully reads from and writes to AGNO's `UserMemories` system, partitioned by `tenant_id`.
*   The entire service is deployable and monitored via the AgentOS Runtime.
*   The workflow successfully transforms a `scraping_target` into a generated `alert` within a single, stateful run.
