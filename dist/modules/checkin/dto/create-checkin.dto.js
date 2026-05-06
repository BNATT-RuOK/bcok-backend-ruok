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
exports.CreateCheckinDto = exports.CheckinStatus = void 0;
const class_validator_1 = require("class-validator");
var CheckinStatus;
(function (CheckinStatus) {
    CheckinStatus["PENDING"] = "PENDING";
    CheckinStatus["IN_TRANSIT"] = "IN_TRANSIT";
    CheckinStatus["SAFE"] = "SAFE";
    CheckinStatus["MISSED"] = "MISSED";
})(CheckinStatus || (exports.CheckinStatus = CheckinStatus = {}));
class CreateCheckinDto {
}
exports.CreateCheckinDto = CreateCheckinDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'User ID phải là một số nguyên' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Không được bỏ trống User ID' }),
    __metadata("design:type", Number)
], CreateCheckinDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Thời gian dự kiến phải đúng chuẩn ISO 8601' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCheckinDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CheckinStatus, { message: 'Trạng thái không hợp lệ' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCheckinDto.prototype, "status", void 0);
//# sourceMappingURL=create-checkin.dto.js.map