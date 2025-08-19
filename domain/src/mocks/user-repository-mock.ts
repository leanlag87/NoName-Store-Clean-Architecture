import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export interface MockedUserRepository extends UserRepository {
  users: User[];
}

export function mockUserRepository(users: User[] = []): MockedUserRepository {
  return {
    users,
    findByEmail: async (email: string): Promise<User | null> => {
      const user = users.find((user) => user.email === email);
      const result = user ? { ...user } : null;
      return result;
    },
    save: async (user: User): Promise<void> => {
      const existingUserIndex = users.findIndex((u) => u.email === user.email);
      if (existingUserIndex !== -1) {
        users[existingUserIndex] = { ...user };
      } else {
        users.push({ ...user });
      }
    },
    findById: async (id: string): Promise<User | null> => {
      const user = users.find((user) => user.id === id);
      const result = user ? { ...user } : null;
      return result;
    },
    create: async (user: User): Promise<User> => {
      users.push({ ...user });
      return { ...user };
    },
    update: async (user: User): Promise<User | null> => {
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...user };
        return { ...user };
      }
      return null;
    },
    delete: async (id: string): Promise<void> => {
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
      }
    },
    findAll: async (): Promise<User[]> => {
      return Promise.resolve(users);
    },
  };
}
