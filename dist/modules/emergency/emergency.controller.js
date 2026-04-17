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
const swagger_1 = require("@nestjs/swagger");
const emergency_service_1 = require("./emergency.service");
const create_emergency_dto_1 = require("./dto/create-emergency.dto");
let EmergencyController = class EmergencyController {
    constructor(emergencyService) {
        this.emergencyService = emergencyService;
    }
    findAll() {
        return this.emergencyService.findAll();
    }
    findOne(id) {
        return this.emergencyService.findOne(id);
    }
    create(dto) {
        return this.emergencyService.create(dto);
    }
    remove(id) {
        return this.emergencyService.remove(id);
    }
};
exports.EmergencyController = EmergencyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all emergency alerts',
        description: 'Returns all SOS and resolved emergency records.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of emergency alerts.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get emergency alert by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency alert found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency alert not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new SOS alert',
        description: 'Triggers a new emergency (SOS) event for the given user and location.',
    }),
    (0, swagger_1.ApiBody)({ type: create_emergency_dto_1.CreateEmergencyDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Emergency alert created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_emergency_dto_1.CreateEmergencyDto]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an emergency alert record' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency alert deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergency alert not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmergencyController.prototype, "remove", null);
exports.EmergencyController = EmergencyController = __decorate([
    (0, swagger_1.ApiTags)('Emergency'),
    (0, common_1.Controller)('emergency'),
    __metadata("design:paramtypes", [emergency_service_1.EmergencyService])
], EmergencyController);
//# sourceMappingURL=emergency.controller.js.map