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

## Backend Overview

Hệ thống RuOK sử dụng backend REST API xây dựng bằng **NestJS 11** và **TypeScript**, được triển khai trên **Azure Web App**. Backend đóng vai trò trung tâm xử lý xác thực người dùng, quản lý người liên hệ tin cậy, quản lý lịch check-in, tiếp nhận tín hiệu SOS và điều phối các thông báo khẩn cấp. API được công bố qua Swagger UI tại địa chỉ triển khai production để nhóm dễ dàng kiểm thử và minh họa trong quá trình demo.

## API Documentation and Production Deployment

Backend đã được deploy công khai trên Azure Web App và cung cấp tài liệu API thông qua Swagger/OpenAPI:

- **Swagger API Documentation:** `https://ruok.azurewebsites.net/api/docs`
- **Hosting Platform:** Azure Web App
- **Deployment Pipeline:** GitHub Actions
- **Trigger:** workflow tự động chạy khi source code được push vào branch `main`

Quy trình triển khai gồm các bước: checkout source code, thiết lập Node.js 22, cài đặt dependencies, sinh Prisma Client, build ứng dụng NestJS và triển khai package lên Azure Web App. Việc tích hợp CI/CD giúp API trên môi trường demo luôn đồng bộ với phiên bản backend mới nhất của nhóm.

## Live Services

| Service | Address / Platform |
|---|---|
| Backend API | `https://ruok.azurewebsites.net` |
| Swagger API Documentation | `https://ruok.azurewebsites.net/api/docs` |
| Hosting | Azure Web App |
| Database | PostgreSQL through Prisma ORM |
| SOS Media Storage | Azure Blob Storage – Private Container |

> Swagger trên môi trường deploy chỉ phản ánh endpoint mới sau khi backend mới được deploy thành công.

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, TypeScript |
| Authentication | Passport JWT, bcrypt |
| Database | PostgreSQL, Prisma ORM |
| Media Storage | Azure Blob Storage |
| Media Access | Short-lived Shared Access Signature (SAS) |
| Email Alert | Nodemailer + Brevo SMTP |
| Push Alert | Expo Server SDK |
| API Docs | Swagger / OpenAPI |
| Deployment | Azure Web App + GitHub Actions |

## Updated SOS Media Architecture

Ảnh và ghi âm SOS là dữ liệu nhạy cảm. Container media được giữ ở chế độ **Private (no anonymous access)**. Mobile app upload media bằng URL có quyền ghi ngắn hạn; trusted contact xem media qua URL có quyền đọc và thời hạn giới hạn được backend chèn vào email/push notification.

```mermaid
sequenceDiagram
    participant S as Student Mobile App
    participant API as NestJS API
    participant Blob as Private Azure Blob
    participant DB as PostgreSQL
    participant C as Trusted Contact

    S->>API: GET /emergency/upload-url?type=photo|audio + JWT
    API-->>S: uploadUrl (Write SAS, 5 min) + blobUrl (no SAS)
    S->>Blob: PUT binary file to uploadUrl
    S->>API: POST /emergency/sos + JWT<br/>{latitude, longitude, photoUrl, audioUrl}
    API->>DB: Save SOS_ALERT with original blob URLs
    API->>API: Generate Read SAS URL (24 hours)
    API-->>C: Brevo Email / Expo Push with media links
```

### Access Control Policy

| Resource | Access | Expiration | Purpose |
|---|---:|---:|---|
| Blob container | Private | — | Không công khai media SOS |
| Upload SAS URL | `create`, `write` | 5 phút | App tải ảnh/audio lên đúng blob |
| Read SAS URL | `read` | 24 giờ | Trusted contact xem media tạm thời |
| URL trong database | Không chứa SAS | — | Lưu tham chiếu ổn định |

## Security Changes

Emergency API hiện dùng JWT để xác định sinh viên kích hoạt cảnh báo:

