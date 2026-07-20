# TransitIntel AI

> 🚌 AI-Powered Operating System for Public Transport

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue?logo=kubernetes)](https://kubernetes.io)

TransitIntel AI is a production-grade enterprise SaaS platform that provides transport operators with AI-powered fleet management, passenger counting, revenue intelligence, route optimization, fraud detection, and business analytics. Designed for fleets from 1 to 10,000+ vehicles.

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time KPIs, revenue charts, fleet status, activity feed |
| **Fleet Management** | Vehicle CRUD, status tracking, maintenance history |
| **Driver Management** | Profiles, licensing, performance ratings, assignments |
| **Conductor Management** | Revenue collection tracking, performance metrics |
| **Route Management** | Routes, stops, schedules, color-coded maps |
| **Live GPS Tracking** | Real-time vehicle positions, speed, geofencing |
| **Revenue Intelligence** | Fare collection, payment methods, trend analysis |
| **AI Passenger Counting** | Computer vision-powered boarding/alighting detection |
| **Fraud Detection** | Anomaly detection, revenue discrepancy alerts |
| **Maintenance Management** | Work orders, scheduling, cost tracking |
| **Fuel Analytics** | Consumption, efficiency, cost analysis |
| **Analytics & BI** | Custom KPIs, route performance scoring |
| **Reports** | Scheduled PDF/Excel reports |
| **Notifications** | Multi-channel alerts with filtering |
| **Settings** | Organization config, user management |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom Design System
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: NextAuth.js v4, JWT, RBAC (8 roles)
- **AI/ML**: TensorFlow.js, ONNX Runtime (Phase 2)
- **Maps**: Leaflet + OpenStreetMap (Phase 2)
- **Real-time**: Socket.io (Phase 2)
- **Deployment**: Docker, Docker Compose, Kubernetes (HPA, Ingress)
- **Caching**: Redis 7

---

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/transitintel-ai.git
cd transitintel-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed demo data (optional)
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with any email and password (6+ characters) to explore the dashboard.

### Docker

```bash
# Start all services (PostgreSQL + Redis + App)
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/app.yaml

# Check status
kubectl get pods -n transitintel
kubectl get svc -n transitintel
kubectl get hpa -n transitintel
```

---

## 📁 Project Structure

```
transitintel-ai/
├── prisma/               # Database schema & migrations
├── k8s/                  # Kubernetes manifests
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (dashboard)/  # Protected dashboard pages
│   │   ├── api/          # REST API routes
│   │   ├── login/        # Auth pages
│   │   └── register/
│   ├── lib/              # Utilities, auth, Prisma client
│   ├── types/            # TypeScript type definitions
│   └── services/         # Business logic services
├── Dockerfile            # Multi-stage production build
├── docker-compose.yml    # Development environment
└── package.json
```

---

## 🔐 Security

- **Authentication**: NextAuth.js with JWT sessions
- **Authorization**: Role-Based Access Control (8 roles)
- **Input Validation**: Zod schemas on all API endpoints
- **SQL Injection**: Prisma parameterized queries
- **XSS**: React auto-escaping + Content Security Policy
- **CSRF**: NextAuth CSRF tokens
- **Audit Logging**: All mutations tracked
- **Kubernetes**: Secrets management, non-root containers

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────┐
│                 Kubernetes                   │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Ingress │→ │  App (HPA)│→ │ PostgreSQL │ │
│  │  (NGINX) │  │  2-10 pods│  │ StatefulSet│ │
│  └─────────┘  └──────────┘  └────────────┘ │
│                     │         ┌────────────┐ │
│                     └────────→│   Redis    │ │
│                               └────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 📊 Database Schema

20+ entities covering organizations, users, vehicles, drivers, conductors, routes, stops, schedules, assignments, trips, revenue records, GPS tracking, passenger counts, maintenance, fuel, notifications, alerts, and audit logs.

---

## 🗺 Roadmap

- [x] **Phase 1** — Foundation (Dashboard, Fleet, Drivers, Routes, Conductors, Auth)
- [ ] **Phase 2** — Real-time GPS Tracking, AI Passenger Counting, WebSockets
- [ ] **Phase 3** — Advanced Analytics, Fraud Detection ML Models
- [ ] **Phase 4** — Maintenance Intelligence, Revenue Reconciliation
- [ ] **Phase 5** — Mobile PWA, API Docs, Monitoring, Helm Charts

---

## 📄 License

Copyright © 2025 TransitIntel AI. All rights reserved.
