// src/utils/idb.ts
import { openDB,type DBSchema } from 'idb';

interface UserDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      createdAt: number;
    };
    indexes: { 'by-email': string, 'by-name': string };
  };
}

export const initDB = async () => {
  return openDB<UserDB>('UserDatabase', 1, {
    upgrade(db) {
      const userStore = db.createObjectStore('users', {
        keyPath: 'id'
      });
      userStore.createIndex('by-email', 'email');
    }
  });
};

export const UserDBService = {
  async addUser(user: Omit<UserDB['users']['value'], 'id'>) {
    const db = await initDB();
    return db.add('users', {
      ...user,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    });
  },
  
  async getUserByName(name: string) {
    const db = await initDB();
    return db.getFromIndex('users', 'by-name', name);
  },
  async getUserByEmail(email: string) {
    const db = await initDB();
    return db.getFromIndex('users', 'by-email', email);
  },
  async getAllUser() {
    const db = await initDB();
    return db.getAll('users');
  }
};