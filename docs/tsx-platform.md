[← Back to Index](index.html)

---

# TSX.AI Platform Product Requirements Document (PRD)

## 1. Platform Overview

The TSX.AI platform is a real-time market intelligence solution designed to monitor and analyze online sentiment for Canadian small-cap stocks. It provides company executives with actionable insights by tracking discussions across social media, forums, and news sites. The platform leverages a multi-agent AI system built on the AGNO framework to automate data collection, analysis, and insight generation.

## 2. Identity, Access, and Subscription Management

User management, authentication, multi-tenancy, and subscription billing are handled by **Frontegg**. The TSX.AI platform will integrate Frontegg's services, not build this functionality from scratch.

*   **Multi-Tenancy:** Each client company is a **Tenant** within Frontegg. All data within the TSX.AI platform must be segregated by `tenant_id`.
*   **User Management:** User registration, login, profile management, and team member invitations are all handled by the Frontegg portal.
*   **Authentication:** The platform's backend APIs must be secured and require a valid JWT issued by Frontegg. The JWT will contain the user's identity and their `tenant_id`.
*   **Authorization & Subscriptions:** Subscription plans (e.g., Basic, Premium) and granular feature access will be managed via Frontegg's entitlements and feature flags. The backend must check a user's entitlements before executing certain actions or running premium features.

## 3. System Architecture

The platform's architecture is composed of four primary layers:

*   **Identity Layer (Frontegg):** Manages all user and tenant information, authentication, and subscription logic.
*   **Data Ingestion Layer (AGNO + Firecrawl):** An AGNO agent equipped with Firecrawl tools is responsible for scraping content from specified web sources based on tenant configuration.
*   **Data Storage Layer (AGNO + MongoDB):** A MongoDB database, integrated via AGNO's native connector, serves as the central, multi-tenant repository for all raw and processed data.
*   **AI Analysis Layer (AGNO + Gemini/Claude Service):** A pipeline of specialized AGNO agents performs analysis. These agents utilize the **Gemini Service** for advanced language understanding and generation tasks.

## 4. Agent Architecture

The platform's logic is executed by a series of coordinated AGNO agents. **All agent tasks must be executed within the context of a specific `tenant_id` to ensure data segregation.**

### Agent 1: Ingestion Agent

*   **Role:** Scrape raw content from the web for each tenant.
*   **Framework Tool:** AGNO `FirecrawlTools`
*   **Task:**
    1.  Execute scraping jobs based on the target sources defined in the `tenants` collection.
    2.  Tag every scraped item with the corresponding `tenant_id`.
*   **Output:** Inserts new, tenant-specific documents into the `raw_posts` MongoDB collection.

### Agent 2: Content Classifier Agent

*   **Role:** Filter and categorize raw content for each tenant.
*   **Input:** Reads documents from `raw_posts` for a specific `tenant_id`.
*   **Output:** Updates the document in `raw_posts` with classification metadata.

### Agent 3: Sentiment Analyzer Agent

*   **Role:** Perform deep sentiment analysis on classified content for each tenant.
*   **Input:** Reads classified documents from `raw_posts` for a specific `tenant_id`.
*   **Output:** Creates a new, tenant-specific document in the `processed_posts` collection.

### Agent 4: Insight & Alerting Agent

*   **Role:** Identify trends and generate insights for each tenant.
*   **Input:** Reads from the `processed_posts` collection for a specific `tenant_id`.
*   **Output:** Creates and updates tenant-specific documents in the `alerts` and `analytics` collections.

## 5. Data Model (MongoDB Schemas)

All collections must be indexed by `tenant_id` to ensure query performance and data isolation.

### `tenants`
Stores configuration and subscription information for each client company, linked to a Frontegg tenant.
```json
{
  "_id": "ObjectId",
  "tenant_id": "string", // Frontegg Tenant ID
  "ticker_symbol": "string",
  "company_name": "string",
  "scraping_targets": [{"platform": "twitter", "query": "$XYZ"}],
  "alert_settings": {"sentiment_threshold_positive": 0.8}
}
```

### `raw_posts`
Stores unprocessed content, segregated by tenant.
```json
{
  "_id": "ObjectId",
  "tenant_id": "string", // Frontegg Tenant ID
  "ticker_symbol": "string",
  "source_platform": "string",
  "url": "string",
  "content": "string",
  "timestamp": "ISODate",
  "processed": "boolean"
}
```

### `processed_posts`
Stores fully analyzed content, segregated by tenant.
```json
{
  "_id": "ObjectId",
  "tenant_id": "string", // Frontegg Tenant ID
  "raw_post_id": "ObjectId",
  "ticker_symbol": "string",
  "analysis": {
    "sentiment_score": "float",
    "emotions": ["string"]
  },
  "processed_at": "ISODate"
}
```

### `alerts`
Stores generated alerts, segregated by tenant.
```json
{
  "_id": "ObjectId",
  "tenant_id": "string", // Frontegg Tenant ID
  "ticker_symbol": "string",
  "description": "string",
  "timestamp": "ISODate"
}
```

### `analytics`
Stores aggregated data for dashboards, segregated by tenant.
```json
{
  "_id": "ObjectId",
  "tenant_id": "string", // Frontegg Tenant ID
  "ticker_symbol": "string",
  "timeseries_data": [{"timestamp": "ISODate", "avg_sentiment": "float"}]
}
```

## 6. Data Processing Pipeline

The entire pipeline is executed on a per-tenant basis, triggered by user actions or scheduled tasks.

1.  **Configuration:** A user belonging to a tenant sets their desired `scraping_targets` and `alert_settings` in the `tenants` collection.
2.  **Ingestion:** The `Ingestion Agent` scrapes content for that tenant, populating `raw_posts`.
3.  **Classification & Analysis:** The `Content Classifier` and `Sentiment Analyzer` agents process the raw posts, creating enriched data in `processed_posts`.
4.  **Insight Generation:** The `Insight & Alerting Agent` monitors the processed data, creating `alerts` and `analytics`.
5.  **Presentation:** The tenant's users view their segregated data on the dashboard by authenticating via Frontegg.

## 7. Development Phases

*   **MVP Phase 1:**
    *   **Integrate Frontegg for user login and tenant management.**
    *   Implement `Ingestion Agent` for Twitter and CEO.ca.
    *   Implement `Content Classifier` and `Sentiment Analyzer` agents.
    *   Basic data storage for `tenants`, `raw_posts`, and `processed_posts`.
    *   Support a single ticker per tenant.
*   **Phase 2:**
    *   Expand `Ingestion Agent` to all target platforms.
    *   Implement `Insight & Alerting Agent`.
    *   **Integrate Frontegg subscription plans and feature flags.**
    *   Full implementation of all MongoDB collections.
*   **Phase 3:**
    *   Develop predictive analytics capabilities.
    *   Build an API for external integrations.
    *   Create advanced data visualizations for the dashboard.