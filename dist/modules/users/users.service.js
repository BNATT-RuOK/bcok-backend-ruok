"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = UsersService_1 = class UsersService {
    constructor() {
        this.logger = new common_1.Logger(UsersService_1.name);
        this.users = [
            {
                id: 1,
                name: 'Nguyen Van An',
                email: 'van.an@example.com',
                phone: '0901234567',
                createdAt: new Date('2025-01-10T08:00:00Z').toISOString(),
            },
            {
                id: 2,
                name: 'Tran Thi Bich',
                email: 'thi.bich@example.com',
                phone: '0912345678',
                createdAt: new Date('2025-01-15T10:30:00Z').toISOString(),
            },
            {
                id: 3,
                name: 'Le Minh Duc',
                email: 'minh.duc@example.com',
                phone: '0923456789',
                createdAt: new Date('2025-02-01T09:15:00Z').toISOString(),
            },
        ];
        this.nextId = 4;
    }
    create(dto) {
        const exists = this.users.find((u) => u.email === dto.email);
        if (exists) {
            throw new common_1.ConflictException(`Email "${dto.email}" is already registered`);
        }
        const user = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.users.push(user);
        this.logger.log(`Created user #${user.id} – ${user.name}`);
        return user;
    }
    findAll() {
        return this.users;
    }
    findOne(id) {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        return user;
    }
    update(id, dto) {
        const user = this.findOne(id);
        if (dto.name !== undefined)
            user.name = dto.name;
        if (dto.phone !== undefined)
            user.phone = dto.phone;
        this.logger.log(`Updated user #${id}`);
        return user;
    }
    remove(id) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        this.users.splice(index, 1);
        this.logger.log(`Deleted user #${id}`);
        return { message: `User #${id} deleted successfully` };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map