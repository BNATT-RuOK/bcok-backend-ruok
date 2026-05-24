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

## Backend Modules

| Module | Vai trò trong hệ thống |
|---|---|
| Health | Kiểm tra trạng thái hoạt động và uptime của API server |
| Auth | Đăng ký, đăng nhập và sinh JWT access token |
| Users | Quản lý thông tin người dùng và cấu hình an toàn |
| Contacts | Quản lý danh sách trusted contacts của người dùng |
| Check-in | Tạo lịch xác nhận an toàn và cập nhật trạng thái SAFE |
| Emergency | Nhận yêu cầu SOS thủ công và tạo cảnh báo khẩn cấp |
| Notification | Gửi email qua Brevo và push notification qua Expo Push Service |
| Scheduler | Kiểm tra missed check-in theo chu kỳ mỗi phút |

## API Endpoint Summary

| Nhóm API | Method & Endpoint | Mục đích |
|---|---|---|
| Health | `GET /health` | Kiểm tra trạng thái backend |
| Auth | `POST /auth/register` | Đăng ký và nhận JWT token |
| Auth | `POST /auth/login` | Đăng nhập và nhận JWT token |
| Users | `GET /users` | Lấy danh sách người dùng |
| Users | `GET /users/:id` | Lấy thông tin người dùng theo ID |
| Users | `PUT /users/:id` | Cập nhật hồ sơ và thiết lập safety |
| Contacts | `POST /contacts` | Thêm trusted contact |
| Contacts | `GET /contacts` | Xem danh sách trusted contacts |
| Contacts | `PUT /contacts/:phone` | Cập nhật trusted contact |
| Contacts | `DELETE /contacts/:phone` | Xóa trusted contact |
| Check-in | `POST /checkin` | Tạo lịch check-in |
| Check-in | `PATCH /checkin/:id/safe` | Xác nhận người dùng an toàn |
| Emergency | `POST /emergency/sos` | Kích hoạt SOS thủ công |

## Database Design

Backend sử dụng **Prisma ORM** để làm việc với **PostgreSQL**. Cơ sở dữ liệu gồm năm nhóm dữ liệu cốt lõi:

| Table | Ý nghĩa |
|---|---|
| `USER` | Lưu tài khoản, mật khẩu đã hash và các thiết lập an toàn |
| `CONTACT` | Lưu người liên hệ khẩn cấp, email và Expo Push Token |
| `CHECKIN` | Lưu lịch check-in, thời gian xác nhận và trạng thái |
| `SOS_ALERT` | Lưu cảnh báo khẩn cấp do người dùng bấm SOS hoặc bỏ lỡ check-in |
| `NOTIFICATION` | Lưu lịch sử gửi thông báo đến trusted contact |

## Manual SOS Processing Flow

Khi sinh viên kích hoạt tính năng SOS, mobile app gửi yêu cầu đến endpoint `POST /emergency/sos`, bao gồm mã người dùng, tọa độ GPS và đường dẫn ảnh nếu có. Backend tạo một bản ghi `SOS_ALERT` với loại cảnh báo `MANUAL_SOS`. Sau đó, backend truy vấn danh sách trusted contacts của sinh viên và gửi cảnh báo qua hai kênh: email thông qua Brevo SMTP và push notification thông qua Expo Push Service. Mỗi lần gửi cảnh báo được lưu vào bảng `NOTIFICATION` để có thể theo dõi lịch sử xử lý.

```text
Student activates SOS
→ Mobile App sends GPS/photo URL
→ POST /emergency/sos
→ Store SOS_ALERT in PostgreSQL
→ Retrieve trusted contacts
→ Send Brevo email / Expo push notification
→ Save NOTIFICATION history
```

## Missed Check-in Monitoring Flow

Hệ thống có cơ chế giám sát thụ động để hỗ trợ trường hợp sinh viên không thể tự nhấn SOS. Người dùng tạo lịch check-in với thời gian dự kiến. Nếu đến hạn mà trạng thái vẫn là `PENDING`, scheduler của backend, chạy mỗi phút, xác định lượt check-in bị bỏ lỡ. Backend chuyển trạng thái sang `MISSED`, tạo một cảnh báo `SOS_ALERT` với loại `MISSED_CHECKIN`, sau đó gửi email cảnh báo tới trusted contacts.

```text
Student schedules check-in
→ CHECKIN status = PENDING
→ Scheduler scans overdue records every minute
→ Status updated to MISSED
→ SOS_ALERT type = MISSED_CHECKIN is created
→ Alert email is sent to trusted contacts
```

## Authentication and Security

Backend đã triển khai cơ chế đăng ký và đăng nhập sử dụng JWT. Sau khi xác thực thành công, client nhận `access_token` và sử dụng token dưới dạng Bearer Token để truy cập các API được bảo vệ, tiêu biểu là API quản lý trusted contacts và một số API hồ sơ người dùng.

Tuy nhiên, trong implementation hiện tại, các API check-in và manual SOS chưa được gắn JWT guard. Đây là hạn chế cần được nêu rõ trong report: phiên bản hiện tại phù hợp cho demo chức năng, nhưng trước khi triển khai production cần bảo vệ các endpoint quan trọng, đồng thời lấy `userId` từ JWT thay vì cho client tự truyền trực tiếp trong request body.

## Technologies Applied

| Purpose | Technology |
|---|---|
| Backend API framework | NestJS 11 |
| Programming language | TypeScript |
| Database access | Prisma ORM |
| Database | PostgreSQL |
| Authentication | JWT, Passport, bcrypt |
| API testing/documentation | Swagger/OpenAPI |
| Missed check-in automation | NestJS Scheduler / Cron |
| Push notification | Expo Server SDK |
| Email alert | Nodemailer + Brevo SMTP |
| Deployment | Azure Web App |
| Automation | GitHub Actions |

## Future Improvements

Để hệ thống đạt mức sẵn sàng production cao hơn, nhóm có thể thực hiện các cải tiến sau:

1. Bảo vệ toàn bộ endpoint liên quan đến dữ liệu cá nhân, check-in và SOS bằng JWT authentication.
2. Lưu và tải ảnh SOS lên Azure Blob Storage, sau đó chỉ lưu URL an toàn trong database.
3. Gửi push notification cho cả luồng missed check-in thay vì chỉ gửi email.
4. Tích hợp Azure Application Insights hoặc hệ thống giám sát tương đương để theo dõi lỗi và hiệu năng backend.
5. Bổ sung integration testing cho luồng đăng nhập, SOS, check-in và notification.
6. Cập nhật Swagger decorators đầy đủ cho Check-in và Emergency để tài liệu API thể hiện request/response rõ ràng hơn.
