# RuOK – Hybrid Safety Model: Backend REST API

[![NestJS](https://img.shields.io/badge/NestJS-v10-E0234E?logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger)](http://localhost:3000/api/docs)

Backend REST API cho ứng dụng mobile **RuOK** – giúp người dùng check-in an toàn khi di chuyển, gửi cảnh báo SOS, và chia sẻ vị trí với người thân.

---

## Cấu trúc Project

```
├── src/
│   ├── main.ts                        # Entry point + Swagger config
│   ├── app.module.ts                  # Root module
│   ├── app.controller.ts              # GET /health
│   ├── app.service.ts
│   └── modules/
│       ├── users/                     # CRUD đầy đủ
│       │   ├── dto/
│       │   │   ├── create-user.dto.ts
│       │   │   └── update-user.dto.ts
│       │   ├── entities/user.entity.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       ├── emergency/                 # SOS alerts
│       │   ├── dto/create-emergency.dto.ts
│       │   ├── entities/emergency.entity.ts
│       │   ├── emergency.controller.ts
│       │   ├── emergency.service.ts
│       │   └── emergency.module.ts
│       └── checkin/                   # Location check-ins
│           ├── dto/create-checkin.dto.ts
│           ├── entities/checkin.entity.ts
│           ├── checkin.controller.ts
│           ├── checkin.service.ts
│           └── checkin.module.ts
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

---

## Chạy Local

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động development server

```bash
npm run start:dev
```

### 3. Truy cập Swagger UI

```
http://localhost:3000/api/docs
```

Tất cả API có thể test trực tiếp trên Swagger UI.

---

## API Endpoints

### Health
| Method | Endpoint  | Mô tả               |
|--------|-----------|---------------------|
| GET    | `/health` | Kiểm tra server     |

###  Users (CRUD)
| Method | Endpoint      | Mô tả                |
|--------|---------------|----------------------|
| GET    | `/users`      | Lấy tất cả users     |
| GET    | `/users/:id`  | Lấy user theo ID     |
| POST   | `/users`      | Tạo user mới         |
| PUT    | `/users/:id`  | Cập nhật user        |
| DELETE | `/users/:id`  | Xóa user             |

### Emergency (SOS)
| Method | Endpoint          | Mô tả                     |
|--------|-------------------|---------------------------|
| GET    | `/emergency`      | Lấy tất cả SOS alerts     |
| GET    | `/emergency/:id`  | Lấy SOS alert theo ID     |
| POST   | `/emergency`      | Tạo SOS alert mới         |
| DELETE | `/emergency/:id`  | Xóa SOS alert             |

### Check-in
| Method | Endpoint     | Mô tả                       |
|--------|--------------|-----------------------------|
| GET    | `/checkins`  | Lấy tất cả check-ins        |
| POST   | `/checkins`  | Tạo check-in mới            |

---

## Ví dụ Request/Response

### POST /users
```json
// Request body
{
  "name": "Nguyen Van An",
  "email": "van.an@example.com",
  "phone": "0901234567"
}

// Response 201
{
  "id": 4,
  "name": "Nguyen Van An",
  "email": "van.an@example.com",
  "phone": "0901234567",
  "createdAt": "2025-04-17T10:00:00.000Z"
}
```

### POST /emergency
```json
// Request body
{
  "userId": 1,
  "location": "10.7769,106.7009",
  "status": "SOS",
  "timestamp": "2025-04-17T10:00:00.000Z"
}

// Response 201
{
  "id": 3,
  "userId": 1,
  "location": "10.7769,106.7009",
  "status": "SOS",
  "timestamp": "2025-04-17T10:00:00.000Z",
  "createdAt": "2025-04-17T10:00:00.000Z"
}
```

### POST /checkins
```json
// Request body
{
  "userId": 2,
  "location": "Vincom Center, Quận 1",
  "status": "SAFE",
  "timestamp": "2025-04-17T10:30:00.000Z"
}

// Response 201
{
  "id": 4,
  "userId": 2,
  "location": "Vincom Center, Quận 1",
  "status": "SAFE",
  "timestamp": "2025-04-17T10:30:00.000Z",
  "createdAt": "2025-04-17T10:30:00.000Z"
}
```

---

## Deploy trên Azure (TBD)

## Build Production

```bash
npm run build       # Compile TypeScript → dist/
npm run start:prod  # Chạy file đã build
```

---

## Tech Stack

- **Framework**: NestJS v10
- **Language**: TypeScript 5.x
- **Validation**: class-validator + class-transformer
- **Documentation**: @nestjs/swagger (Swagger UI)
- **Database**: In-memory array (cập nhật DB sau (optional))
- **Deploy**: Azure

---

## Seed Data

Project đã có sẵn dữ liệu mẫu:

| Collection | Số records |
|------------|------------|
| Users      | 3          |
| Emergency  | 2          |
| Check-ins  | 3          |
