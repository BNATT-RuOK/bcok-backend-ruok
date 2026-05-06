"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyController = void 0;
const common_1 = require("@nestjs/common");
const emergency_service_1 = require("./emergency.service");
const create_emergency_dto_1 = require("./dto/create-emergency.dto");
let EmergencyController = class EmergencyController {
    constructor(emergencyService) {
        this.emergencyService = emergencyService;
    }
    async triggerSos(createEmergencyDto) {
        return await this.emergencyService.triggerSos(createEmergencyDto);
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, common_1.Post)('sos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_emergency_dto_1.CreateEmergencyDto]),
    __metadata("design:returntype", Promise)
], EmergencyController.prototype, "triggerSos", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, common_1.Controller)('emergency'),
    __metadata("design:paramtypes", [emergency_service_1.EmergencyService])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map