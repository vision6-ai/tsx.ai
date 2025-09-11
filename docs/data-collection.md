[← Back to Index](index.md)

---

# Data Collection Service PRD

## 1. Service Overview

The Data Collection Service is the exclusive data ingestion mechanism for the TSX.AI platform. Its sole responsibility is to continuously scrape content from a variety of web sources based on configurations defined for each tenant. This service is embodied by the **Ingestion Agent** within the AGNO framework.

## 2. Core Components

*   **AGNO `Ingestion Agent`:** The compute component responsible for executing and managing scraping jobs. *(Validation Note: "Ingestion Agent" is a conceptual name for a custom AGNO agent, not a pre-built AGNO component.)*
*   **AGNO `FirecrawlTools`:** The exclusive tool to be used for all web scraping and crawling tasks.
*   **Input (Configuration):** The `tenants` MongoDB collection, which provides the scraping targets for each `tenant_id`.
*   **Output (Data):** The `raw_posts` MongoDB collection, where all scraped data is stored with its corresponding `tenant_id`.

## 3. Scraping Strategies per Source

The Ingestion Agent will use `FirecrawlTools` to implement tailored strategies for each source type. The tables below outline the approach for each source.

### Data Sources

| Source | URL | Content Type | Notes |
|:--- |:--- |:--- |:--- |
| **SEDAR+** | `https://www.sedarplus.ca` | Regulatory reports, financial reports, management announcements | Use `crawl` for new filings. RSS can trigger `scrape`. |
| **CEO.CA** | `https://ceo.ca` | Real-time investor chat, rumors, community sentiment | `crawl` ticker channels. Requires `actions` for dynamic content. Limited API available. |
| **Stockwatch** | `https://www.stockwatch.com` | Real-time news, unusual price movements, trading reports | `crawl` for new articles. RSS available. Paid API available. |
| **TradingView** | `https://www.tradingview.com` | Chart analysis, indicators, technical sentiment | `scrape` ticker pages. Requires `actions` for comment streams. TradingView API available. |
| **SmallCap Discoveries** | `https://www.smallcapdiscoveries.com` | In-depth research on Canadian small cap companies | **Paid access required.** No API, scraping needs credentials. |
| **MicroCapClub** | `https://microcapclub.com` | Closed forum for experienced investors, in-depth analysis | **Members-only.** No API, public scraping not feasible. |
| **SmallCap Power** | `https://www.smallcappower.com` | News and updates focused on small cap stocks | `crawl` for new articles. RSS can trigger `scrape`. |
| **BetaKit** | `https://betakit.com` | News on startups, tech companies, and scale-ups | `crawl` for new articles. BetaKit RSS available. |
| **TechTO** | `https://www.techto.org` | Investment events, growing companies, panel information | `crawl` news/updates sections. TechTO Updates available. |
| **Reddit (r/CanadianInvestor)** | `https://www.reddit.com/r/CanadianInvestor` | Community discussion, trends, viral stock posts | `crawl` subreddit. Requires `actions` for infinite scroll. Reddit API available. |
| **Twitter/X** | `https://twitter.com` | Rumors, analysis, real-time updates | `crawl` search pages/profiles. Requires `actions` for dynamic timeline. Twitter API available. |
| **Stockhouse** | `https://www.stockhouse.com` | Forums, small cap stock discussions, trends | `crawl` specific ticker forums. No API, web scraping only. |
| **Crunchbase** | `https://www.crunchbase.com` | Funding rounds, mergers and acquisitions info | `scrape` specific company profiles. Crunchbase API available. |
| **Press Releases (Newswire)** | `https://www.newswire.ca` | Official company announcements, partnerships, regulation | `crawl` for new releases. RSS can trigger `scrape`. |
| **Discord/Telegram** | `https://discord.com` / `https://telegram.org` | Private discussions, VIP groups, unofficial market updates | **Public archives only.** Webhooks/Bot integration possible. |

### Influencer Sources

| Influencer | Platform | URL | Focus Area | Content Type | Notes |
|:--- |:--- |:--- |:--- |:--- |:--- |
| **Wolf of Oakville** | Twitter, Private Discord | `https://twitter.com/WolfOfOakville` | Canadian micro/small caps | Member-only reports, stock breakdowns | `scrape` Twitter profile. Discord requires membership. |
| **SmallCapSteve** | Twitter, The Deep Dive | `https://twitter.com/smallcapsteve` / `https://thedeepdive.ca` | Canadian juniors, mining, energy | CEO interviews, Deep Dive articles | `crawl` Deep Dive site. `scrape` Twitter profile. |
| **Hidden Small Caps** | Twitter | `https://twitter.com/hiddensmallcaps` | Undervalued microcaps | Twitter threads with charts, valuation analysis | `scrape` Twitter profile with `actions` for threads. |
| **Fabrice Taylor** | President's Club Newsletter | LinkedIn | Canadian small caps | Newsletter pick explanations, stock theses | Newsletter requires subscription. LinkedIn scraping limited. |
| **Sean Wise** | The Naked Entrepreneur | LinkedIn | Entrepreneurship, early-stage | Video interviews with founders | Video content extraction challenging. |
| **Ian Cassel** | Twitter, MicroCapClub | `https://twitter.com/iancassel` / `https://microcapclub.com` | US microcaps | MicroCapClub discussions, investment memos | MicroCapClub requires membership. |
| **Jonah Lupton** | Twitter, Substack | `https://twitter.com/JonahLupton` / `https://growthstockdeepdives.substack.com` | US growth stocks | Long-form posts on Substack, financial models | `crawl` Substack. `scrape` Twitter. |
| **David Waters** | Twitter, Alluvial Capital | `https://twitter.com/alluvialcapital` / `https://alluvial.substack.com` | Value/special situations | Investment ideas from overlooked sectors | `crawl` Substack. `scrape` Twitter. |
| **Howard Lindzon** | StockTwits, Twitter | `https://twitter.com/howardlindzon` / `http://www.howardlindzon.com` | Broad market + small caps | Daily commentary, podcast episodes | `crawl` blog. `scrape` Twitter/StockTwits. |

