<p align="center">
  <img src="docs/images/playmaker-banner.png" alt="PlayMaker Prime Banner" width="100%">
</p>

<h1 align="center">PlayMaker Prime</h1>

<p align="center">
AI-powered NFL player prop research platform built with Node.js, Express, Stripe, and modern JavaScript.
</p>

<p align="center">
  <a href="https://playmakerprime.com"><strong>🌐 Live Website</strong></a>
</p>

---

# Overview

PlayMaker Prime is a full-stack NFL player prop research platform built to help users make smarter betting decisions through data-driven analysis.

The platform combines player trends, defensive matchups, weather, injuries, historical performance, and AI-generated insights into one streamlined experience. Public research pages drive SEO while premium members unlock advanced projections, deeper analytics, and exclusive tools through a secure subscription platform.

Unlike a traditional picks service, PlayMaker Prime focuses on helping users understand *why* a prop is favorable by providing transparent supporting data and research.

---

# Features

## Public Research Platform

- Dynamic player pages
- Team intelligence reports
- Matchup reports
- NFL research hub
- Results tracking
- Weekly data updates
- SEO-optimized pages

## Premium Platform

- Player prop projections
- Ride/Fade recommendations
- Advanced matchup intelligence
- Defensive tier adjustments
- Weather context
- Injury analysis
- Historical trend analysis
- Subscription management

## Backend Features

- REST API architecture
- User authentication
- Stripe subscription billing
- Customer Portal integration
- Analytics tracking
- Automated NFL data updates
- Discord automation
- Access control

---

# Screenshots

## Homepage

![Homepage](docs/images/homepage.png)

---

## Player Intelligence

![Player Page](docs/images/player-page.png)

---

## Matchup Intelligence

![Matchup Page](docs/images/matchup-page.png)

---

## Pricing & Membership

![Pricing](docs/images/pricing.png)

---

## Stripe Checkout

![Stripe Checkout](docs/images/stripe-checkout.png)

---

## Discord Automation

![Discord Bot](docs/images/discord-bot.png)

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend

- Node.js
- Express.js
- REST APIs

## Database & Storage

- SQLite
- JSON data files

## Integrations

- Stripe Checkout
- Stripe Customer Portal
- Stripe Webhooks
- Discord API

## Deployment

- Linux VPS
- PM2
- Nginx
- Git
- GitHub

---

# Architecture

```
                         Browser
                            │
                            ▼
                  Public Research Pages
                            │
                            ▼
                   Frontend JavaScript
                            │
                            ▼
                     Express REST API
       ┌───────────────┼─────────────────┐
       │               │                 │
       ▼               ▼                 ▼
 Authentication    Stripe Billing    Analytics
       │               │                 │
       └───────────────┼─────────────────┘
                       ▼
               NFL Data Services
                       │
                       ▼
             JSON Data + SQLite
```

---

# Data Automation

PlayMaker Prime automatically updates NFL data using scheduled Node.js scripts.

Current automation includes:

- Team roster updates
- Schedule updates
- Injury reports
- Weather data
- Defensive tier generation
- Sitemap generation
- Weekly timestamps
- Player lookup generation

This allows the platform to stay synchronized throughout the NFL season with minimal manual maintenance.

---

# Analytics

A custom analytics system tracks:

- Visitor sessions
- Page views
- Time on page
- User interactions
- Button clicks
- Exit events

Administrative traffic can be excluded from analytics to improve reporting accuracy.

---

# Stripe Integration

PlayMaker Prime includes:

- Secure Checkout Sessions
- Monthly subscriptions
- Customer Portal
- Billing management
- Webhook verification
- Premium access control

---

# Discord Automation

A custom Discord bot powers community features including:

- Slash commands
- Automated social media post generation
- Bankroll management
- Community automation
- Premium member tools

---

# Repository Structure

```
PlayMakerPrime
│
├── assets/
├── backend/
├── scripts/
├── tool/
├── docs/
│   └── images/
├── package.json
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/playmaker-prime.git
```

Enter the project

```bash
cd playmaker-prime
```

Install dependencies

```bash
npm install
```

Create an environment file

```bash
cp .env.example .env
```

Run the application

```bash
npm start
```

---

# Environment Variables

Example configuration

```env
PORT=4000

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

STRIPE_PRO_PRICE_ID=

CLIENT_URL=
```

---

# Roadmap

## Completed

- Public NFL research platform
- Premium subscription system
- Dynamic player pages
- Dynamic matchup pages
- Team reports
- Stripe billing
- Analytics system
- Discord automation
- Weekly data pipeline

## In Progress

- Advanced projection engine
- Historical player trends
- Community tools
- Enhanced dashboards

## Planned

- Mobile experience improvements
- Expanded player comparison tools
- Additional AI research features
- More advanced statistical models
- Premium reporting dashboards

---

# Repository Notes

This repository is provided as a portfolio demonstration of PlayMaker Prime.

Production credentials, proprietary projection algorithms, customer information, API keys, and other sensitive infrastructure have been excluded.

---

# Author

**Kayb Campbell**

Full Stack JavaScript Developer

- Node.js
- Express
- REST APIs
- Stripe Integrations
- Discord Bots
- AI Applications

🌐 https://playmakerprime.com
