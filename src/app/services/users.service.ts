import { delay } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { User } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly localStorageService = inject(LocalStorageService);

  private usersChanged = new Subject<void>();
  readonly usersChanged$ = this.usersChanged.asObservable();

  getUsers(delayMs: number = 1000): Observable<User[]> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    this.localStorageService.setLastIdKey(users);
    return of(users).pipe(delay(delayMs));
  }

  createUser(user: Omit<User, 'id' | 'updatedAt'>): Observable<void> {
    const users = this.localStorageService.getItem<User[]>(this.localStorageService.getUsersKey()) || [];
    const newUser: User = {
      ...user,
      id: this.generateId(),
      updatedAt: new Date()
    };

    users.push(newUser);
    this.localStorageService.setItem(this.localStorageService.getUsersKey(), users);

    // Simulate delay in creating a user
    setTimeout(() => {
      // Notify subscribers that a new user has been created
      this.usersChanged.next();
    }, 500);

    return of(void 0).pipe(delay(500));
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

  // Generate a unique id for the user
  private generateId(): number {
    const lastId = this.localStorageService.getLastIdKey();
    return lastId + 1;
  }
}
