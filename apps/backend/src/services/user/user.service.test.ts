import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserService } from './user.service';
import { User } from '@domain/entities/User';
import { createUserMock } from '@domain/mocks/user-mock';
import { mockUserRepository } from '@domain/mocks/user-repository-mock';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(() => {
    mockRepository = mockUserRepository();
    userService = new UserService(mockRepository);
  });

  afterEach(() => {
    
    mockRepository.users = [];
  });

  describe('findByEmail', () => {
    it('should find a user by email when user exists', async () => {
      // Arrange
      const testUser = createUserMock({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      });
      mockRepository.users.push(testUser);

      // Act
      const result = await userService.findByEmail('test@example.com');

      // Assert
      expect(result).toEqual(testUser);
    });

    it('should return null when user does not exist', async () => {
      // Act
      const result = await userService.findByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id when user exists', async () => {
      // Arrange
      const testUser = createUserMock({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      });
      mockRepository.users.push(testUser);

      // Act
      const result = await userService.findById('user-123');

      // Assert
      expect(result).toEqual(testUser);
    });

    it('should return null when user does not exist', async () => {
      // Act
      const result = await userService.findById('nonexistent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const newUser: Omit<User, 'id'> = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user'
      };

      // Act
      const result = await userService.create(newUser);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(newUser.name);
      expect(result.email).toBe(newUser.email);
      expect(result.password).toBe(newUser.password);
      expect(result.role).toBe(newUser.role);
      expect(mockRepository.users).toHaveLength(1);
    });

    it('should generate a unique id for new user', async () => {
      // Arrange
      const newUser: Omit<User, 'id'> = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      // Act
      const result = await userService.create(newUser);

      // Assert
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update an existing user successfully', async () => {
      // Arrange
      const existingUser = createUserMock({
        id: 'user-123',
        name: 'Old Name',
        email: 'old@example.com'
      });
      mockRepository.users.push(existingUser);

      const updatedUser: User = {
        ...existingUser,
        name: 'New Name',
        email: 'new@example.com'
      };

      // Act
      const result = await userService.update(updatedUser);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.email).toBe('new@example.com');
      expect(mockRepository.users[0].name).toBe('New Name');
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      const nonExistentUser: User = {
        id: 'nonexistent',
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      const result = await userService.update(nonExistentUser);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing user successfully', async () => {
      // Arrange
      const testUser = createUserMock({
        id: 'user-123',
        email: 'test@example.com'
      });
      mockRepository.users.push(testUser);

      // Act
      const result = await userService.delete('user-123');

      // Assert
      expect(result).toBe(true);
      expect(mockRepository.users).toHaveLength(0);
    });

    it('should return false when user does not exist', async () => {
      // Act
      const result = await userService.delete('nonexistent-id');

      // Assert
      expect(result).toBe(false);
    });
  });
});