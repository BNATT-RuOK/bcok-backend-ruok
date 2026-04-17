"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CheckinService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinService = void 0;
const common_1 = require("@nestjs/common");
const create_checkin_dto_1 = require("./dto/create-checkin.dto");
let CheckinService = CheckinService_1 = class CheckinService {
    constructor() {
        this.logger = new common_1.Logger(CheckinService_1.name);
        this.checkins = [
            {
                id: 1,
                userId: 1,
                location: 'Vincom Center, Quận 1, TP.HCM',
                status: create_checkin_dto_1.CheckinStatus.SAFE,
                timestamp: '2025-04-15T09:00:00.000Z',
                createdAt: new Date('2025-04-15T09:00:00Z').toISOString(),
            },
            {
                id: 2,
                userId: 2,
                location: 'Hồ Hoàn Kiếm, Hà Nội',
                status: create_checkin_dto_1.CheckinStatus.IN_TRANSIT,
                timestamp: '2025-04-17T07:45:00.000Z',
                createdAt: new Date('2025-04-17T07:45:00Z').toISOString(),
            },
            {
                id: 3,
                userId: 3,
                location: 'Bãi biển Mỹ Khê, Đà Nẵng',
                status: create_checkin_dto_1.CheckinStatus.SAFE,
                timestamp: '2025-04-17T08:30:00.000Z',
                createdAt: new Date('2025-04-17T08:30:00Z').toISOString(),
            },
        ];
        this.nextId = 4;
    }
    create(dto) {
        const checkin = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.checkins.push(checkin);
        this.logger.log(`✅ Check-in #${checkin.id} – user #${dto.userId} is ${dto.status} at ${dto.location}`);
        return checkin;
    }
    findAll() {
        return this.checkins;
    }
};
exports.CheckinService = CheckinService;
exports.CheckinService = CheckinService = CheckinService_1 = __decorate([
    (0, common_1.Injectable)()
], CheckinService);
//# sourceMappingURL=checkin.service.js.map