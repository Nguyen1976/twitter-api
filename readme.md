# Twitter-api

A scalable, modular backend for a Twitter-like social platform, built with Node.js, TypeScript, Express, Sequelize, Redis, BullMQ, and gRPC.

---

## 🚀 Features

- **User Authentication**: JWT-based authentication, OTP email verification, and secure password hashing.
- **User Profile Management**: Create and manage user profiles via gRPC and REST.
- **gRPC Microservices**: Modular gRPC servers for user and auth modules, with auto-generated TypeScript clients.
- **Queue System**: Background job processing (e.g., sending OTP emails) using BullMQ and Redis.
- **CQRS Pattern**: Clear separation of command and query logic for maintainability and scalability.
- **Validation**: Robust DTO validation using Zod.
- **Database**: MySQL (via Sequelize ORM) for persistent storage.
- **Caching**: Redis for fast data access and session management.
- **Testing Ready**: Interfaces and DI patterns for easy mocking and unit testing.
- **Proto-First API**: All gRPC APIs defined with `.proto` files for strong typing and cross-language compatibility.

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

---

## 📚 License

MIT

---
