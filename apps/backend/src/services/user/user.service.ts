import { User } from "@domain/entities/User";
import { UserRepository } from "@domain/repositories/user-repository";
import { createNotFoundError } from "@domain/errors/error";
import { UserResponseDto } from "../../dtos/user-response.dto";
import UserModel from "../../database/models/user";

export function userService(): UserRepository {
  const _mapToUserEntity = (user: UserModel): User => {
    return {
      id: user.id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      image: user.image,
      validated: user.validated,
      locked: user.locked,
      token: user.token,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  return {
    async findByEmail(email: string): Promise<User> {
      const user = await UserModel.findOne({
        where: { email },
      });
      if (!user) {
        throw createNotFoundError("No existe un usuario con el email " + email);
      }
      return _mapToUserEntity(user);
    },

    async findById(id: string): Promise<User> {
      const user = await UserModel.findByPk(id);
      if (!user) {
        throw createNotFoundError("No existe un usuario con el ID " + id);
      }
      return _mapToUserEntity(user);
    },

    async findAll(): Promise<User[]> {
      const users = await UserModel.findAll();
      return users.map(_mapToUserEntity);
    },

    async create(user: User): Promise<User> {
      const newUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role || "user",
      });
      return _mapToUserEntity(newUser);
    },

    async update(user: User): Promise<User> {
      const userToUpdate = await UserModel.findByPk(user.id);
      if (!userToUpdate) {
        throw createNotFoundError("No existe un usuario con el ID " + user.id);
      }

      userToUpdate.update({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });

      const updatedUser = await userToUpdate.save();
      return _mapToUserEntity(updatedUser);
    },

    async delete(id: string): Promise<void> {
      const userToDelete = await UserModel.findByPk(id);
      if (!userToDelete) {
        throw createNotFoundError("No existe un usuario con el ID " + id);
      }
      await userToDelete.destroy();
    },

    async save(user: User): Promise<void> {
      if (user.id) {
        await this.update(user);
      } else {
        await this.create(user);
      }
    },
  };
}

export function getUserForResponse(user: User): UserResponseDto {
  return {
    id: user.id!,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
