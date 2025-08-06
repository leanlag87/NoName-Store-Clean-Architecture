import { User } from "../entities/User";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User | null>;
    delete(id: string): Promise<void>;
}