- `GET /emergency/upload-url?type=photo|audio` yêu cầu Bearer JWT.
- `POST /emergency/sos` yêu cầu Bearer JWT.
- Frontend **không gửi `userId`** trong request upload URL hoặc request SOS.
- Backend lấy `userId` từ `req.user.userId`.
- Query `type` chỉ chấp nhận `photo` hoặc `audio`.
- DTO SOS nhận vị trí và URL media hợp lệ dưới dạng optional fields.

## Core API Endpoints

### Authentication and User Safety

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/health` | No | Check backend status |
| POST | `/auth/register` | No | Register and return JWT |
| POST | `/auth/login` | No | Login and return JWT |
| GET | `/users/:id` | Bearer JWT | Get user profile |
| PUT | `/users/:id` | Bearer JWT | Update profile/safety settings |
| POST | `/contacts` | Bearer JWT | Add trusted contact |
| GET | `/contacts` | Bearer JWT | Get trusted contacts |
| PUT | `/contacts/:phone` | Bearer JWT | Update trusted contact |
| DELETE | `/contacts/:phone` | Bearer JWT | Delete trusted contact |

### Check-in and Emergency

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/checkin` | Theo implementation hiện tại | Create check-in |
| GET | `/checkin` | Theo implementation hiện tại | Get check-ins |
| PATCH | `/checkin/:id/safe` | Theo implementation hiện tại | Mark safe |
| GET | `/emergency/upload-url?type=photo|audio` | Bearer JWT | Generate upload SAS URL |
| POST | `/emergency/sos` | Bearer JWT | Trigger authenticated SOS |

## Emergency Media API Contract

### 1. Request Upload SAS URL

```http
GET /emergency/upload-url?type=photo
Authorization: Bearer <access_token>
```

Response:

```json
{
  "uploadUrl": "https://<account>.blob.core.windows.net/ruok-sos-media/sos/1/1716560000000_photo.jpg?<write-sas-token>",
  "blobUrl": "https://<account>.blob.core.windows.net/ruok-sos-media/sos/1/1716560000000_photo.jpg"
}
```

- `uploadUrl` chỉ dùng để upload file bằng `PUT`.
- `blobUrl` không chứa token; frontend gửi URL này trong SOS payload.
- Backend tự tạo Read SAS URL khi gửi email/push.

### 2. Upload Media to Blob Storage

```http
PUT <uploadUrl>
x-ms-blob-type: BlockBlob
Content-Type: image/jpeg

<binary photo data>
```

Đối với audio, dùng `Content-Type: audio/m4a`.

### 3. Trigger SOS

```http
POST /emergency/sos
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "latitude": 10.7721,
  "longitude": 106.6578,
  "photoUrl": "https://<account>.blob.core.windows.net/ruok-sos-media/sos/1/1716560000000_photo.jpg",
  "audioUrl": "https://<account>.blob.core.windows.net/ruok-sos-media/sos/1/1716560000001_audio.m4a"
}
```

Các trường đều optional. Request **không chứa `userId`**.

## Notification Behaviour

Khi SOS được kích hoạt:

1. Backend xác thực sinh viên qua JWT và kiểm tra người dùng trong database.
2. Tạo bản ghi `SOS_ALERT` với `photo_url` và `audio_url` gốc, không có SAS token.
3. Sinh Read SAS URL chỉ có quyền đọc, hiệu lực 24 giờ.
4. Gửi email qua Brevo: thông tin cảnh báo, link bản đồ, ảnh inline và link nghe audio khi có.
5. Gửi Expo push payload gồm `sosId`, `photoUrl`, `audioUrl` khi contact có push token.

Một số email client có thể yêu cầu người nhận bấm **Display images** trước khi hiển thị ảnh từ URL ngoài.

## Database Change

Model `SOS_ALERT` bổ sung trường audio evidence:

```prisma
model SOS_ALERT {
  sos_id        Int            @id @default(autoincrement())
  user_id       Int?
  trigger_type  String?        @db.VarChar
  triggered_at  DateTime?      @default(now()) @db.Timestamptz(6)
  latitude      Decimal?       @db.Decimal
  longitude     Decimal?       @db.Decimal
  photo_url     String?        @db.VarChar
  audio_url     String?        @db.VarChar
  status        String?        @db.VarChar
  NOTIFICATION  NOTIFICATION[]
  USER          USER?          @relation(fields: [user_id], references: [user_id], onDelete: NoAction, onUpdate: NoAction)
}
```

