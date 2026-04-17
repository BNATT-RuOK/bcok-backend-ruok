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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmergencyDto = exports.EmergencyStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var EmergencyStatus;
(function (EmergencyStatus) {
    EmergencyStatus["SOS"] = "SOS";
    EmergencyStatus["RESOLVED"] = "RESOLVED";
})(EmergencyStatus || (exports.EmergencyStatus = EmergencyStatus = {}));
class CreateEmergencyDto {
}
exports.CreateEmergencyDto = CreateEmergencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the user triggering SOS' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEmergencyDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '10.7769,106.7009',
        description: 'GPS coordinates or address string',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEmergencyDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: EmergencyStatus,
        example: EmergencyStatus.SOS,
        description: '"SOS" when alert is active, "RESOLVED" when handled',
    }),
    (0, class_validator_1.IsEnum)(EmergencyStatus),
    __metadata("design:type", String)
], CreateEmergencyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-04-17T08:00:00.000Z',
        description: 'ISO 8601 timestamp of the alert',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEmergencyDto.prototype, "timestamp", void 0);
//# sourceMappingURL=create-emergency.dto.js.map