### 3.1. Forums (e.g., CEO.ca, Stockhouse.com)

*   **Method:** Use `FirecrawlTools.crawl()`.
*   **Configuration:**
    *   The `url` parameter should be the specific forum thread or sub-forum URL defined in the tenant's `scraping_targets`.
    *   Use the `limit` parameter to control crawl depth (e.g., 5 pages per run) to manage resource usage.
*   **Data Extraction:** Extract post content, author username, and timestamp.

### 3.2. Social Media (e.g., Twitter/X, Reddit)

*   **Method:** Use `FirecrawlTools.crawl()` for feeds (e.g., a subreddit) or `FirecrawlTools.scrape()` for individual posts.
*   **Configuration:**
    *   **Crucially, the agent must use the `actions` parameter within Firecrawl to handle dynamic content loading (e.g., infinite scroll or "load more" buttons).** The specific actions will need to be defined during implementation for each platform.
    *   *(Validation Note: Firecrawl documentation recommends using `wait` actions between other actions to ensure pages have loaded.)*
*   **Data Extraction:** Extract post content, author, timestamp, and engagement metrics (likes, replies, shares).

### 3.3. News Sites (e.g., TMX Money, Financial News)

*   **Method:** Use `FirecrawlTools.scrape()`.
*   **Configuration:**
    *   The agent will scrape specific article URLs. These URLs may be discovered via other platform features (e.g., a separate news monitoring agent) or from links shared on forums/social media.
*   **Data Extraction:** Extract the article's main body text (`markdown` format is preferred), title, author, and publication date.

### 3.4. Video Platforms (e.g., YouTube)

*   **Method:** Use `FirecrawlTools.scrape()` on a specific video URL.
*   **Configuration:** The primary goal is to extract comments. The page transcript, if available, should also be extracted from the scraped `markdown` content.
*   **Data Extraction:** Extract video title, comments (author, content), and transcript.

### 3.5. Public Chat (e.g., Discord)

*   **Limitation:** This service can only scrape publicly accessible web archives of chat channels. It cannot connect to Discord's API directly.
*   **Method:** Use `FirecrawlTools.scrape()` on the public URL of the channel.
*   **Configuration:** May require the use of the `actions` parameter to scroll through the chat history.

## 4. Operational Requirements

*   **Tenant-Based Scheduling:** All scraping jobs must be initiated and executed in the context of a specific `tenant_id`, based on the configuration in the `tenants` collection.
*   **Asynchronous Execution:** For continuous, recurring scraping tasks, the agent must handle the asynchronous nature of Firecrawl's `crawl` operation. The `FirecrawlTools.crawl()` method is asynchronous and returns a job ID. The agent must be designed to:
    1.  Initiate the crawl and store the returned `job_id`.
    2.  Periodically poll a Firecrawl status endpoint with the `job_id` to check for completion.
    3.  Once completed, retrieve the scraped data.
    *(Validation Note: The originally specified `FirecrawlTools.start_crawl()` method is not found in the documentation. The above polling mechanism is the recommended approach for handling long-running crawls.)*
*   **Data Deduplication:** Before inserting a document into `raw_posts`, the agent MUST verify that a document with the same `url` and `tenant_id` does not already exist.
*   **Error Handling:** The agent must implement a retry mechanism for failed scraping attempts. This should be done using AGNO's built-in `exponential_backoff` feature by setting `exponential_backoff=True` in the agent configuration, along with `retries` and `retry_delay`. All persistent errors must be logged.

## 5. Acceptance Criteria

*   The service successfully scrapes content from all specified source types (Forums, Social Media, News, Video).
*   All data stored in the `raw_posts` collection is correctly and consistently tagged with the `tenant_id` from which the job was configured.
*   The data deduplication mechanism is effective at preventing duplicate entries for the same URL within a single tenant's data.
*   The service can handle transient network errors and scraping failures without crashing, logging the issue and retrying the job using exponential backoff.
*   The use of Firecrawl's `actions` parameter is successfully implemented to scrape content from at least one dynamic social media site (e.g., Twitter/X).
*   The service correctly handles asynchronous crawling jobs using a polling mechanism.
