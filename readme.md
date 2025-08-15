# Twitter-api

A scalable, modular backend for a Twitter-like social platform, built with Node.js, TypeScript, Express, Sequelize, Redis, BullMQ, and gRPC.

---

## 🚀 Features

- **User Authentication**: JWT-based authentication, OTP email verification, and secure password hashing.
- **User Profile Management**: Create and manage user profiles via gRPC and REST.
- **gRPC Microservices Ready**: Modular gRPC servers for user and auth modules, with auto-generated TypeScript clients.
- **Queue System**: Background job processing (e.g., sending OTP emails) using BullMQ and Redis.
- **CQRS Pattern**: Clear separation of command and query logic for maintainability and scalability.
- **Validation**: Robust DTO validation using Zod.
- **Database**: MySQL (via Sequelize ORM) for persistent storage.
- **Caching**: Redis for fast data access and session management.
- **Testing Ready**: Interfaces and DI patterns for easy mocking and unit testing.
- **Proto-First API**: All gRPC APIs defined with `.proto` files for strong typing and cross-language compatibility.

---

## 🏗️ Architecture

- **Monolith-first, Microservices-ready**:  
  The project is structured as a modular monolith, where each domain (auth, user, etc.) is a self-contained module.  
  Each module exposes its own REST and/or gRPC API, and communicates via well-defined interfaces and contracts.  
  This makes it easy to **extract any module into a standalone microservice** in the future with minimal refactoring.

- **Clean Architecture Principles**:  
  - **Domain Layer**: Entities, value objects, and business rules.
  - **Application Layer**: Use-cases, command/query handlers, DTOs.
  - **Interface Layer**: Controllers (REST/gRPC), repositories (interfaces), DTOs.
  - **Infrastructure Layer**: Database, Redis, gRPC server/client, queue, external services.

- **CQRS**:  
  Commands and queries are separated for clarity and scalability.

---

## 🛠️ Technologies

- **Node.js** & **TypeScript**
- **Express** (REST API)
- **gRPC** (`@grpc/grpc-js`, `@grpc/proto-loader`)
- **Sequelize** (MySQL ORM)
- **Redis** (cache, session, queue backend)
- **BullMQ** (background jobs/queues)
- **Zod** (schema validation)
- **Jest** (unit testing)
- **Postman** (API & gRPC testing)

---

## 📦 Project Structure

```
src/
├── modules/
│   ├── auth/         # Authentication & authorization (REST + gRPC)
│   └── user/         # User profile & social features (REST + gRPC)
├── share/
│   ├── component/    # Shared services (JWT, Email, OTP, Redis, etc.)
│   ├── grpc/         # Base gRPC server/client utilities
│   ├── interface/    # Common interfaces & contracts
│   ├── middleware/   # Express middlewares (auth, error handling, etc.)
│   ├── protos/       # .proto files for gRPC APIs
│   └── queue/        # BullMQ queue setup & services
└── index.ts          # App entry point
```

---

## 🧩 Main Modules

- **Auth Module**
  - REST & gRPC endpoints for login, register, OTP, JWT
  - BullMQ queue for OTP email sending
  - Sequelize + Redis repositories

- **User Module**
  - gRPC endpoints for user profile CRUD
  - CQRS use-cases and command/query handlers
  - DTO validation with Zod

---

## ⚡ How to Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and update MySQL, Redis, JWT, Email configs.

3. **Start MySQL & Redis**
   - Make sure both services are running and accessible.

4. **Run the server**
   ```bash
   npm run dev
   ```

5. **Test gRPC**
   - Use Postman or `grpcurl` with the proto files in `src/share/protos/`.

---

## 📝 Notes

- All gRPC methods must match exactly (case-sensitive) between proto and implementation.
- Queue jobs (e.g., OTP email) are processed in the background and are non-blocking for API requests.
- The codebase is organized for easy extension with new modules and microservices.
- **Monolith-first, microservices-ready**: Each module can be extracted into a microservice with minimal changes thanks to clean architecture and interface-driven design.

---

## 📚 License

MIT

---