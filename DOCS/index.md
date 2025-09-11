# TSX.AI Platform Documentation

## Project Overview

TSX.AI is a real-time market intelligence solution designed to monitor and analyze online sentiment for Canadian small-cap stocks. The platform provides company executives with actionable insights by tracking discussions across social media, forums, and news sites. Built on the AGNO framework, it leverages a multi-agent AI system to automate data collection, analysis, and insight generation.

## Key Features

- **Multi-tenant Architecture**: Secure, isolated data for each client company
- **Real-time Data Ingestion**: Continuous monitoring of 30+ data sources
- **AI-Powered Analysis**: Sentiment analysis, trend detection, and insight generation
- **Automated Alerting**: Configurable alerts for significant market events
- **Comprehensive Coverage**: Forums, social media, news sites, and regulatory filings

## Product Requirements Documents

### 📊 [TSX.AI Platform PRD](tsx-platform.md)
**Main platform requirements and system architecture**

The core platform document outlining the complete system design, including:
- Platform overview and business objectives
- Identity, access, and subscription management via Frontegg
- Four-layer system architecture (Identity, Data Ingestion, Storage, AI Analysis)
- Multi-tenant data model and MongoDB schemas
- Development phases from MVP to full implementation

**Key Components:**
- User authentication and multi-tenancy
- Data segregation by tenant_id
- Subscription management and feature flags
- Dashboard and analytics presentation

---

### 🤖 [AGNO AI Agents Service PRD](AGNO-prd.md)
**Core intelligence and orchestration layer**

Details the AI agent architecture powering the platform's analysis pipeline:
- Agentic Workflows for stateful processing
- Agent Teams for coordinated analysis
- Knowledge Base integration for domain expertise
- Long-term memory for persistent insights

**Agent Pipeline:**
1. **Ingestion Agent**: Web scraping with FirecrawlTools
2. **Content Classifier Agent**: Categorization and filtering
3. **Sentiment Analyzer Agent**: Deep sentiment analysis
4. **Insight & Alerting Agent**: Trend identification and alert generation

---

### 📥 [Data Collection Service PRD](data-collection.md)
**Comprehensive data ingestion mechanism**

Specifications for the exclusive data collection service covering:
- 15+ primary data sources (SEDAR+, CEO.CA, Stockwatch, Reddit, Twitter/X)
- 10+ influencer sources and specialized platforms
- Tailored scraping strategies per source type
- Firecrawl implementation details

**Data Sources Categories:**
- **Regulatory**: SEDAR+ filings and announcements
- **Forums**: CEO.CA, Stockhouse, Reddit communities
- **News**: Financial news, press releases, industry publications
- **Social Media**: Twitter/X, StockTwits, Discord/Telegram
- **Influencers**: Specialized newsletters and expert accounts

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              (Dashboard & Analytics)              │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│                Identity Layer                    │
│                  (Frontegg)                      │
│    • Authentication  • Multi-tenancy             │
│    • Subscriptions   • Feature Flags             │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│              AGNO AI Agents Service              │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐  │
│  │  Ingestion   │───▶│   Analysis Team      │  │
│  │    Agent     │    │ • Classifier         │  │
│  └──────────────┘    │ • Sentiment Analyzer │  │
│                      │ • Insight Generator  │  │
│                      └──────────────────────┘  │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│               Data Storage Layer                 │
│                   (MongoDB)                      │
│  • raw_posts      • processed_posts             │
│  • alerts         • analytics                   │
│  • tenants        • user_memories               │
└─────────────────────────────────────────────────┘
```

## Quick Links

- [GitHub Repository](https://github.com/vision6-ai/tsx.ai)
- [AGNO Framework Documentation](https://docs.agno.ai)
- [Frontegg Integration Guide](https://docs.frontegg.com)
- [MongoDB Atlas Setup](https://www.mongodb.com/atlas)

## Getting Started

1. **Review the Platform PRD** - Start with [tsx-platform.md](tsx-platform.md) for overall system understanding
2. **Understand the AI Architecture** - Read [AGNO-prd.md](AGNO-prd.md) for agent implementation details
3. **Configure Data Sources** - Refer to [data-collection.md](data-collection.md) for ingestion setup

## Development Phases

### Phase 1 (MVP)
- Frontegg integration for authentication
- Basic ingestion for Twitter and CEO.ca
- Content classification and sentiment analysis
- Single ticker support per tenant

### Phase 2
- Full platform coverage (all data sources)
- Insight and alerting system
- Subscription plans and feature flags
- Complete MongoDB schema implementation

### Phase 3
- Predictive analytics
- External API development
- Advanced visualizations

---

*Last Updated: September 2024*