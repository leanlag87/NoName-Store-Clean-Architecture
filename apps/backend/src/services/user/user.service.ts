import { UserRepository } from '@domain/repositories/user-repository';
import { User } from '@domain/entities/User';
import { UserResponseDto } from '../../dtos/user-response.dto';

export class UserService implements UserRepository {
  constructor(private userRepository: UserRepository) {}

  /**
   * Busca un usuario por su email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Busca un usuario por su ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(user: User): Promise<User> {
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(user: User): Promise<User | null> {
    try {
      return await this.userRepository.update(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Elimina un usuario por su ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Guarda un usuario (método adicional para compatibilidad)
   */
  async save(user: User): Promise<void> {
    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  /**
   * Convierte una entidad User a UserResponseDto
   */
  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id || '',
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Obtiene un usuario y lo convierte a DTO
   */
  async getUserResponseDto(id: string): Promise<UserResponseDto | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return this.mapToUserResponseDto(user);
  }
}