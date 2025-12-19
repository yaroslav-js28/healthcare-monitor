# Healthcare Monitor



## Tech Stack

* **Monorepo:** Nx
* **Backend:** NestJS, Prisma, MySQL
* **Frontend:** React, Vite, TailwindCSS, Recharts, Zustand, Headless UI
* **AI/MCP:** Model Context Protocol SDK, Zod
* **Infrastructure:** Docker Compose

---
## Architecture decisions

### 1. Monorepo Strategy

This allows to share code, types, and configurations between the API, Frontend, and MCP Server without duplication.
 All distinct applications share a single source of truth for the Database Schema and TypeScript Interfaces.

### 2. Backend

The NestJS is chosen for the core API because of its modular architecture and native TypeScript support.

### 3. Data Access Layer

The "Parallel Access" Pattern: Both the NestJS API and the MCP Server import Prisma client from this shared library.

### 4. MCP Integration

The MCP Server runs on stdio to communicate with AI clients.

#### Flow: 
1.  Web Users interact via the Frontend → NestJS API → Database.
2.  AI Agents interact via LLM Client → MCP Server → Database.

---

##  Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the **root** of the project:

```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/healthcare_db"
DATABASE_USER="user"
DATABASE_PASSWORD="password"
DATABASE_NAME="db-name"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
PORT=3001

FRONTEND_URL=URL_FOR_FRONTEND

```

### 3. Database Migration & Seeding

Apply the schema and generate fake patient data:

```bash
# Run migrations (creates tables)
pnpm db:migrate

# Seed the database with 5 patients & 15 biomarkers each
pnpm db:seed
```

## Running the Applications

You can run apps individually or all together.

### Run Everything (Parallel)

```bash
npx nx run-many --target=serve --all --parallel
```

### Run Individually (Recommended for Debugging)

**1. API Backend**

```bash
npx nx serve api
```
**2. Client**
```bash
npx nx serve patient-portal
```

**3. MCP Server**

```bash
npx nx serve mcp-server
```


