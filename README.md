
# SalesFlow CRM

SalesFlow CRM is a full-stack CRM application under development. It is designed to help small and medium-sized businesses organize companies, contacts, leads, deals, tasks, and sales activities.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query

### Backend
- Node.js
- Express
- TypeScript
- REST API

### Database and Authentication
- PostgreSQL
- Prisma ORM
- Better Auth

## Implemented So Far

- React application shell and navigation
- Login and registration interfaces
- Authentication and protected routes
- Workspace onboarding and membership model
- PostgreSQL database migrations
- Workspace-scoped Companies REST API
- Company CRUD endpoints, search, sorting, and pagination

## Planned Features

- Companies management interface
- Contacts management
- Lead tracking
- Deals and sales pipeline
- Tasks and customer activity history
- Dashboard analytics
- Workspace roles and permissions
- Automated tests
- Production deployment

## Development Status

This project is under active development. Features and architecture may evolve as development continues.

## Local Development

The project contains two applications:

- `client/` — React frontend
- `server/` — Express API

Configure environment variables using the provided `.env.example` files. Install dependencies in each application, configure a local PostgreSQL database, run the Prisma migrations and generate the Prisma Client before starting the applications.

Never commit `.env` files or real credentials.
