"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmergencyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const create_emergency_dto_1 = require("./dto/create-emergency.dto");
let EmergencyService = EmergencyService_1 = class EmergencyService {
    constructor() {
        this.logger = new common_1.Logger(EmergencyService_1.name);
        this.emergencies = [
            {
                id: 1,
                userId: 1,
                location: '10.7769,106.7009',
                status: create_emergency_dto_1.EmergencyStatus.RESOLVED,
                timestamp: '2025-03-10T14:22:00.000Z',
                createdAt: new Date('2025-03-10T14:22:00Z').toISOString(),
            },
            {
                id: 2,
                userId: 2,
                location: '21.0285,105.8542',
                status: create_emergency_dto_1.EmergencyStatus.SOS,
                timestamp: '2025-04-17T08:05:00.000Z',
                createdAt: new Date('2025-04-17T08:05:00Z').toISOString(),
            },
        ];
        this.nextId = 3;
    }
    create(dto) {
        const emergency = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.emergencies.push(emergency);
        this.logger.warn(`🆘 New SOS alert #${emergency.id} from user #${dto.userId} at ${dto.location}`);
        return emergency;
    }
    findAll() {
        return this.emergencies;
    }
    findOne(id) {
        const emergency = this.emergencies.find((e) => e.id === id);
        if (!emergency) {
            throw new common_1.NotFoundException(`Emergency alert #${id} not found`);
        }
        return emergency;
    }
    remove(id) {
        const index = this.emergencies.findIndex((e) => e.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Emergency alert #${id} not found`);
        }
        this.emergencies.splice(index, 1);
        this.logger.log(`Removed emergency alert #${id}`);
        return { message: `Emergency alert #${id} deleted successfully` };
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = EmergencyService_1 = __decorate([
    (0, common_1.Injectable)()
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map