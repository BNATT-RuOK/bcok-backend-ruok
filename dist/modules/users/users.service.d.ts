import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly logger;
    private users;
    private nextId;
    create(dto: CreateUserDto): User;
    findAll(): User[];
    findOne(id: number): User;
    update(id: number, dto: UpdateUserDto): User;
    remove(id: number): {
        message: string;
    };
}
