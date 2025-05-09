import { Injectable } from '@angular/core';
import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly USERS_KEY = 'users_data';
  private readonly LAST_ID_KEY = 'last_user_id';

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  getUsersKey(): string {
    return this.USERS_KEY;
  }

  setLastIdKey(users: User[]): void {
    const lastId = users.length ? users[users.length - 1].id : 0;
    localStorage.setItem(this.LAST_ID_KEY, lastId.toString());
  }

  getLastIdKey(): number {
    return parseInt(localStorage.getItem(this.LAST_ID_KEY) || '0');
  }
}
