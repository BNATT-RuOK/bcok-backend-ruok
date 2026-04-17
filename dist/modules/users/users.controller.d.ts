import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): import("./entities/user.entity").User[];
    findOne(id: number): import("./entities/user.entity").User;
    create(dto: CreateUserDto): import("./entities/user.entity").User;
    update(id: number, dto: UpdateUserDto): import("./entities/user.entity").User;
    remove(id: number): {
        message: string;
    };
}
