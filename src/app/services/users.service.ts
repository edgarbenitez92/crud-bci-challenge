import { delay } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '../shared/interfaces/user.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);

  getUsers(delayMs: number = 1000): Observable<User[]> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    return of(users).pipe(delay(delayMs));
  }

  createUser(user: Omit<User, 'id' | 'updatedAt'>): Observable<void> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    const newUser: User = {
      ...user,
      id: this.generateId(users),
      updatedAt: new Date()
    };

    users.push(newUser);
    this.localStorageService.setItem(this.localStorageService.getUsersKey(), users);
    return of(void 0).pipe(delay(1000));
  }

  updateUser(userId: number, userData: Partial<User>): Observable<void> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date()
      };
      this.localStorageService.setItem(this.localStorageService.getUsersKey(), users);
    }

    return of(void 0).pipe(delay(1000));
  }

  deleteUser(userId: number): Observable<void> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    const updatedUsers = users.filter(user => user.id !== userId);
    this.localStorageService.setItem(this.localStorageService.getUsersKey(), updatedUsers);

    return of(void 0).pipe(delay(1000));
  }

  private generateId(users: User[]): number {
    return users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }
}