Apply migration before testing audio media in production:

```bash
npx prisma migrate dev --name add_audio_url_to_sos_alert
npx prisma generate
```

Khi migration đã commit, pipeline production nên chạy:

```bash
npx prisma migrate deploy
```

## Required Environment Variables

### Local `.env`

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"

JWT_SECRET="replace-with-a-strong-secret"
JWT_EXPIRES_IN="7d"

BREVO_HOST="smtp-relay.brevo.com"
BREVO_PORT="587"
BREVO_USER="your-brevo-smtp-user"
BREVO_PASSWORD="your-brevo-smtp-key"
BREVO_SENDER="your-verified-sender@example.com"

AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER_NAME="ruok-sos-media"
```

Do not commit `.env`.

### Azure Web App App Settings

Configure runtime values at:

```text
Azure Portal → App Services → ruok → Settings → Environment variables → App settings
```

| Setting | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection for Prisma |
| `JWT_SECRET` | JWT signing/validation secret |
| `JWT_EXPIRES_IN` | JWT duration, e.g. `7d` |
| `BREVO_HOST` | Brevo SMTP host |
| `BREVO_PORT` | Brevo SMTP port |
| `BREVO_USER` | Brevo SMTP username |
| `BREVO_PASSWORD` | Brevo SMTP key/password |
| `BREVO_SENDER` | Verified alert sender |
| `AZURE_STORAGE_CONNECTION_STRING` | Connect Blob Storage and create SAS URLs |
| `AZURE_STORAGE_CONTAINER_NAME` | Media container, e.g. `ruok-sos-media` |

After updating App Settings, apply and restart Azure Web App. A new source build is not required when only environment variable values change.

### Azure Blob Container

```text
Container name: ruok-sos-media
Anonymous access level: Private (no anonymous access)
```

## Frontend Integration Requirements

The Expo mobile app must:

1. Attach JWT when requesting `/emergency/upload-url` and sending `/emergency/sos`.
2. Not send `userId` in either request.
3. Upload captured binary files directly to Azure Blob using returned `uploadUrl`.
4. Send only the returned `blobUrl` values in the SOS payload.
5. Keep GPS coordinates optional; do not replace unavailable location with `(0, 0)`.
6. Continue sending SOS even when one media upload fails.

## Build and Verification

Install dependency added for Blob Storage:

```bash
npm install @azure/storage-blob
```

Before committing backend changes:

```bash
npx prisma validate
npx prisma generate
npm run build
```

After deployment:

1. Confirm Azure App Settings contain `AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_CONTAINER_NAME`.
2. Restart Web App after changing settings.
3. Authenticate in Swagger.
4. Test `GET /emergency/upload-url?type=photo`.
5. Trigger SOS from the mobile app.
6. Confirm photo/audio blobs exist in the private container.
7. Confirm `SOS_ALERT.photo_url` and `SOS_ALERT.audio_url` are stored.
8. Confirm trusted contact email contains image and/or audio link.

## Recommended Future Improvements

- Use Managed Identity and User Delegation SAS instead of Storage Account key-based SAS.
- Store secrets through Azure Key Vault references.
- Run `prisma migrate deploy` in the deployment workflow.
- Track notification delivery status as `SENT` or `FAILED`.
- Escape dynamic data before inserting it into HTML email templates.

## References

- Swagger API Docs: `https://ruok.azurewebsites.net/api/docs`
- Azure App Settings: `https://learn.microsoft.com/azure/app-service/configure-common`
- Azure SAS Overview: `https://learn.microsoft.com/azure/storage/common/storage-sas-overview`
- Azure Blob Anonymous Access: `https://learn.microsoft.com/azure/storage/blobs/anonymous-read-access-configure`
