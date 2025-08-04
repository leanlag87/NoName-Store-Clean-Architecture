import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/user-repository';
import { UserResponseDto } from '../../dtos/user-response.dto';
import UserModel from '../../database/models/user';

export function userService(): UserRepository {
  const _mapToUserResponseDto = (user: UserModel): UserResponseDto => {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  const _mapToUser = (user: UserModel): User => {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  return {
    // Find user by email - INTERNO (necesita password para login)
    async findByEmail(email: string): Promise<User | null> {
      try {
        const user = await UserModel.findOne({
          where: { email }
        });
        if (!user) return null;
        return _mapToUser(user); // Usa _mapToUser porque es para login
      } catch (error) {
        console.log('Error finding user by email:', error);
        return null;
      }
    },

    // Find user by id - INTERNO (necesita password para validación)
    async findById(id: string): Promise<User | null> {
      try {
        const user = await UserModel.findByPk(id);
        if (!user) return null;
        return _mapToUser(user); // Usa _mapToUser porque es interno
      } catch (error) {
        console.log('Error finding user by id:', error);
        return null;
      }
    },

    // Create user - INTERNO (necesita password para guardar)
    async create(user: User): Promise<User> {
      try {
        const newUser = await UserModel.create({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role || 'user'
        });
        return _mapToUser(newUser); // Usa _mapToUser porque es interno
      } catch (error) {
        console.log('Error creating user:', error);
        throw error;
      }
    },

    // Update user - INTERNO (necesita password para actualizar)
    async update(user: User): Promise<User | null> {
      try {
        const userToUpdate = await UserModel.findByPk(user.id);
        if (!userToUpdate) return null;
        
        userToUpdate.update({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        });
        
        const updatedUser = await userToUpdate.save();
        return _mapToUser(updatedUser); // Usa _mapToUser porque es interno
      } catch (error) {
        console.log('Error updating user:', error);
        return null;
      }
    },

    // Delete user - INTERNO
    async delete(id: string): Promise<void> {
      try {
        const userToDelete = await UserModel.findByPk(id);
        if (userToDelete) {
          await userToDelete.destroy();
        }
      } catch (error) {
        console.log('Error deleting user:', error);
        throw error;
      }
    },

    // Save user - INTERNO
    async save(user: User): Promise<void> {
      try {
        if (user.id) {
          await this.update(user);
        } else {
          await this.create(user);
        }
      } catch (error) {
        console.log('Error saving user:', error);
        throw error;
      }
    }
  };
}