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
exports.CheckinController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const checkin_service_1 = require("./checkin.service");
const create_checkin_dto_1 = require("./dto/create-checkin.dto");
let CheckinController = class CheckinController {
    constructor(checkinService) {
        this.checkinService = checkinService;
    }
    findAll() {
        return this.checkinService.findAll();
    }
    create(dto) {
        return this.checkinService.create(dto);
    }
};
exports.CheckinController = CheckinController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all check-ins',
        description: 'Returns all location check-in records sorted by most recent.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of check-in records.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new check-in',
        description: 'User reports their current location and safety status.',
    }),
    (0, swagger_1.ApiBody)({ type: create_checkin_dto_1.CreateCheckinDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Check-in recorded successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_checkin_dto_1.CreateCheckinDto]),
    __metadata("design:returntype", void 0)
], CheckinController.prototype, "create", null);
exports.CheckinController = CheckinController = __decorate([
    (0, swagger_1.ApiTags)('Check-in'),
    (0, common_1.Controller)('checkins'),
    __metadata("design:paramtypes", [checkin_service_1.CheckinService])
], CheckinController);
//# sourceMappingURL=checkin.controller.js.map